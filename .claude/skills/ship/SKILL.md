---
name: ship
description: Pre-launch checks and Vercel deployment for mohamedlandolsi.tech, including moving the domain from the old site. Run only when Mohamed asks to deploy.
disable-model-invocation: true
---

# Ship

## 1. Preflight (stop at the first failure)

```bash
npm run lint
npm run check:content
npm run build
```

Then confirm:

- [ ] `visual-qa` was run on every page changed since the last deploy.
- [ ] No published page contains `TODO`. Draft case studies are `noindex` and not linked.
- [ ] `public/Mohamed-Landolsi-CV.pdf` exists and is the updated CV (same file name as the old site, so old links keep working).
- [ ] `app/sitemap.ts` and `app/robots.ts` exist; the sitemap lists only published routes.
- [ ] Metadata: `metadataBase` is `https://www.mohamedlandolsi.tech`, every page has its own title and description, OG images render (open `/opengraph-image` locally).
- [ ] JSON-LD `Person` on the home page: name, jobTitle, url, sameAs (LinkedIn, GitHub). No phone, no address.

## 2. Git

Show Mohamed `git status` and the commit list since the last push, then ask before `git push`.

## 3. Vercel (first deploy, done by Mohamed in the dashboard)

Tell Mohamed these steps; do not run them yourself:

1. vercel.com > Add New > Project > import the GitHub repo. Framework preset: Next.js. No environment variables needed.
2. Deploy and open the preview URL. Run PageSpeed Insights (mobile) on it and record the scores.
3. Move the domain: find the project (or projects) that currently hold `mohamedlandolsi.tech`, `www.mohamedlandolsi.tech` and `cv.mohamedlandolsi.tech`, and remove them under Settings > Domains. Then add the same three to the new project. A domain can belong to only one project at a time, so expect a minute or two without the site.
4. Keep the old site's convention: check which of `www` or the apex is primary today and keep it (the old site is served at `www`).
5. For `cv.mohamedlandolsi.tech`, add a redirect in `next.config.ts` so any path on that host goes to `https://www.mohamedlandolsi.tech/Mohamed-Landolsi-CV.pdf`.

## 4. After deploy

- [ ] Open `https://www.mohamedlandolsi.tech`, `/work/personal-gtm-engine`, `/decisions`, `/cv` on a phone.
- [ ] Old CV links still work: `https://www.mohamedlandolsi.tech/Mohamed-Landolsi-CV.pdf` and `https://cv.mohamedlandolsi.tech/Mohamed-Landolsi-CV.pdf`.
- [ ] Share a link in a private LinkedIn message to yourself and check the preview card.
- [ ] Optional: enable Vercel Web Analytics on the Hobby plan (free within its limits). It needs `@vercel/analytics` and an ADR entry, because it adds a script.
