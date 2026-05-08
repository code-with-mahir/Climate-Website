export type ClimateArticle = {
    title: string;
    full_article_markdown: string;
    meta_description: string;
    suggested_image_query: string;
    image_url?: string;
    source_title?: string;
    source_link?: string;
    published_at?: string;
};

export type ClimateArticleFeed = {
    articles: ClimateArticle[];
};

function stripCodeFences(text: string): string {
    const trimmed = text.trim();

    if (trimmed.startsWith('```')) {
        return trimmed
            .replace(/^```(?:json)?\s*/i, '')
            .replace(/```\s*$/, '')
            .trim();
    }

    return trimmed;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toStringField(value: unknown, fallback = ''): string {
    return typeof value === 'string' ? value.trim() : fallback;
}

export function normalizeClimateArticle(raw: unknown): ClimateArticle {
    if (!isRecord(raw)) {
        throw new Error('Gemini article item must be an object');
    }

    const title = toStringField(raw.title);
    const fullArticleMarkdown = toStringField(raw.full_article_markdown);
    const metaDescription = toStringField(raw.meta_description);
    const suggestedImageQuery = toStringField(raw.suggested_image_query);

    if (!title || !fullArticleMarkdown || !metaDescription || !suggestedImageQuery) {
        throw new Error('Gemini article is missing one or more required fields');
    }

    return {
        title,
        full_article_markdown: fullArticleMarkdown,
        meta_description: metaDescription,
        suggested_image_query: suggestedImageQuery,
        image_url: toStringField(raw.image_url) || undefined,
        source_title: toStringField(raw.source_title) || undefined,
        source_link: toStringField(raw.source_link) || undefined,
        published_at: toStringField(raw.published_at) || undefined,
    };
}

export function parseClimateArticleFeed(rawText: string): ClimateArticleFeed {
    const payload = JSON.parse(stripCodeFences(rawText));

    if (!isRecord(payload) || !Array.isArray(payload.articles)) {
        throw new Error('Gemini response did not match the expected { articles: [...] } schema');
    }

    return {
        articles: payload.articles.map(normalizeClimateArticle),
    };
}

export function buildFallbackArticle(source: {
    title: string;
    summary: string;
    link: string;
    source: string;
    publishedAt?: string;
}): ClimateArticle {
    const description = source.summary || source.title;

    return {
        title: source.title,
        full_article_markdown: [
            '## Why',
            description,
            '',
            '## Impact',
            'This development matters because it reflects accelerating climate risk and the need for immediate adaptation and emissions reductions.',
            '',
            '## Solutions',
            `- Track the update from the source channel: ${source.source}`,
            '- Strengthen local resilience plans and public climate communication',
            '- Connect the signal to policy, design, and public action',
        ].join('\n'),
        meta_description: description.slice(0, 160),
        suggested_image_query: `${source.title} climate`,
        source_title: source.source,
        source_link: source.link,
        published_at: source.publishedAt,
    };
}
