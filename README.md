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

Email auth uses one-time passcodes. Use the ready-made template at
[`supabase/emails/otp.html`](./supabase/emails/otp.html) for the **Magic Link**
template (Dashboard → Authentication → Email Templates → Magic Link). It offers
both the 6-digit code (`{{ .Token }}`) and a one-click magic link that points at
`/api/auth/confirm`:

```text
{{ .SiteURL }}/api/auth/confirm?token_hash={{ .TokenHash }}&type=email
```

For the magic link to resolve to the app, `{{ .SiteURL }}` (Supabase's Site URL)
must match `NEXT_PUBLIC_SITE_URL`, and the app must be reached on that same host
(cookies are host-bound).

## License

The **source code** in this repository is licensed under the [MIT License](./LICENSE).

All **other content**, including text, images, logos, branding, and design assets, is © 2026 UBC Thai AIYARA, all rights reserved, unless otherwise noted.

Third-party assets (fonts, icons, stock imagery) remain under their original licenses. See [`ASSETS.md`](./ASSETS.md) for attribution and details.
