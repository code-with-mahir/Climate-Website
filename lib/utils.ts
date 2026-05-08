/**
 * Converts an article title to a URL-safe slug.
 * Pure function with no server dependencies - safe for Client Components.
 */
export function slugifyArticleTitle(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}
