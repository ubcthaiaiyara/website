# UBC Thai Aiyara Website

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![pnpm](https://img.shields.io/badge/pnpm-11.6.0-F69220?style=flat&)](https://pnpm.io)
[![Build](https://img.shields.io/github/actions/workflow/status/ubcthaiaiyara/website/build.yml?style=flat&)](https://github.com/ubcthaiaiyara/website/actions/workflows/build.yml)
[![Website Status](https://img.shields.io/website-up-down-green-red/https/ubcthaiaiyara.com.svg)](https://ubcthaiaiyara.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16-ffffff?style=flat&)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&)](https://supabase.com)
![Vercel Deploy](https://deploy-badge.vercel.app/?url=http://ubcthaiaiyara.com/&name=Vercel)

The public website and membership platform for UBC Thai Aiyara.

## Getting started

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
pnpm build
pnpm start
```

## Configuration

Set the values in `.env.local`. See [`.env.example`](./.env.example) for all
variables.

- Supabase handles authentication and member data. Run
  [`supabase/schema.sql`](./supabase/schema.sql) before using it.
- Resend is configured as Supabase custom SMTP for OTP and confirmation email.
- Apple certificate variables are needed only to generate live Wallet passes.
- Set `SITE_MODE=maintenance` to show the maintenance page; leave it unset for
  the standard landing page.

## Deployment

Deploy on Vercel with the production environment variables configured. Set
`NEXT_PUBLIC_SITE_URL` to the deployed URL and add that URL to Supabase Auth
redirect settings.

## Project structure

```text
├── app/
│   ├── api/                Auth, account, and Wallet pass route handlers
│   ├── components/         Reusable interface and landing-page components
│   ├── dashboard/          Member account dashboard
│   ├── join/ and login/    Membership registration and sign-in flows
│   └── page.tsx            Selects the landing or maintenance page
├── lib/                    Server-side member, session, Supabase, and pass logic
├── models/aiyara.pass/     Apple Wallet pass model and visual assets
├── public/                 Static assets
└── supabase/               Database schema and Auth email templates
```

## License

The source code is licensed under the [MIT License](./LICENSE).

Text, photography, logos, the UBC Thai Aiyara name, and design assets are
© 2026 UBC Thai Aiyara. All rights reserved.
