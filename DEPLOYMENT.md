# Deployment

- Repository: https://github.com/goldenbutter/pagani-huayra
- Production branch: `main`
- Vercel project: [iBithun / pagani-huayra](https://vercel.com/i-bithun/pagani-huayra)
- Project ID: `prj_GpOyG3dqjv5Dcd0qny200YC33FZ0`
- Team: `i-bithun`, ID `team_7PO0DgvFHgmRNHAdz1p5Q4Rq`
- Canonical hostname: https://demo-pagani.ibithun.com
- Film player: `/teaser`
- Framework: Next.js App Router
- Node.js: 22.x
- Install: `npm ci`
- Build: `npm run build`
- Application secrets: none required

## External DNS at Hostinger

The subdomain is attached to the correct project. Vercel ownership verification and DNS configuration are pending. Hostinger nameservers are `apollo.dns-parking.com` and `athena.dns-parking.com`.

Add these records in the `ibithun.com` DNS zone:

| Type | Name | Value | TTL |
| --- | --- | --- | --- |
| CNAME | `demo-pagani` | `a98807df03aeb92c.vercel-dns-016.com` | 3600 |
| TXT | `_vercel` | `vc-domain-verify=demo-pagani.ibithun.com,d1c1e7e5030357e188c8` | 3600 |

These values were returned by Vercel for this project on 29 October 2026. Add a separate TXT value; do not replace ENERGITIX or other verification records. Preserve the parent-domain ownership, nameservers, website and mail records.

After the user saves the records:

```sh
vercel domains verify demo-pagani.ibithun.com --project pagani-huayra --scope i-bithun --format json
```

Confirm public DNS, successful verification and HTTPS before reporting the custom hostname live. The first CLI `domains add` returned a parent-domain ownership error; the project-domain API successfully attached the subdomain with its own TXT challenge. No parent-domain transfer or unrelated project change was made.

## Analytics

The official `@vercel/analytics` SDK is integrated in the root layout, covering the homepage and `/teaser`. Dashboard enablement is left for the user, as requested. Open [Web Analytics](https://vercel.com/i-bithun/pagani-huayra/analytics) and select Enable. If Vercel prompts for a redeployment after enabling, redeploy the current `main` build so the analytics endpoints are installed. Verify a normal browser visit reaches the dashboard; headless visits may be filtered. SDK installation alone is not evidence of collected views.

## Repository and deployment scope

The public repository contains source, prompts, runtime image sequences, red reference stills, the short MP4, animated README preview and poster. Local original images/clips, edited masters, inactive-colour archives, analysis, environment files and provider receipts remain preserved on disk and are excluded from Git and Vercel. The checkout is linked only to this iBithun project. ENERGITIX is unchanged.

The README preview links to a native video player with playback controls. All social metadata uses the requested canonical hostname. The site remains an unofficial portfolio concept, with no vehicle sales or payments.
