# Professional Portfolio Website

## Summary

Build a warm, personal professional portfolio using Astro and TypeScript. The site will be fully static, responsive, accessible, and deployed automatically to GitHub Pages.

Content will remain in the GitHub repository but be managed through [Pages CMS](https://pagescms.org/), giving the non-developer editor forms for changing text, creating projects, and uploading images.

## Implementation Changes

### Site experience

- Create Home, Work, individual Project, About, Contact, and custom 404 pages.
- Lead the homepage with an editable portrait, name, professional role, positioning statement, and selected projects.
- Present Work as a responsive project grid with manually controlled ordering.
- Give each project a guided case-study layout containing:
  - Title, summary, client, role, year, and services.
  - Cover image with required alternative text.
  - Rich-text case study body.
  - Image gallery with alternative text and optional captions.
  - Optional external project link.
  - Featured-homepage setting and display order.
- Make About support a portrait, introduction, long-form biography, and editable expertise list.
- Make Contact display an editable introduction, email address, and professional/social links. Do not include a contact form in v1.
- Use warm neutral colors, approachable typography, generous spacing, restrained transitions, and strong mobile layouts.
- Respect reduced-motion preferences and provide visible keyboard focus states.

### Content and editing

- Store projects as Markdown files with validated frontmatter.
- Store homepage, About, Contact, navigation, social links, and SEO defaults in clearly separated content/settings files.
- Store CMS-uploaded images in a dedicated repository folder and process them through Astro's responsive image pipeline.
- Add a root `.pages.yml` defining friendly labels, help text, required fields, image restrictions, rich-text inputs, and reusable project/gallery fields.
- Configure Pages CMS to save directly to the default branch. Each save therefore publishes after the GitHub Pages workflow succeeds.
- Add an editor guide covering sign-in, editing pages, adding and reordering projects, image preparation, alternative text, publishing, and recovering earlier content through Git history.

### Build, deployment, and discovery

- Configure Astro for static output and repository-subpath-safe URLs.
- Add a GitHub Actions workflow that installs locked dependencies, validates content, builds the site, and deploys the artifact to GitHub Pages.
- Target `https://<owner>.github.io/KatPortfolio/` initially, deriving the owner/repository context during deployment where practical.
- Keep configuration ready for a later custom domain without making it part of v1.
- Add page titles, descriptions, canonical URLs, Open Graph metadata, sitemap, robots metadata, and meaningful image dimensions to reduce layout shift.
- Ensure navigation, assets, sitemap entries, and 404 behavior work under the GitHub Pages repository subpath.

## Public Interfaces and Content Types

- `SiteSettings`: name, role, email, social links, default SEO description, and default sharing image.
- `HomePage`: introduction, portrait, primary calls to action, and featured-work heading.
- `Project`: slug, title, summary, client, role, year, services, cover image, case-study body, gallery, optional external link, featured flag, and order.
- `AboutPage`: introduction, portrait, biography, and expertise list.
- `ContactPage`: heading and introductory text; email and social destinations come from shared site settings.
- All image fields include editor-facing alternative-text fields; gallery items additionally support captions.

## Test Plan

- Validate all content schemas and fail the build with actionable errors when required content or image metadata is missing.
- Verify production builds with the GitHub Pages base path rather than only at `/`.
- Test homepage selection and ordering, project generation, optional metadata, gallery rendering, and external-link behavior.
- Test the complete CMS flow: edit text, create a project, upload images, reorder work, save, trigger deployment, and confirm the published result.
- Check layouts at mobile, tablet, and desktop widths.
- Run automated accessibility checks plus manual keyboard, focus, heading-order, contrast, reduced-motion, and screen-reader-label checks.
- Confirm metadata, sitemap, canonical URLs, social previews, missing-page handling, and acceptable image performance.

## Assumptions

- The repository will be named `KatPortfolio`; the GitHub owner identity will be supplied or discovered when the repository is created.
- The content editor will have a GitHub account with write access to the repository.
- Saving in Pages CMS publishes immediately; there is no approval or draft workflow in v1.
- The initial site uses one language.
- Initial content may use clearly labeled placeholders until final biography, project material, portrait, email, and social links are supplied.
- GitHub Pages hosts only the generated public site; Pages CMS supplies the external browser-based editing interface and writes content directly to GitHub.
