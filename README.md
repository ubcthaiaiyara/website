# UBC Thai Aiyara: Membership

- Next.js (App router + TS)
- Supabase
- passkit-generator

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

Email auth uses one-time passcodes. In Supabase Auth email templates, include
the OTP token instead of relying on a magic link:

```text
Your code is: {{ .Token }}
```

## License

The **source code** in this repository is licensed under the [MIT License](./LICENSE).

All **other content**, including text, images, logos, branding, and design assets, is © 2026 UBC Thai AIYARA, all rights reserved, unless otherwise noted.

Third-party assets (fonts, icons, stock imagery) remain under their original licenses. See [`ASSETS.md`](./ASSETS.md) for attribution and details.
