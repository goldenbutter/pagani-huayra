# Deployment

- Repository: https://github.com/goldenbutter/pagani-huayra
- Production branch: `main`, connected to Vercel for automatic deployments
- Vercel project: [iBithun / pagani-huayra](https://vercel.com/i-bithun/pagani-huayra)
- Project ID: `prj_GpOyG3dqjv5Dcd0qny200YC33FZ0`
- Team: `i-bithun`, ID `team_7PO0DgvFHgmRNHAdz1p5Q4Rq`
- Live production mirror: https://pagani-huayra-ochre.vercel.app
- Live film player: https://pagani-huayra-ochre.vercel.app/teaser
- Canonical hostname: https://demo-pagani.ibithun.com
- Film player: `/teaser`
- Framework: Next.js App Router
- Node.js: 22.x
- Install: `npm ci`
- Build: `npm run build`
- Application secrets: none required

The production site is publicly reachable on its Vercel mirror. The custom hostname was verified on 29 October 2026 after the Hostinger records below were added. HTTPS returns the correct site. The Vercel connector required reauthentication, so publication used the already authenticated Vercel CLI 65.5.0, verified as the latest stable version at release.

## External DNS at Hostinger

The subdomain is attached to the correct project. Vercel ownership verification and DNS configuration are complete. Hostinger nameservers are `apollo.dns-parking.com` and `athena.dns-parking.com`.

The following records are installed in the `ibithun.com` DNS zone:

| Type | Name | Value | TTL |
| --- | --- | --- | --- |
| CNAME | `demo-pagani` | `a98807df03aeb92c.vercel-dns-016.com` | 3600 |
| TXT | `_vercel` | `vc-domain-verify=demo-pagani.ibithun.com,d1c1e7e5030357e188c8` | 3600 |

These values were returned by Vercel for this project on 29 October 2026. Add a separate TXT value; do not replace ENERGITIX or other verification records. Preserve the parent-domain ownership, nameservers, website and mail records.

To recheck the installed records:

```sh
vercel domains verify demo-pagani.ibithun.com --project pagani-huayra --scope i-bithun --format json
```

Confirm public DNS, successful verification and HTTPS before reporting the custom hostname live. The first CLI `domains add` returned a parent-domain ownership error; the project-domain API successfully attached the subdomain with its own TXT challenge. No parent-domain transfer or unrelated project change was made.

## Analytics

The official `@vercel/analytics` SDK is integrated in the root layout, covering the homepage and `/teaser`. Web Analytics was enabled by the operator on 29 October 2026. The existing deployed integration needed no extra code change or redeployment after enablement.

Verified on 29 October 2026: `/_vercel/insights/script.js` returns JavaScript successfully. One ordinary Chrome verification session visited `/` and `/teaser`; Vercel's metrics API and the actual [Web Analytics dashboard](https://vercel.com/i-bithun/pagani-huayra/analytics) both showed **1 unique visitor and 2 page views**, with one view per path. These are verification visits, not claimed organic audience traffic. Headless requests were not used as evidence of recorded views.

Recheck counts with the authenticated CLI:

```sh
vercel metrics vercel.analytics.page_view.count --since 1h --group-by requestPath --project pagani-huayra --environment production --scope i-bithun
vercel metrics vercel.analytics.page_view.count --aggregation unique/visitorId --since 1h --granularity 1h --project pagani-huayra --environment production --scope i-bithun
```

## Repository and deployment scope

The public repository contains source, prompts, runtime image sequences, red reference stills, the short MP4, animated README preview and poster. Local original images/clips, edited masters, inactive-colour archives, analysis, environment files and provider receipts remain preserved on disk and are excluded from Git and Vercel. The checkout is linked only to this iBithun project. ENERGITIX is unchanged.

The README preview links to a native video player with playback controls. All social metadata uses the requested canonical hostname. The site remains an unofficial portfolio concept, with no vehicle sales or payments.

## Verified release

The GitHub push of `7a2e173` automatically produced deployment `dpl_3z46q6bVS7b4rZEHJnV6LBLaskMQ`, READY in production. This confirmed the Git integration, not only a manual CLI deployment. The public mirror returned HTTP 200 for the homepage, player, MP4 and runtime WebP frames. The README GIF also returned HTTP 200 from GitHub.

Chromium and WebKit passed the live player/homepage checks on desktop and phone: video duration and real playback, social/canonical metadata, the fully exploded scroll frame, layout fit, zero player axe violations and no page errors. Custom-domain verification is complete. Analytics collection was subsequently verified as recorded above.

## Social previews

The original 1200 × 630 JPEG and OG tags were present before custom-domain activation. A reported WhatsApp preview failure remains distinct from successful HTTP crawler checks; earlier DNS failure is a possible cause, not a proven diagnosis. Both the homepage and teaser now declare image MIME type, secure URL, site name, locale and explicit Twitter image alt text. They share `/media/pagani-og-v3.jpg`, with the original photograph feathered into the card background along all four edges. The original image remains available.

Share the HTTPS URL directly. Validate actual previews in each target app after domain activation; a successful crawler-style HTTP request is not an in-app preview test. WhatsApp may also suppress previews through its optional Disable link previews setting. Do not claim that an image URL change forces every app to refresh cached page metadata.
