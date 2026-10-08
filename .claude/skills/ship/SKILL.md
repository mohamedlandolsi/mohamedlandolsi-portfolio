---
name: ship
description: Pre-launch checks and Vercel deployment for mohamedlandolsi.tech. Run only when Mohamed asks to deploy.
disable-model-invocation: true
---

# Ship

## Where it runs

- Vercel team `mohamedlandolsi's projects`, project `tech-ba-portfolio` (Next.js preset), linked to this GitHub repo. A push to `main` deploys to production; a push to any other branch makes a preview.
- Domains on that project: `www.mohamedlandolsi.tech` (primary), `mohamedlandolsi.tech` (308 to www), `www.mohamedlandolsi.dev` and `mohamedlandolsi.dev` (308 to www.dev). `profile.links.site` is the primary address and feeds `metadataBase`, canonicals, the sitemap and robots.txt.
- `cv.mohamedlandolsi.tech` is not on this project: it serves the CV PDF from the separate CV repo. `/Mohamed-Landolsi-CV.pdf` on this site redirects there (`next.config.ts`, from `profile.links.cv_pdf`) so old links keep working.
- Preview URLs are behind Vercel Authentication; custom domains are public.

## 1. Preflight (stop at the first failure)

```bash
npm run lint
npm run check:content
npm run build
```

Then confirm:

- [ ] `visual-qa` was run on every page changed since the last deploy.
- [ ] No published page contains `TODO`. Draft case studies are `noindex` and not linked.
- [ ] `app/sitemap.ts` and `app/robots.ts` exist; the sitemap lists only published routes.
- [ ] Metadata: every page has its own title and description, OG images render (open `/opengraph-image` locally).
- [ ] JSON-LD `Person` on the home page: name, jobTitle, url, sameAs (LinkedIn, GitHub). No phone, no address.

## 2. Preview

Show Mohamed the commit list since the last deploy. Push the working branch, wait for its preview deployment, and check it (the Vercel MCP `web_fetch_vercel_url` gets past the preview login): every route returns 200, `/opengraph-image` is a PNG, `/Mohamed-Landolsi-CV.pdf` redirects.

## 3. Production

Push to `main` only when Mohamed has asked for it. Then check the production deployment on `https://www.mohamedlandolsi.tech` the same way, and run PageSpeed Insights (mobile) on `/`, `/work/personal-gtm-engine` and `/decisions`; record the scores in `docs/BUILD_PLAN.md`.

If production is broken: roll back to the previous production deployment (Vercel dashboard > Deployments > Instant Rollback, or the MCP `request_rollback`), then fix forward.

## 4. After deploy (Mohamed)

- [ ] Open `https://www.mohamedlandolsi.tech`, `/work/personal-gtm-engine`, `/decisions`, `/cv` on a phone.
- [ ] Share a link in a private LinkedIn message to yourself and check the preview card.
- [ ] Optional: Vercel Web Analytics on the Hobby plan. It needs `@vercel/analytics` and an ADR entry, because it adds a script.
