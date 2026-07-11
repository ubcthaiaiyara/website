# UBC Thai Aiyara Website

[![License](https://img.shields.io/badge/license-MIT-5B6198?style=flat)](./LICENSE)
[![pnpm](https://img.shields.io/badge/pnpm-11.6.0-F69220?style=flat&logo=pnpm&logoColor=white)](https://pnpm.io)
[![Build](https://img.shields.io/github/actions/workflow/status/ubcthaiaiyara/website/build.yml?style=flat&logo=github)](https://github.com/ubcthaiaiyara/website/actions/workflows/build.yml)
[![Site status](https://img.shields.io/badge/site-maintenance-6E73BC?style=flat)](https://ubcthaiaiyara.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=nextdotjs)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel)](https://vercel.com)

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
