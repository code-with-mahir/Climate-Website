import { XMLParser } from 'fast-xml-parser';

export type ClimateNewsItem = {
    title: string;
    summary: string;
    link: string;
    source: string;
    publishedAt?: string;
};

type FeedConfig = {
    name: string;
    url: string;
};

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    textNodeName: 'text',
    trimValues: true,
});

const defaultFeeds: FeedConfig[] = [
    {
        name: 'NASA Climate',
        url: process.env.NASA_CLIMATE_RSS_URL ?? 'https://climate.nasa.gov/rss/news.xml',
    },
    {
        name: 'IPCC',
        url: process.env.IPCC_RSS_URL ?? 'https://www.ipcc.ch/feed/',
    },
];

function asArray<T>(value: T | T[] | undefined): T[] {
    if (!value) {
        return [];
    }

    return Array.isArray(value) ? value : [value];
}

function readTextField(value: unknown): string {
    if (typeof value === 'string') {
        return value.trim();
    }

    if (
        typeof value === 'object' &&
        value &&
        'text' in value &&
        typeof (value as { text?: unknown }).text === 'string'
    ) {
        return ((value as { text: string }).text || '').trim();
    }

    return '';
}

export async function fetchClimateNewsItems(
    limit = Number(process.env.RSS_FEED_LIMIT ?? 6),
): Promise<ClimateNewsItem[]> {
    const feedResponses = await Promise.all(
        defaultFeeds.map(async (feed) => {
            const response = await fetch(feed.url, {
                headers: {
                    'user-agent': 'Climate-Change-Awareness-Portal/1.0',
                },
            });

            if (!response.ok) {
                return [] as ClimateNewsItem[];
            }

            const xml = await response.text();
            const parsed = parser.parse(xml) as {
                rss?: {
                    channel?: {
                        item?: unknown[] | unknown;
                    };
                };
                feed?: {
                    entry?: unknown[] | unknown;
                };
            };

            const rssItems = asArray(parsed.rss?.channel?.item)
                .map((item) => {
                    if (typeof item !== 'object' || item === null) {
                        return null;
                    }

                    const record = item as Record<string, unknown>;

                    return {
                        title: readTextField(record.title) || 'Climate update',
                        summary:
                            readTextField(record.description) ||
                            readTextField(record['content:encoded']) ||
                            readTextField(record.summary),
                        link: readTextField(record.link),
                        source: feed.name,
                        publishedAt: readTextField(record.pubDate) || readTextField(record.updated),
                    } satisfies ClimateNewsItem;
                })
                .filter(Boolean) as ClimateNewsItem[];

            const atomItems = asArray(parsed.feed?.entry)
                .map((entry) => {
                    if (typeof entry !== 'object' || entry === null) {
                        return null;
                    }

                    const record = entry as Record<string, unknown>;
                    const linkEntry = asArray(record.link)[0] as
                        | Record<string, unknown>
                        | undefined;

                    return {
                        title: readTextField(record.title) || 'Climate update',
                        summary: readTextField(record.summary) || readTextField(record.content),
                        link: readTextField(linkEntry?.href) || '',
                        source: feed.name,
                        publishedAt:
                            readTextField(record.updated) || readTextField(record.published),
                    } satisfies ClimateNewsItem;
                })
                .filter(Boolean) as ClimateNewsItem[];

            return [...rssItems, ...atomItems].filter((item) => item.title && item.link);
        }),
    );

    return feedResponses.flat().slice(0, limit);
}

export function formatClimateNewsForPrompt(items: ClimateNewsItem[]): string {
    return items
        .map((item, index) => {
            return [
                `Source ${index + 1}: ${item.source}`,
                `Title: ${item.title}`,
                `Summary: ${item.summary || 'No summary available.'}`,
                `Link: ${item.link}`,
                item.publishedAt ? `Published: ${item.publishedAt}` : '',
            ]
                .filter(Boolean)
                .join('\n');
        })
        .join('\n\n');
}
