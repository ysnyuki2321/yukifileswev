# YukiFiles – File sharing with auth & payments

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/hais-projects-fc5464aa/v0-file-sharing-with-payment)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/rWVTkrKeI9w)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Getting Started (dev)

### Env
Copy `.env.example` to `.env.local` and fill Supabase keys. Set `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` to `http://localhost:3000/auth/callback`.

### Database
Run SQL in `scripts/01-create-database-schema.sql`, `scripts/02-auth-columns.sql`, `scripts/03-plans-and-flags.sql`, then `scripts/04-seed-demo-user.sql` in your Supabase SQL editor.

### Run
pnpm install && pnpm dev

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/rWVTkrKeI9w](https://v0.app/chat/projects/rWVTkrKeI9w)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Auth flow
- Registration uses Supabase Auth (email + password). Supabase sends a verification link to the user.
- The link targets `/auth/callback` which exchanges the code for a session and marks the user as `is_verified=true` in our `users` table. Title for verification emails: "YukiFiles Verify".
- To brand Supabase emails, update Authentication → Email Templates with our HTML (see `app/auth/email-template.ts`). Set subject to "YukiFiles Verify". Use `{{ .ConfirmationURL }}` placeholder.
- Dev admin: `ysnyuki2321@outlook.jp` with pass `Yuki@2321` (mark as dev-only; change in prod). Demo login prefilled: `demo@yukifile.shockbyte.me` / `yukifiledemo`.
