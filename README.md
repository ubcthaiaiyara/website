# UBC Thai Aiyara Website

The public website and membership platform for UBC Thai Aiyara.

[![License](https://img.shields.io/badge/license-MIT-5B6198?style=flat-square)](./LICENSE)
[![pnpm](https://img.shields.io/badge/pnpm-11.6.0-F69220?style=flat-square&logo=pnpm&logoColor=white)](https://pnpm.io)
[![Build](https://github.com/ubcthaiaiyara/website/actions/workflows/build.yml/badge.svg)](https://github.com/ubcthaiaiyara/website/actions/workflows/build.yml)
[![Site status](https://img.shields.io/badge/site-maintenance-6E73BC?style=flat-square)](https://ubcthaiaiyara.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com)

**Live site:** [ubcthaiaiyara.com](https://ubcthaiaiyara.com) (currently in maintenance mode).

## Supabase Auth

Set these environment variables to enable Supabase-backed email/password and
Google auth:

```bash
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SESSION_SECRET=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Configure Google as a Supabase Auth provider, then add this redirect URL in the
Supabase Auth redirect allow list:

```text
http://localhost:3000/api/auth/google/callback
```

Email auth uses one-time passcodes. Ready-made templates live in
[`supabase/emails/`](./supabase/emails) — paste them into Dashboard →
Authentication → Email Templates:

- [`otp.html`](./supabase/emails/otp.html) → **Magic Link** (existing-user login)
- [`confirm-signup.html`](./supabase/emails/confirm-signup.html) → **Confirm signup** (new members)

Each offers both the 6-digit code (`{{ .Token }}`) and a one-click link that
points at `/api/auth/confirm`. The two differ only in the link's `type`
(`email` for login, `signup` for confirmation):

```text
{{ .SiteURL }}/api/auth/confirm?token_hash={{ .TokenHash }}&type=email
```

For the link to resolve to the app, `{{ .SiteURL }}` (Supabase's Site URL) must
match `NEXT_PUBLIC_SITE_URL`, and the app must be reached on that same host
(cookies are host-bound).

## License

The **source code** in this repository is licensed under the [MIT License](./LICENSE).

All **other content**, including text, images, logos, branding, and design assets, is © 2026 UBC Thai AIYARA, all rights reserved, unless otherwise noted.

Third-party assets (fonts, icons, stock imagery) remain under their original licenses. See [`ASSETS.md`](./ASSETS.md) for attribution and details.
