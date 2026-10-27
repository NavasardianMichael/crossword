# Production setup

The one-time, app-specific steps to run Crossword AI on the server, in order. Assumed to be in
place already, so nothing here creates a user or installs them:

- the existing `michael` user, with sudo
- Node 24, and pnpm in `/home/michael/.local/bin`
- Docker, with `michael` in the `docker` group: the deploy runs `docker compose` as `michael`,
  without sudo, to create the database (`groups michael` lists `docker`)
- nginx and certbot

How the pipeline works is in [DEPLOYMENT.md](DEPLOYMENT.md).

Nothing is downloaded on the server. Each step links the files from this repo's `deployment/`
folder, each followed by the command that creates and opens it on the server. Open the repo file,
copy all of it, run the command, paste into nano (right-click, or `Ctrl+Shift+V`), then save
with `Ctrl+O`, `Enter` and exit with `Ctrl+X`. Then run that step's commands.

To update a file that is already there, empty it first, then open and paste as above:
`sudo truncate -s 0 <path>`.

**[DNS]** DNS provider · **[PC]** your machine, repo root · **[SRV]** server, as `michael` · **[GH]** GitHub repo settings

Each step is marked **(once)**, done once for the app, or **(any time)**, safe to repeat. A
deploy never touches the files these steps put on the server, so when one of them changes in
the repo, its step says what to redo.

## Environment: two layers

The app (Next.js) and the server (Express API) each have their own settings, in development and
in production:

|            | Development                                                   | Production                                                                                         |
| ---------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **App**    | `.env.local` in the repo root, from [.env.example](../.env.example)         | one GitHub secret per key (step 6), built into the bundle by the pipeline. No file on the server. |
| **Server** | `server/.env.development.local`, from [server/.env.example](../server/.env.example) | `server/.env.production.local` on your PC → `ENV_API_BASE64` (steps 5–6) → the pipeline writes `/home/michael/apps/crossword/shared/.env.api` |

The app's values are all public: every `NEXT_PUBLIC_*` value ends up in the browser bundle. The
server's are secret: the database password and the Gemini key.

## 1. DNS **[DNS]** (once)

| Type  | Name                       | Value                  | Serves                                     |
| ----- | -------------------------- | ---------------------- | ------------------------------------------ |
| A     | `crossword.eapps.site`     | `<SERVER_IPV4>`        | the app (HTTP → HTTPS)                     |
| AAAA  | `crossword.eapps.site`     | `<SERVER_IPV6>`        | the app (HTTP → HTTPS)                     |
| CNAME | `www.crossword.eapps.site` | `crossword.eapps.site` | redirect to `https://crossword.eapps.site` |
| A     | `api.crossword.eapps.site` | `<SERVER_IPV4>`        | the API, HTTPS only                        |
| AAAA  | `api.crossword.eapps.site` | `<SERVER_IPV6>`        | the API, HTTPS only                        |

The IPv6 address must really reach the server: Let's Encrypt checks over IPv6 first, so a wrong
AAAA record makes certbot fail. If the zone is on Cloudflare, set every record to **DNS only**.

## 2. systemd units **[SRV]** (once)

Paste [crossword-web.service](../deployment/crossword-web.service) into:

```bash
sudo nano /etc/systemd/system/crossword-web.service
```

Paste [crossword-api.service](../deployment/crossword-api.service) into:

```bash
sudo nano /etc/systemd/system/crossword-api.service
```

`sudo nano` creates them owned by `root`, mode `644`. Then load them and start them on every
boot:

```bash
sudo systemctl daemon-reload
sudo systemctl enable crossword-web crossword-api
```

Then let the deploy workflow restart the two services, and nothing else, without a password.
Open the rule file in nano through `visudo`, which checks the syntax on save and creates the
file with the mode `440` that sudo requires:

```bash
sudo EDITOR=nano visudo -f /etc/sudoers.d/crossword-deploy
```

Paste this line, then save and exit as above:

```text
michael ALL=(root) NOPASSWD: /usr/bin/systemctl restart crossword-web, /usr/bin/systemctl restart crossword-api
```

The path must be where `systemctl` really is; `command -v systemctl` prints it, and
`/usr/bin/systemctl` is the usual one. Check the rule works (no password prompt):

```bash
sudo -n systemctl restart crossword-api
```

Before the first deploy that restart fails because the service has nothing to run yet; what
matters is that sudo does not ask for a password.

If a `.service` file changes in the repo later, paste it again, then run
`sudo systemctl daemon-reload && sudo systemctl restart <that unit>`.

## 3. Certificates, auto-renewing **[SRV]** (once)

The vhosts in step 4 reference these certificates, so issue them first. There are two: one for
the app that also covers `www`, and one for the API. `certonly --nginx` lets certbot answer
Let's Encrypt's check through nginx by itself and only fetches the certificate: it never edits
a vhost file.

certbot's nginx plugin is needed. If `sudo certbot plugins` does not list `nginx`, install it
with `sudo apt install python3-certbot-nginx`.

```bash
sudo certbot certonly --nginx -d crossword.eapps.site -d www.crossword.eapps.site --deploy-hook "systemctl reload nginx"
sudo certbot certonly --nginx -d api.crossword.eapps.site --deploy-hook "systemctl reload nginx"
```

Each certificate renews by itself: certbot's timer renews it before it expires, the same way it
was issued, and the `--deploy-hook`, saved in each renewal config, reloads nginx afterwards.
The timer is one for the whole server, shared with the other apps' certificates, so there is
nothing to set up for it here.

Check these two certificates only. The dry run asks for test certificates and changes nothing;
each should end with "all simulated renewals succeeded":

```bash
sudo certbot renew --dry-run --cert-name crossword.eapps.site
sudo certbot renew --dry-run --cert-name api.crossword.eapps.site
```

And see what they cover and when they expire:

```bash
sudo certbot certificates --cert-name crossword.eapps.site
sudo certbot certificates --cert-name api.crossword.eapps.site
```

## 4. nginx **[SRV]** (once)

Paste [crossword.eapps.site.conf](../deployment/crossword.eapps.site.conf) into:

```bash
sudo nano /etc/nginx/sites-available/crossword.eapps.site.conf
```

Paste [api.crossword.eapps.site.conf](../deployment/api.crossword.eapps.site.conf) into:

```bash
sudo nano /etc/nginx/sites-available/api.crossword.eapps.site.conf
```

`sudo nano` creates them owned by `root`, mode `644`. Then enable them:

```bash
sudo ln -sf /etc/nginx/sites-available/crossword.eapps.site.conf /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/api.crossword.eapps.site.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Run the reload only if `nginx -t` says `syntax is ok` and `test is successful`.

If a `.conf` file changes in the repo later, paste it again, then run
`sudo nginx -t && sudo systemctl reload nginx`.

## 5. Server environment **[PC]** (once)

Everything in this step runs on **your PC**, in the repo root, never on the server. Any
terminal works: PowerShell, Command Prompt, Git Bash, or the VS Code terminal.

First, the database password. The first deploy creates the database (a Postgres 16 container
on `127.0.0.1:5007`) from `DATABASE_URL`, so this password becomes the database password.
Generate it once and keep it in your password manager. Changing it later does not change the
password of the database already created. This prints 64 random hex characters (Node only, so
it is the same command in every terminal):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

`server/.env.production.local` (git-ignored). Put the password after `crossword:` and your key
from https://aistudio.google.com/apikey in `GEMINI_KEY`:

```dotenv
DATABASE_URL="postgresql://crossword:<that password>@127.0.0.1:5007/crossword?schema=public"
CORS_ORIGIN="https://crossword.eapps.site"
GEMINI_KEY=""
VERIFY_ENTRIES="true"
POOL_DAILY_CALL_BUDGET="300"
```

The first three are required. The other keys in part A of
[server/.env.example](../server/.env.example) (`GEMINI_MODELS`, `VERIFY_ENTRIES`,
`POOL_DAILY_CALL_BUDGET`, `POOL_REFILL_*`) are optional. Leave out `NODE_ENV`,
`PORT` and `HOST`: the pipeline sets them itself.

Generate the `ENV_API_BASE64` value from it, straight to the clipboard. `clip` is Windows and
works in PowerShell, Command Prompt and Git Bash alike (on macOS use `| pbcopy`):

```bash
pnpm env:base64 production | clip
```

It prints only the base64 to the clipboard and lists the key names (never values) in the
terminal. Check those keys before pasting.

If this file changes later, run the command again and update the `ENV_API_BASE64` secret.

## 6. GitHub secrets **[GH]** (once)

Settings → Secrets and variables → Actions → **Secrets** tab → **Repository secrets** → **New
repository secret**. Every value below goes there: not in the Variables tab, and not under
Settings → Environments, whose secrets the deploy jobs cannot read (a value there arrives
empty, and the build stops with "NEXT_PUBLIC_API_URL is empty").

Deploy and server layer:

| Name                   | Value                                                    |
| ---------------------- | -------------------------------------------------------- |
| `SSH_HOST`             | `<SERVER_IPV4>`                                          |
| `SSH_USER`             | `michael`                                                |
| `SSH_KEY`              | your existing private key (its public half is already in `/home/michael/.ssh/authorized_keys`), BEGIN to END lines |
| `APP_DIR`              | `/home/michael/apps/crossword`                           |
| `ENV_API_BASE64`       | output of step 5                                         |

App layer, the production twins of the keys in `.env.local`. The first two are required: the
build stops if either is empty. The rest are optional, and an empty or missing one turns that
feature off:

| Name                                    | Value                                                                  |
| --------------------------------------- | ---------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`                   | `https://api.crossword.eapps.site`                                     |
| `NEXT_PUBLIC_SITE_URL`                  | `https://crossword.eapps.site` (must equal `CORS_ORIGIN` in step 5)    |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`         | Google Analytics 4 → Admin → Data streams → `G-…`                      |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`  | Google Search Console → HTML tag → the `content` value                 |
| `NEXT_PUBLIC_YANDEX_VERIFICATION`       | Yandex Webmaster → Meta tag → the `content` value                      |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION`    | Bing Webmaster Tools → Meta tag → the `content` value                  |
| `NEXT_PUBLIC_SENTRY_DSN`                | Sentry → project → Client Keys (DSN)                                   |
| `SENTRY_ORG`, `SENTRY_PROJECT`          | Sentry organization and project slugs, for uploading source maps       |
| `SENTRY_AUTH_TOKEN`                     | Sentry → Settings → Auth Tokens; lets the build upload source maps     |

A saved secret cannot be viewed again, and logs show it as `***`. To check or fix one, overwrite
it with the right value.

Unlike `.env.local`, these are not a file: change one here, then redeploy the web (re-run
**Deploy to Production**), because they are built into the bundle.

## 7. First deploy **[GH]** (once)

Actions → **Deploy to Production** → **Run workflow** (deploys both sides). After
that, every merge to `master` deploys automatically, and every pull request runs **CI** first.

Check it (any time):

```powershell
curl.exe -s  https://api.crossword.eapps.site/health     # "status":"ok", "gemini":true
curl.exe -sI https://crossword.eapps.site/en             # 200
curl.exe -sI https://www.crossword.eapps.site            # 301 -> https://crossword.eapps.site
```
