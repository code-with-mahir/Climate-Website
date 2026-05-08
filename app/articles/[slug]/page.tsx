import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ArticleDetailView from '../../../components/article-detail-view';
import { getAllArticles, getArticleBySlug } from '../../../lib/articles';

type PageParams = {
    slug: string;
};

export async function generateStaticParams() {
    const articles = await getAllArticles();
    return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<PageParams>;
}): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);

    if (!article) {
        return {
            title: 'Article Not Found | Climate Change Awareness Portal',
            description: 'The requested climate article could not be found.',
        };
    }

    return {
        title: `${article.title} | Climate Change Awareness Portal`,
        description: article.meta_description,
        openGraph: {
            title: article.title,
            description: article.meta_description,
            images: article.image_url ? [article.image_url] : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.meta_description,
            images: article.image_url ? [article.image_url] : undefined,
        },
    };
}

export default async function ArticleDetailPage({ params }: { params: Promise<PageParams> }) {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);
    const allArticles = await getAllArticles();

    if (!article) {
        notFound();
    }

    const relatedArticles = allArticles.filter((item) => item.slug !== article.slug);

    return (
        <main className="mx-auto max-w-7xl px-6 py-10 sm:px-10 lg:px-12">
            <div className="grid gap-8 lg:grid-cols-[1.6fr_0.8fr]">
                <ArticleDetailView article={article} />

                <aside className="glass-panel h-fit rounded-3xl p-6 sm:p-8">
                    <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
                        Related News
                    </p>
                    <h2 className="heading-font mt-2 text-2xl font-semibold text-white">
                        Keep reading
                    </h2>
                    <div className="mt-6 grid gap-4">
                        {relatedArticles.slice(0, 3).map((item) => (
                            <Link
                                key={item.slug}
                                href={`/articles/${item.slug}`}
                                className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-orange-200/30 hover:bg-white/10">
                                <p className="text-sm text-orange-200/90">
                                    {item.source_title ?? 'Climate Briefing'}
                                </p>
                                <p className="mt-2 text-base font-semibold text-white">
                                    {item.title}
                                </p>
                            </Link>
                        ))}
                    </div>
                </aside>
            </div>

            <section className="mt-12">
                <div className="mb-6 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
                            More Stories
                        </p>
                        <h2 className="heading-font mt-2 text-3xl font-semibold text-white">
                            Explore the wider briefing
                        </h2>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {relatedArticles.slice(0, 6).map((item) => (
                        <Link
                            key={item.slug}
                            href={`/articles/${item.slug}`}
                            className="glass-panel overflow-hidden rounded-3xl transition hover:-translate-y-1">
                            <div className="relative h-48 w-full">
                                <Image
                                    src={
                                        item.image_url ??
                                        'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80'
                                    }
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/10 to-transparent" />
                            </div>
                            <div className="space-y-3 p-5">
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                    {item.source_title ?? 'Climate Briefing'}
                                </p>
                                <p className="text-lg font-semibold text-white">{item.title}</p>
                                <p className="text-sm leading-6 text-slate-300">
                                    {item.meta_description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
