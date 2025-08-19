## YukiFiles

Modern PHP file upload & sharing app with auth, quotas, anti-clone checks (IP + device fingerprint + VPN/residential), PayPal and crypto (BlockCypher) integrations, and an admin panel.

### Quick start

1. Requirements: PHP 8.1+, SQLite3, Composer
2. Install deps:

```bash
composer install
cp .env.example .env
php -S 0.0.0.0:8000 -t public
```

Visit `http://localhost:8000`

Default admin: `ysnyuki2321@outlook.jp` / `Yuki@2321`

### Notes
- SQLite by default via `DB_DATABASE` path
- Free quota: 2GB; Paid quota: 5GB
- Configure PayPal and BlockCypher in Admin > Settings

### Docker

```bash
docker build -t yukifiles .
docker run --rm -p 8080:80 -v "$PWD":/var/www/html yukifiles
```

or using compose:

```bash
docker compose up --build
```
