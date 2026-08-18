# Editing Kat’s portfolio

## Sign in and publish

Open [Pages CMS](https://pagescms.org/) and sign in with the GitHub account that can write to this repository. Choose this repository, make your edits, and save. Each save goes to `main`; GitHub Pages publishes the update after its workflow finishes.

## Edit a page

The files in `src/content/pages/` control the homepage, About page, Contact page, and navigation. The shared name, role, email, social links, and SEO defaults are in `src/content/settings/site.json`.

## Add or reorder a project

Create a new item under **Projects**. Fill every required field, including useful image alternative text. Use the **Display order** number to control the Work grid and check **Show on homepage** to include it on the homepage. Lower numbers appear first.

## Prepare images

Upload images through the CMS; they are saved in `src/assets/uploads/` and optimized when the site builds. Use landscape images for project covers where possible, crop intentionally, and keep original files reasonably sized. Alternative text should convey the useful visual information, not merely say “image of”. Captions are optional and can add context not obvious from the image.

## Recover earlier content

Every saved edit is a Git commit. In GitHub, open the file’s history, find the version you want, and restore it through the GitHub interface (or ask a developer to help). Saving the restoration publishes it like any other change.
