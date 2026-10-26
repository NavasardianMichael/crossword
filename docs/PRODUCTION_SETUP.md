# Production setup

The one-time, app-specific steps to run Crossword AI on the server, in order. Node 24, pnpm
(`~/.local/bin`), Docker, nginx and certbot are assumed to be installed already. How the
pipeline works is in [DEPLOYMENT.md](DEPLOYMENT.md).

The server steps download the templates from `deployment/` on `master`, so merge these files to
`master` first.

**[DNS]** DNS provider · **[PC]** your machine, repo root · **[SRV]** server, as `michael` · **[GH]** GitHub repo settings

## 1. DNS **[DNS]**

| Type  | Name                       | Value                  | Serves                                     |
| ----- | -------------------------- | ---------------------- | ------------------------------------------ |
| A     | `crossword.eapps.site`     | `<SERVER_IPV4>`        | the app (HTTP → HTTPS)                     |
| AAAA  | `crossword.eapps.site`     | `<SERVER_IPV6>`        | the app (HTTP → HTTPS)                     |
| CNAME | `www.crossword.eapps.site` | `crossword.eapps.site` | redirect to `https://crossword.eapps.site` |
| A     | `api.crossword.eapps.site` | `<SERVER_IPV4>`        | the API, HTTPS only                        |
| AAAA  | `api.crossword.eapps.site` | `<SERVER_IPV6>`        | the API, HTTPS only                        |

The IPv6 address must really reach the server: Let's Encrypt checks over IPv6 first, so a wrong
AAAA record makes certbot fail. If the zone is on Cloudflare, set every record to **DNS only**.

## 2. systemd units **[SRV]**

```bash
T=https://raw.githubusercontent.com/NavasardianMichael/crossword/master/deployment
for u in crossword-web crossword-api; do
  sudo curl -fsSL $T/$u.service -o /etc/systemd/system/$u.service
done
sudo systemctl daemon-reload
sudo systemctl enable crossword-web crossword-api

echo "michael ALL=(root) NOPASSWD: $(command -v systemctl) restart crossword-web, $(command -v systemctl) restart crossword-api" \
  | sudo tee /etc/sudoers.d/crossword-deploy >/dev/null
sudo chmod 440 /etc/sudoers.d/crossword-deploy && sudo visudo -c
```

## 3. Certificates, one per subdomain, auto-renewing **[SRV]**

The real vhosts reference the certificates, so issue them first through a temporary vhost that
only answers the challenge:

```bash
sudo tee /etc/nginx/sites-enabled/crossword-acme.conf >/dev/null <<'NGINX'
server {
    listen 80;
    listen [::]:80;
    server_name crossword.eapps.site www.crossword.eapps.site api.crossword.eapps.site;
    location /.well-known/acme-challenge/ { root /var/www/html; }
    location / { return 404; }
}
NGINX
sudo mkdir -p /var/www/html && sudo nginx -t && sudo systemctl reload nginx

for d in crossword.eapps.site www.crossword.eapps.site api.crossword.eapps.site; do
  sudo certbot certonly --webroot -w /var/www/html -d $d --deploy-hook "systemctl reload nginx"
done

sudo rm /etc/nginx/sites-enabled/crossword-acme.conf
```

certbot's timer renews each certificate before it expires, over the `:80` ACME location in its
vhost, and the `--deploy-hook`, saved in each renewal config, reloads nginx afterwards. The API's
`:80` serves only that challenge. Every other HTTP request to it is dropped.

## 4. nginx **[SRV]**

```bash
T=https://raw.githubusercontent.com/NavasardianMichael/crossword/master/deployment
for f in crossword.eapps.site api.crossword.eapps.site; do
  sudo curl -fsSL $T/$f.conf -o /etc/nginx/sites-available/$f.conf
  sudo ln -sf /etc/nginx/sites-available/$f.conf /etc/nginx/sites-enabled/
done
sudo nginx -t && sudo systemctl reload nginx

sudo certbot renew --dry-run         # "all simulated renewals succeeded" = renewal works
```

## 5. Preflight **[SRV]**

Check the server is ready. This changes nothing. Fix every `FAIL`; before the first deploy,
`restart failed — expected` and `crossword-postgres-prod does not exist yet` are fine:

```bash
curl -fsSL https://raw.githubusercontent.com/NavasardianMichael/crossword/master/deployment/preflight.sh \
  | bash -s -- ~/apps/crossword
```

## 6. API environment **[PC]**

The first deploy creates the database (a Postgres 16 container on `127.0.0.1:5007`) from
`DATABASE_URL`, so this password becomes the database password. Generate it once and keep it
in your password manager:

```powershell
$b = New-Object byte[] 32; [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b); -join ($b | % { $_.ToString('x2') })
```

`server/.env.production.local` (git-ignored):

```dotenv
DATABASE_URL="postgresql://crossword:<that password>@127.0.0.1:5007/crossword?schema=public"
CORS_ORIGIN="https://crossword.eapps.site"
GEMINI_KEY="<key from https://aistudio.google.com/apikey>"
```

```powershell
node scripts/env-to-base64.mjs production | Set-Clipboard     # = ENV_API_BASE64
```

## 7. GitHub secrets **[GH]**

Settings → Secrets and variables → Actions → **New repository secret**:

| Name                   | Value                                                    |
| ---------------------- | -------------------------------------------------------- |
| `SSH_HOST`             | `<SERVER_IPV4>`                                          |
| `SSH_USER`             | `michael`                                                |
| `SSH_KEY`              | your existing private key (its public half is already in `~/.ssh/authorized_keys`), BEGIN to END lines |
| `APP_DIR`              | `/home/michael/apps/crossword`                           |
| `ENV_API_BASE64`       | output of step 6                                         |
| `NEXT_PUBLIC_API_URL`  | `https://api.crossword.eapps.site`                       |
| `NEXT_PUBLIC_SITE_URL` | `https://crossword.eapps.site`                           |

## 8. First deploy **[GH]**

Actions → **Deploy to Production** → **Run workflow** (deploys both sides). After that, every
merge to `master` deploys automatically, and every pull request runs **CI** first.

```powershell
curl.exe -s  https://api.crossword.eapps.site/health     # "status":"ok", "gemini":true
curl.exe -sI https://crossword.eapps.site/en             # 200
curl.exe -sI https://www.crossword.eapps.site            # 301 -> https://crossword.eapps.site
```
