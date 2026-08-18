import type { CollectionEntry } from 'astro:content';

type Project = CollectionEntry<'projects'>;

/**
 * Converts an Astro content entry ID into the URL segment used by project pages.
 * Keep this as the single source of truth: content IDs include their file extension.
 */
export function projectSlug(project: Project): string {
  return project.id.replace(/\.md$/, '');
}

export function projectPath(project: Project): string {
  return `/work/${projectSlug(project)}/`;
}
