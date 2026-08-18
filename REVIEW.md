# KatPortfolio — Full Project Review

Review date: 2026-08-18

## Executive summary

KatPortfolio has a clear visual direction, a small and understandable Astro architecture, validated content collections, a successful static build, and a sensibly scoped GitHub Pages deployment. The rendered layouts also fit at a 390 px viewport without document-level horizontal overflow.

The project is not yet production-polished. The most important issues are broken previous/next project links, currently vulnerable dependencies, an invalid international telephone link, a partially non-functional CMS setup, and a very large unoptimised asset payload. The public-facing copy contains enough spelling, grammar, casing, and leftover editorial text to weaken the professional impression of the portfolio.

### Priority summary

| Priority | Count | Meaning |
| --- | ---: | --- |
| P1 | 3 | Fix before treating the site as production-ready |
| P2 | 8 | High-value fixes for correctness, editing, accessibility, and performance |
| P3 | 7 | Maintainability and polish improvements |

## Scope and checks performed

- Reviewed all application source, content files, configuration, deployment workflow, CMS configuration, and documentation.
- Ran `npm run validate`: 0 errors, 0 warnings, 0 hints.
- Ran a production GitHub Pages build with `GITHUB_ACTIONS=true`: 12 pages built successfully.
- Checked 248 generated `href`/`src` references and found 12 broken occurrences across 7 unique project-navigation URLs.
- Rendered and inspected Home, About, Work, Contact, and a case-study page at desktop and 390 px mobile widths.
- Ran `npm audit --omit=dev --audit-level=low`: 3 vulnerabilities (1 low, 2 high).
- Measured the generated site and image collection, including exact duplicate hashes.
- Reviewed visible copy, metadata, alternative text, and consistency between the plan, schema, CMS, and implementation.

## P1 — Fix before production

### 1. Previous/next project navigation points to nonexistent `.md` routes

**Where:** `src/pages/work/[...slug].astro:17`

The static routes are generated as `/work/faros/`, but the navigation uses `previousProject.id` and `nextProject.id` directly. In the current Astro content API those IDs include `.md`, producing links such as `/KatPortfolio/work/ar-exhibition.md/`. The generated-link check found 12 broken link occurrences across all seven case-study slugs.

**Impact:** Visitors reach the 404 page when moving between case studies.

**Recommendation:** Use one shared `projectSlug(project)` helper for `getStaticPaths`, cards, and previous/next navigation. Strip the extension in exactly one place, and add a generated-site link check to CI.

### 2. Production dependencies have current security advisories

**Where:** `package.json:13-14`, `package-lock.json`

The current lockfile resolves Astro 5.18.2. The audit reported advisories affecting Astro, `esbuild`, and `sharp`, including XSS issues, a Windows development-server arbitrary-file-read issue, and inherited `libvips` vulnerabilities. `npm audit` recommends Astro 7.2.3, which is a breaking upgrade.

**Impact:** The fully static deployment reduces exposure to server-only findings, but it does not make the XSS/toolchain findings safe to ignore. Local development is also part of the security boundary.

**Recommendation:** Plan and test the Astro 7 upgrade rather than using `npm audit fix --force` blindly. Re-run type checks, the production build, route checks, and browser tests after migration. Add Dependabot or Renovate so advisories do not accumulate.

### 3. The international phone URI is malformed

**Where:** `src/content/settings/site.json:5`, `src/pages/contact.astro:5`, `src/layouts/BaseLayout.astro:33`

The stored number is `+46 070 055 7041`, and whitespace removal creates `tel:+460700557041`. In international Swedish format the domestic trunk `0` should be removed after `+46`, normally yielding `+46 70 055 7041` and `tel:+46700557041`. The Contact page also hard-codes a separate display value (`+460700557041`) instead of using the setting.

**Impact:** The phone CTA may fail or dial the wrong form of the number, and two displays can drift apart.

**Recommendation:** Confirm the intended number, store a canonical dial value separately from the formatted display value, and render both locations from shared settings.

## P2 — High-value fixes

### 4. Pages CMS does not match the promised editing experience

**Where:** `.pages.yml:38-41`, `EDITOR-GUIDE.md:9`, `PLAN.md:23-31`

The CMS defines the pages collection with `fields: []`, so Home, About, Contact, and navigation do not have the friendly editable forms promised by the guide and plan. Much of About is also hard-coded in `src/pages/about.astro`, outside the content collection.

There is additional configuration drift:

- `.pages.yml` offers `externalUrl`, but the Zod project schema does not define it and no template renders it.
- The CMS requires a cover while the schema makes it optional.
- The schema requires `gallery`, while the CMS does not mark it required or provide a default.
- CMS uploads go to `src/assets/uploads`, but content image fields are plain strings and the templates use raw `<img>` elements, so those uploads do not use Astro's image pipeline as documented.

**Recommendation:** Decide which fields are genuinely editor-managed, model them once, and align `.pages.yml`, Zod, templates, the guide, and the plan. Test the full create/edit/publish flow with Pages CMS.

### 5. The generated site is 112.66 MB and images are not optimised

**Where:** `public/portfolio-assets/**`, all templates containing `<img>`

Measured results:

- `public/`: 112.54 MB across 103 files.
- Built `dist/`: 112.66 MB.
- 27 exact duplicate groups waste 41.36 MB.
- At least 37 public assets (62.21 MB) are not referenced by application source.
- `src/assets/uploads/og.png` is another unused 2.72 MB source asset.
- The generated site contains 86 `<img>` tags; none has explicit `width` or `height`.
- Several individual images are 4–7.25 MB.

The files live under `public`, so Astro copies them byte-for-byte. `image: { responsiveStyles: true }` does not optimise raw public assets or add responsive sources.

**Impact:** Slow first visits, excessive mobile bandwidth, avoidable Git/deployment weight, and layout shift from missing intrinsic dimensions.

**Recommendation:** Remove unused duplicate trees, move actively used source images into `src/assets`, use Astro's `<Image>`/`<Picture>` pipeline, generate WebP/AVIF variants and `srcset`, add dimensions, and set a performance budget. Keep original masters outside the deployed asset tree if they are needed for editing.

### 6. Public copy contains spelling errors and leftover editing instructions

**Where:** `src/content/**`, `src/pages/about.astro`

This matters more than usual because the site itself is evidence of professional communication and attention to detail. The most damaging examples are:

- `Brandsrategy` in the Wellstreet title and summary.
- `Possitive`, `Strenghts`, `feautures`, and `exhicition`.
- FAROS includes editor-facing instructions in published prose: “That keeps the important story and removes repetition” and “Then underneath those three, make the competitor finding visually dominant”.
- All In contains incomplete or ungrammatical instructions such as “The session Setup continues The HR add the participants” and “you have confirm”.
- Action Society has an unfinished “SHARED ACTION” section and inconsistent social-network naming.

See the copy-edit table below for file-specific examples. A full human proofread is still recommended after applying those mechanical corrections.

### 7. Alternative text is present but often not meaningful

**Where:** project frontmatter and `src/pages/index.astro:13`

The schema only checks that alt text is non-empty. Many different images reuse labels such as “FAROS screenshot”, “Wellstreet project image”, or “Portfolio image from the Figma board”. “From the Figma board” describes the asset's origin, not what a visitor needs to understand. Repeating the same generic text for a long gallery creates noisy screen-reader output.

**Recommendation:** Describe the visual and its purpose or project insight. Use `alt=""` for images that are truly decorative or redundant with adjacent content. Give interface screenshots distinct descriptions that identify the screen or finding shown.

### 8. There is no automated regression coverage beyond Astro's compiler check

**Where:** `package.json:7-10`, `.github/workflows/deploy.yml`

The compiler and content checks pass even though deployed navigation is broken. There is no unit, route/link, accessibility, or end-to-end test suite, and the deployment workflow does not validate generated internal links.

**Recommendation:** At minimum add:

1. A generated internal-link and asset checker.
2. A Playwright smoke test for Home → Work → project → next/previous project.
3. Automated accessibility checks for representative pages.
4. Assertions for base-path builds and mobile overflow.

### 9. The LinkedIn link is a placeholder

**Where:** `src/content/settings/site.json:9`

The URL goes to the LinkedIn homepage rather than Katerina's profile, while the link is presented as a personal contact destination.

**Recommendation:** Replace it with the intended profile URL or remove it until available. Capitalise the visible label as `LinkedIn`.

### 10. Accessibility support is good in places but incomplete

**Where:** `src/layouts/BaseLayout.astro`, `src/pages/index.astro:17-27`, `src/styles/global.css:49`

Positive foundations include a single H1 on the reviewed pages, semantic navigation, visible link focus, reduced-motion handling, decorative-image hiding, and safe new-tab labels on Contact. Remaining issues:

- No skip link is provided before the repeated header navigation.
- The continuously scrolling expertise carousel is driven by a 20 ms `setInterval`; it checks reduced motion only on initial load and does not respond if the preference changes.
- The reduced-motion CSS names `.role-marquee-track`, but the actual class is `.role-carousel-track`.
- Generic/repeated image alternatives make galleries verbose.
- The mobile header fits at 390 px but is cramped into two lines; test at the stated 320 px minimum with zoom and long translated/user-edited labels.

### 11. Deployment security can be hardened

**Where:** `.github/workflows/deploy.yml`

The workflow has appropriately limited named permissions compared with a write-all token, and outbound links correctly use `rel="noopener noreferrer"`. However:

- GitHub Actions are pinned to mutable major tags rather than immutable commit SHAs.
- `pages: write` and `id-token: write` are set at workflow level, so the build job receives more permission than it needs.
- There is no dependency update automation or security scanning in CI.
- The external Google Fonts stylesheet adds a third-party availability/privacy dependency and makes a strict content security policy harder.

**Recommendation:** Pin actions by SHA, scope permissions per job, add dependency monitoring, and consider self-hosting the two font families. GitHub Pages has limited response-header control, so document which security headers would require a different hosting layer.

## P3 — Maintainability and polish

### 12. The stylesheet is difficult to maintain and contains overridden design rules

**Where:** `src/styles/global.css`

The 28 KB stylesheet is compressed into only 49 physical lines, often with dozens of selectors per line. Later rules reverse earlier behavior—for example `object-fit: cover` becomes `contain`, hover scaling is later disabled, and value-card bullets are added and then hidden. The About breakpoints and card rules are split across repeated blocks.

**Recommendation:** Format the CSS, group it by component/page, remove dead and overridden declarations, and consider component-scoped Astro styles. Add Stylelint/Prettier if the project will continue evolving.

### 13. Astro files are overly compressed

**Where:** `src/pages/work/index.astro`, `src/pages/contact.astro`, `src/pages/work/[...slug].astro`, `src/layouts/BaseLayout.astro`

Several imports, data operations, and entire templates are placed on single lines. This makes diffs harder to review and helped hide the `.md` route bug.

**Recommendation:** Apply consistent formatting and split complex template sections into small components such as `SiteHeader`, `SiteFooter`, `ProjectNavigation`, and `ResponsiveImage`.

### 14. Content ownership is split unpredictably

**Where:** `src/content/pages/about.json`, `src/pages/about.astro`, `src/pages/index.astro`, `src/layouts/BaseLayout.astro`

Some editable copy lives in JSON, while closely related content is hard-coded into templates: About stories, values, capabilities, homepage role labels, the hero kicker, and footer CTA. An editor cannot know which surface owns a given sentence without reading source code.

**Recommendation:** Move portfolio copy into typed content data and keep templates focused on layout. Document any intentionally fixed interface labels.

### 15. Project schema behavior and fallback behavior are inconsistent

**Where:** `src/content.config.ts:51-54`, `src/components/ProjectCard.astro:8`

`cover` is optional, but every coverless project card displays a hard-coded “Action Society” placeholder. A future project without a cover would therefore be mislabeled. `gallery` is mandatory even though an empty array is valid, which should be made explicit in CMS defaults.

**Recommendation:** Either require covers everywhere or create a neutral placeholder derived from `project.data.title`. Align schema and CMS requirements.

### 16. SEO and sharing metadata are serviceable but incomplete

**Where:** `src/layouts/BaseLayout.astro:11-24`, `astro.config.mjs:4-9`, `public/robots.txt`

Canonical links, descriptions, Open Graph basics, Twitter card type, robots metadata, and a sitemap are present. Improvements:

- Add `og:image:alt`, explicit image dimensions/type where known, and Twitter title/description/image metadata.
- Add a favicon and theme colour.
- The local/fallback site URL uses `example.github.io`; CI correctly receives `GITHUB_REPOSITORY_OWNER`, but accidental builds outside Actions can publish invalid canonicals.
- `robots.txt` hard-codes `/KatPortfolio/`, which conflicts with the stated future custom-domain readiness.
- Confirm that the default social image should be the portrait; the existing `src/assets/uploads/og.png` is unused.

### 17. Naming and language style are inconsistent

Examples include title case versus sentence case (`Available For Opportunities`), British and American English (`organise`/`organized`, `colour`/`color`, `prioritise`/`prioritize`), slash versus middle-dot role separators, `&` versus “and”, and inconsistent capitalisation of tools (`Figma`, `Slack`, `Google Workspace`, `Blender`).

**Recommendation:** Choose a short editorial style guide—likely British English given the existing Swedish/European context—and apply it to headings, roles, tools, punctuation, and case-study metadata.

### 18. Documentation describes features that are not implemented

**Where:** `PLAN.md`, `EDITOR-GUIDE.md`

Examples include responsive image processing, meaningful image dimensions, editable page forms, an external project link, and a long-form About biography. Documentation that reads as complete makes it harder to distinguish future intent from current behavior.

**Recommendation:** Convert `PLAN.md` into a checked implementation status or archive it as the original proposal, then update `EDITOR-GUIDE.md` to match the actual CMS workflow.

## Copy-edit checklist

This table captures clear errors and high-confidence edits, not every possible stylistic rewrite.

| File and line | Current | Suggested direction |
| --- | --- | --- |
| `src/content/pages/about.json:5` | `Possitive team Collaboration` | `Positive team collaboration` |
| `src/pages/about.astro:25` | `Im motivated`, `self improvement` | `I’m motivated`, `self-improvement` |
| `src/pages/about.astro:29` | `My Strenghts` | `My Strengths` |
| `src/pages/about.astro:29` | `Creative - technical collaboration` | `Creative–technical collaboration` or `Creative and technical collaboration` |
| `src/pages/about.astro:29` | `Google workspace` | `Google Workspace` |
| `src/pages/about.astro:12` | `Organize trips & exploring the swedish heritage` | Rewrite for parallel grammar, e.g. `Organising trips and exploring Swedish heritage` |
| `src/content/projects/wellstreet.md:2-7` | `Brandsrategy`, `Figjam`, `figma design`, `slack` | `Brand Strategy`, `FigJam`, `Figma`, `Slack` |
| `src/content/projects/grocery-navigator.md:2-7` | Generic project name; `FIgma`; raw metadata summary | Use the actual product/project name, `Figma`, and a concise outcome-led summary |
| `src/content/projects/ar-exhibition.md:3-7` | `Figjam`, `3D blender`, `Meadow ( AR )`, `Makey Makey /scratch` | `FigJam`, `Blender`, `Meadow (AR)`, `Makey Makey / Scratch` |
| `src/content/projects/ar-exhibition.md:37` | `The creatures on the right picture is what I designed on 3d blender.` | Rewrite: plural agreement, direct image reference, and `Blender` |
| `src/content/projects/ar-exhibition.md:65` | `qr codes i`, `exhicition`, spaced parentheses | Rewrite and correct `QR`, `I`, `exhibition`, punctuation, and app naming |
| `src/content/projects/all-in.md:57` | `The session Setup continues The HR add the participants.` | Rewrite as a complete procedural sentence |
| `src/content/projects/all-in.md:67` | `if ... you have confirm` | `If ... you have confirmed` plus a full copy edit |
| `src/content/projects/all-in.md:83-91` | `48 hours Sprint`, `Check- Ins`, `feautures` | `48-hour sprint`, `check-ins`, `features` |
| `src/content/projects/psychological-safety-workshop.md:5,37` | `Co- Facilitator` | `Co-facilitator` |
| `src/content/projects/faros.md:44` | Published editing note after the challenge question | Remove `That keeps the important story and removes repetition.` |
| `src/content/projects/faros.md:66` | Published layout instruction | Remove `Then underneath those three, make the competitor finding visually dominant:` |
| `src/content/projects/faros.md:70` | `Low fidelity` | `low-fidelity` |
| `src/content/projects/faros.md:92` | `findings we identify` | `findings we identified` |
| `src/content/projects/faros.md:114` | `Beyond the Screen The FAROS Lamp` | Add punctuation, e.g. `Beyond the Screen: The FAROS Lamp` |
| `src/content/projects/action-society.md:74` | `Facebook, Linkedin, & insta` | `Facebook, LinkedIn and Instagram` |
| `src/content/projects/action-society.md:109` | Empty/incomplete `SHARED ACTION` section | Complete it or remove the fragment |
| `src/content/pages/home.json:8` | `Latest Projects that reflect...` | Use sentence case: `Latest projects that reflect...` |
| `src/pages/index.astro:10` | `Project Coordinator Based in Stockholm` | `project coordinator based in Stockholm` unless intentional title case |

## What is already working well

- The repository is small, navigable, and uses a suitable static-first framework.
- TypeScript/Astro strict checking and content validation are enabled.
- The production build succeeds and generates the intended 12 pages plus sitemap.
- GitHub Pages base-path handling is applied consistently to most navigation and asset URLs.
- Navigation, landmarks, headings, focus styling, `aria-current`, hidden decorative images, and new-tab safety are thoughtfully implemented.
- The reviewed pages maintain one clear H1 and no document-level horizontal overflow at 390 px.
- The site has a coherent visual system and strong responsive grid changes.
- There is no contact form, database, authentication, or server runtime, so the application attack surface is appropriately small.
- The deployment workflow uses `npm ci`, a lockfile, a static artifact, and a dedicated deployment environment.
- The worktree was clean before this review; only this review document was added.

## Recommended remediation order

1. Fix and test project previous/next routes.
2. Correct and centralise the telephone number; replace the LinkedIn placeholder.
3. Upgrade Astro and clear the dependency audit.
4. Remove published editorial notes and complete a full copy proofread.
5. Align Pages CMS, schemas, templates, and editor documentation.
6. Consolidate and optimise images; add dimensions and responsive variants.
7. Add link, accessibility, and browser smoke tests to CI.
8. Refactor/format CSS and Astro templates after behavior is covered by tests.
9. Complete metadata, action pinning, and remaining accessibility polish.

## Verification baseline

The following commands were used for the review and should remain green after remediation:

```powershell
npm run validate
$env:GITHUB_ACTIONS='true'; npm run build
npm audit --omit=dev --audit-level=low
```

Add the proposed internal-link and browser checks to this baseline once implemented.
