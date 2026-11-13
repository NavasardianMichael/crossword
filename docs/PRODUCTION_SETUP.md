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
server's are secret: the database password, the session secret, and the Gemini, Google, mail
and Paddle keys.

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

Then the session secret, generated the same way and kept the same way. It signs every sign-in
cookie. Changing it later signs everyone out. Without it the API falls back to a public dev
value, and anyone could forge a session and spend another account's credits:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

`server/.env.production.local` (git-ignored). This is every variable the API reads, each set to
its production value or to the default it falls back to when left out. Fill in the four
required ones: the database password after `crossword:`, the session secret, and your key from
https://aistudio.google.com/apikey in `GEMINI_KEY`:

```dotenv
# --- Required ---------------------------------------------------------------
DATABASE_URL="postgresql://crossword:<that password>@127.0.0.1:5007/crossword?schema=public"
# Must equal NEXT_PUBLIC_SITE_URL (step 6), no trailing slash.
CORS_ORIGIN="https://crossword.eapps.site"
JWT_SECRET="<the session secret>"
# Empty = no generation: puzzles are built from the seed words only.
GEMINI_KEY=""

# --- Gemini and the word pool (defaults) -------------------------------------
# Model chain, cheapest first, name[:thinkingLevel].
GEMINI_MODELS="gemini-3.5-flash-lite:MINIMAL,gemini-3.6-flash:LOW,gemini-3.8-flash:LOW"
# The second "judge" pass over every generated batch.
VERIFY_ENTRIES="true"
# Gemini calls per day (from midnight Pacific, as Google counts), generation and judge together.
POOL_DAILY_CALL_BUDGET="300"
# The background job that keeps the word pool stocked.
POOL_REFILL_ENABLED="true"
POOL_REFILL_INTERVAL_MS="60000"
POOL_REFILL_TARGET="300"
POOL_REFILL_MAX_CALLS="2"

# --- Accounts (defaults) -----------------------------------------------------
# The sign-in cookie's domain. Left out, it is CORS_ORIGIN's hostname, which also covers api.
COOKIE_DOMAIN="crossword.eapps.site"
# Google sign-in. Empty client id or secret hides the button.
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_REDIRECT_URI="https://api.crossword.eapps.site/identity/google/callback"
# Mail engine for verification and password-reset links. Empty = production refuses to send.
MAIL_API_URL=""
MAIL_API_KEY=""

# --- Paddle (defaults; values from docs/PADDLE_SETUP.md, live part) ----------
# Empty = the shop is closed: packs show list prices, checkout answers 503.
PADDLE_API_KEY=""
# Comma-separated while rotating secrets.
PADDLE_WEBHOOK_SECRET=""
# "true" only for the sandbox. Live is "false".
PADDLE_SANDBOX="false"
PADDLE_PRICE_ID_STARTER=""
PADDLE_PRICE_ID_POPULAR=""
PADDLE_PRICE_ID_BIG=""
# Guest devices one IP address may spend free credits from each month.
GUEST_FREE_PER_IP="3"
# Puzzles taking free credits in any rolling hour, all players together; past it free credits pause.
FREE_PUZZLES_PER_HOUR="200"
```

Never set these in this file:

- `NODE_ENV`, `PORT` and `HOST`: the pipeline sets them itself.
- `RATE_LIMIT_ENABLED` and `BILLING_ENABLED`: they are switches for local e2e runs.
  `RATE_LIMIT_ENABLED="false"` would turn off the API's per-IP rate limits in production.
  `BILLING_ENABLED` is ignored in production.

Do not set a value to `""` unless the comment above it says empty is allowed. An empty
`COOKIE_DOMAIN` makes the cookie host-only, so the site stops seeing the sign-in. An empty
`GOOGLE_REDIRECT_URI` turns Google sign-in off. To use a default, leave the line out or copy the
value shown.

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

With Google Analytics on, GA records full page URLs. Keep one-time links out of it: GA → Admin →
Data streams → the web stream → **Redact data** → turn on **Query parameters** and list `token`
(password reset and email verification links).

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

## 8. Database backups to Google Drive **[PC]** **[SRV]** (once)

Every night the server dumps the database and streams it straight to a Google Drive folder:
nothing is kept on the server's disk. Dumps older than 22 days are deleted from Drive. One dump
is a few MB (about 10–50 MB even with a large word pool), so 22 of them fit easily in Drive's
free 15 GB. The database must exist, so do this after the first deploy (step 7).

**Install rclone** on the server **[SRV]**:

```bash
sudo apt install rclone
rclone version
```

And on your PC **[PC]**, only to sign in to Google once (it opens a browser):

```powershell
winget install Rclone.Rclone
```

**Connect Google Drive** **[SRV]**. Use the Google account that should hold the backups (a
separate one is fine):

```bash
rclone config
```

Answer: `n` (new remote) → name `gdrive` → storage `drive` → `client_id` and `client_secret`
empty → scope `drive.file` (rclone sees only the files it created, nothing else in the Drive) →
`root_folder_id` and `service_account_file` empty → advanced config `n` → auto config / web
browser `n`. rclone then prints a line like `rclone authorize "drive" "eyJ…"`. Run that exact
line on your PC **[PC]**, sign in to Google in the browser that opens, and paste the token it
prints back into the server prompt. Then: shared drive `n` → `y` (keep) → `q` (quit). Check:

```bash
rclone mkdir gdrive:crossword-backups
rclone lsd gdrive:
```

**Install the script** **[SRV]**. Paste [backup-db.sh](../deployment/backup-db.sh) into:

```bash
nano /home/michael/apps/crossword/shared/backup-db.sh
```

```bash
chmod 700 /home/michael/apps/crossword/shared/backup-db.sh
/home/michael/apps/crossword/shared/backup-db.sh
rclone ls gdrive:crossword-backups
```

The manual run should print `ok: crossword-<date>.dump (<size> bytes)`, and the file should be
listed on Drive.

**Schedule it** **[SRV]**, nightly at 03:30 server time:

```bash
crontab -e
```

Add this line, then save and exit:

```text
30 3 * * * /home/michael/apps/crossword/shared/backup-db.sh >> /home/michael/apps/crossword/shared/backup.log 2>&1
```

**Get told when a night is missed** (optional, recommended). Create a free check at
https://healthchecks.io (period 1 day, grace 2 hours), and put its ping URL in the script's
`PING_URL="…"` line. healthchecks.io then emails you whenever a night's backup did not
succeed. Without it, look at `tail /home/michael/apps/crossword/shared/backup.log` now and then.

**Restore drill** (any time — do it once now, so you know the backups work). This restores the
newest dump into a scratch database next to the real one, counts rows, and drops it again:

```bash
rclone lsl gdrive:crossword-backups
rclone cat gdrive:crossword-backups/<newest file>.dump | docker exec -i crossword-postgres-prod sh -c 'createdb -U "$POSTGRES_USER" crossword_restore && pg_restore -U "$POSTGRES_USER" -d crossword_restore --no-owner'
docker exec crossword-postgres-prod sh -c 'psql -U "$POSTGRES_USER" -d crossword_restore -c "select (select count(*) from \"User\") users, (select count(*) from \"CreditEntry\") ledger, (select count(*) from \"Entry\") entries"'
docker exec crossword-postgres-prod sh -c 'dropdb -U "$POSTGRES_USER" crossword_restore'
```

**Real restore** (only after data loss). Stop the API, replace the database with the dump, start
the API again:

```bash
sudo systemctl stop crossword-api
rclone cat gdrive:crossword-backups/<the file>.dump | docker exec -i crossword-postgres-prod sh -c 'pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists --no-owner'
sudo systemctl start crossword-api
```

Before a deploy whose commit adds a migration under `server/prisma/migrations/`, run the script
by hand once: migrations do not roll back.

If `backup-db.sh` changes in the repo later, paste it again (empty the file first, as above).
