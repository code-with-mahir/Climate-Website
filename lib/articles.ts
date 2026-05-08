import { promises as fs } from 'fs';
import path from 'path';
import { defaultArticles, type ClimateArticle } from './content';
import { slugifyArticleTitle } from './utils';

type GeneratedFeedPayload = {
    articles?: ClimateArticle[];
};

export type ClimateArticleWithSlug = ClimateArticle & {
    slug: string;
};

export async function getAllArticles(): Promise<ClimateArticleWithSlug[]> {
    const generatedPath = path.join(process.cwd(), 'public', 'generated', 'climate-feed.json');

    try {
        const raw = await fs.readFile(generatedPath, 'utf-8');
        const parsed = JSON.parse(raw) as GeneratedFeedPayload;

        if (Array.isArray(parsed.articles) && parsed.articles.length > 0) {
            return parsed.articles.map((article) => ({
                ...article,
                slug: slugifyArticleTitle(article.title),
            }));
        }
    } catch {
        // Use static fallback articles when generated JSON is not present.
    }

    return defaultArticles.map((article) => ({
        ...article,
        slug: slugifyArticleTitle(article.title),
    }));
}

export async function getArticleBySlug(slug: string): Promise<ClimateArticleWithSlug | null> {
    const articles = await getAllArticles();
    return articles.find((article) => article.slug === slug) ?? null;
}
