# Editing Kat’s portfolio

## Sign in and publish

Open [Pages CMS](https://pagescms.org/) and sign in with the GitHub account that can write to this repository. Choose this repository, make your edits, and save. Each save goes to `main`; GitHub Pages publishes the update after its workflow finishes.

## Edit a page

The CMS has separate **Home page**, **About page**, **Contact page**, **Navigation**, and **Site settings** forms. These control the files in `src/content/pages/` and `src/content/settings/site.json`.

## Add or reorder a project

Create a new item under **Projects**. Fill every required field, including useful image alternative text. Use the **Display order** number to control the Work grid and check **Show on homepage** to include it on the homepage. Lower numbers appear first.

## Prepare images

Upload images through the CMS; they are saved in `public/portfolio-assets/uploads/` and served directly by the site. Resize and compress them before uploading, keep only the versions used by the site, and use landscape images for project covers where possible. Alternative text should convey the useful visual information, not merely say “image of”. Captions are optional and can add context not obvious from the image.

## Recover earlier content

Every saved edit is a Git commit. In GitHub, open the file’s history, find the version you want, and restore it through the GitHub interface (or ask a developer to help). Saving the restoration publishes it like any other change.
