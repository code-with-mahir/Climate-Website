import Image from 'next/image';
import Link from 'next/link';
import { getAllArticles } from '../../lib/articles';

export default async function ArchivePage() {
    const articles = await getAllArticles();

    return (
        <main className="mx-auto max-w-7xl px-6 py-10 sm:px-10 lg:px-12">
            <div className="mb-8">
                <p className="text-sm uppercase tracking-[0.28em] text-orange-300/80">Archive</p>
                <h1 className="heading-font mt-3 text-4xl font-semibold text-white sm:text-5xl">
                    Full briefing archive
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
                    Browse the complete climate intelligence feed with every generated report.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                    <article
                        key={article.slug}
                        className="glass-panel flex h-full flex-col overflow-hidden rounded-3xl">
                        <div className="relative h-52 w-full">
                            <Image
                                src={
                                    article.image_url ??
                                    'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80'
                                }
                                alt={article.title}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/10 to-transparent" />
                        </div>
                        <div className="flex h-full flex-col space-y-4 p-6">
                            <div>
                                <h2 className="heading-font text-xl font-semibold text-white">
                                    {article.title}
                                </h2>
                            </div>
                            <p className="text-sm leading-6 text-slate-300">
                                {article.meta_description}
                            </p>
                            <div className="flex-1">
                                <p className="text-sm leading-6 text-slate-300">
                                    {article.full_article_markdown
                                        .replace(/^#+\s+/gm, '')
                                        .replace(/\n+/g, ' ')
                                        .slice(0, 180)}
                                    ...
                                </p>
                            </div>
                            <div className="mt-auto pt-2">
                                <Link
                                    href={`/articles/${article.slug}`}
                                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/10">
                                    Read full report
                                </Link>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </main>
    );
}
