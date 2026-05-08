'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { AlertTriangle, ArrowUpRight, Leaf, Waves } from 'lucide-react';
import {
    defaultClimateStats,
    defaultArticles,
    solutionSteps,
    type ClimateArticle,
    type ClimateStat,
} from '../lib/content';
import { slugifyArticleTitle } from '../lib/utils';

const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

export default function ClimatePortal() {
    const [articles, setArticles] = useState<ClimateArticle[]>(defaultArticles);
    const [stats, setStats] = useState<ClimateStat[]>(defaultClimateStats);
    const [activeSolution, setActiveSolution] = useState(solutionSteps[0].title);
    const [sourceItems, setSourceItems] = useState<Array<{ title: string; source: string }>>([]);
    const { scrollYProgress } = useScroll();
    const heroGlow = useTransform(scrollYProgress, [0, 0.45], [1, 0.45]);
    const heroLift = useTransform(scrollYProgress, [0, 0.45], [0, -80]);

    useEffect(() => {
        const controller = new AbortController();

        async function loadData() {
            try {
                const response = await fetch('/api/reports', { signal: controller.signal });

                if (!response.ok) {
                    return;
                }

                const payload = (await response.json()) as {
                    articles?: ClimateArticle[];
                    stats?: ClimateStat[];
                    sources?: Array<{ title: string; source: string }>;
                };

                if (payload.articles?.length) {
                    setArticles(payload.articles);
                }

                if (payload.stats?.length) {
                    setStats(payload.stats);
                }

                if (payload.sources?.length) {
                    setSourceItems(
                        payload.sources.map((item) => ({ title: item.title, source: item.source })),
                    );
                }
            } catch {
                setArticles(defaultArticles);
                setStats(defaultClimateStats);
            }
        }

        loadData();

        return () => controller.abort();
    }, []);

    const activePanel = useMemo(
        () => solutionSteps.find((step) => step.title === activeSolution) ?? solutionSteps[0],
        [activeSolution],
    );

    return (
        <main className="relative overflow-hidden">
            <motion.div
                className="pointer-events-none fixed inset-x-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-signal-500 via-orange-300 to-cyan-300"
                style={{ scaleX: scrollYProgress }}
            />

            <div className="noise-mask absolute inset-0 -z-10 opacity-80">
                <motion.div
                    className="absolute left-[8%] top-24 h-72 w-72 rounded-full bg-orange-500/15 blur-3xl"
                    style={{ opacity: heroGlow, y: heroLift }}
                />
                <motion.div
                    className="absolute right-[6%] top-40 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl"
                    style={{ opacity: heroGlow, y: heroLift }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.05),_transparent_40%)]" />
            </div>

            <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-10 sm:px-10 lg:px-12">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={heroVariants}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="max-w-4xl">
                    <h1 className="heading-font max-w-5xl text-5xl font-semibold tracking-tight text-white sm:text-7xl lg:text-8xl">
                        Climate change deserves a portal that feels urgent, credible, and alive.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                        Monitor live climate signals, read trusted climate reports, and guide action
                        through premium motion design and a dark, immersive interface.
                    </p>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <a
                            href="#dashboard"
                            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition-transform duration-200 hover:-translate-y-0.5">
                            Explore dashboard
                            <ArrowUpRight className="h-4 w-4" />
                        </a>
                        <a
                            href="#reports"
                            className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10">
                            View reports
                        </a>
                    </div>
                </motion.div>
            </section>
            <section id="dashboard" className="mx-auto max-w-7xl px-6 pb-8 sm:px-10 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5 }}
                    className="glass-panel rounded-3xl p-6 sm:p-8">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm uppercase tracking-[0.28em] text-orange-300/80">
                                Live Data Dashboard
                            </p>
                            <h2 className="heading-font mt-2 text-3xl font-semibold text-white">
                                Pressure signals across the climate system
                            </h2>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        {stats.map((stat, index) => (
                            <motion.article
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ delay: index * 0.1, duration: 0.45 }}
                                className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-slate-400">{stat.label}</p>
                                        <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <span className="rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-xs font-medium text-orange-200">
                                        {stat.delta}
                                    </span>
                                </div>
                                <p className="mt-4 text-sm leading-6 text-slate-300">{stat.note}</p>
                            </motion.article>
                        ))}
                    </div>
                </motion.div>
            </section>

            <section id="reports" className="mx-auto max-w-7xl px-6 py-10 sm:px-10 lg:px-12">
                <div className="mb-6 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
                            Reports / News
                        </p>
                        <h2 className="heading-font mt-2 text-3xl font-semibold text-white sm:text-4xl">
                            Climate article feed
                        </h2>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <AnimatePresence mode="popLayout">
                        {articles.map((article, index) => (
                            <motion.article
                                key={article.title}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ delay: index * 0.08, duration: 0.45 }}
                                className="glass-panel flex h-full flex-col overflow-hidden rounded-3xl">
                                <div className="relative h-64 w-full overflow-hidden">
                                    <Image
                                        src={
                                            article.image_url ??
                                            'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80'
                                        }
                                        alt={article.title}
                                        fill
                                        className="object-cover transition duration-700 hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/10 to-transparent" />
                                </div>

                                <div className="flex h-full flex-col space-y-4 p-6">
                                    <div>
                                        <h3 className="heading-font text-2xl font-semibold text-white">
                                            {article.title}
                                        </h3>
                                    </div>

                                    <div>
                                        <p className="text-sm leading-6 text-slate-300">
                                            {article.meta_description}
                                        </p>
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-sm leading-6 text-slate-300">
                                            {article.full_article_markdown
                                                .replace(/^#+\s+/gm, '')
                                                .replace(/\n+/g, ' ')
                                                .slice(0, 240)}
                                            ...
                                        </p>
                                    </div>

                                    <div className="mt-auto pt-2">
                                        <Link
                                            href={`/articles/${slugifyArticleTitle(article.title)}`}
                                            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/10">
                                            Read full report
                                            <ArrowUpRight className="h-3.5 w-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
                    <p className="mb-3 text-xs uppercase tracking-[0.28em] text-slate-400">
                        Latest source stream
                    </p>
                    <div className="grid gap-2 md:grid-cols-2">
                        {sourceItems.length ? (
                            sourceItems.map((item) => (
                                <div
                                    key={`${item.source}-${item.title}`}
                                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                                    <p className="font-medium text-white">{item.title}</p>
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                        {item.source}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p>
                                RSS sources will appear here after the first fetch from NASA and
                                IPCC feeds.
                            </p>
                        )}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-10 sm:px-10 lg:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5 }}
                    className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="glass-panel rounded-3xl p-6 sm:p-8">
                        <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
                            Solution Guide
                        </p>
                        <h2 className="heading-font mt-2 text-3xl font-semibold text-white">
                            Action paths for individuals and organizations
                        </h2>

                        <div className="mt-6 grid gap-3">
                            {solutionSteps.map((step) => {
                                const isActive = step.title === activeSolution;

                                return (
                                    <button
                                        key={step.title}
                                        type="button"
                                        onClick={() => setActiveSolution(step.title)}
                                        className={`rounded-2xl border px-4 py-4 text-left transition ${
                                            isActive
                                                ? 'border-orange-400/30 bg-orange-400/10 text-white'
                                                : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/8'
                                        }`}>
                                        <div className="flex items-center gap-3">
                                            {step.title === 'Reduce' ? (
                                                <Leaf className="h-5 w-5 text-emerald-300" />
                                            ) : step.title === 'Adapt' ? (
                                                <AlertTriangle className="h-5 w-5 text-amber-300" />
                                            ) : (
                                                <Waves className="h-5 w-5 text-sky-300" />
                                            )}
                                            <span className="heading-font text-lg font-semibold">
                                                {step.title}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm leading-6 text-slate-300">
                                            {step.description}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <motion.div layout className="glass-panel rounded-3xl p-6 sm:p-8">
                        <p className="text-sm uppercase tracking-[0.28em] text-orange-300/80">
                            Focused guidance
                        </p>
                        <h3 className="heading-font mt-2 text-3xl font-semibold text-white">
                            {activePanel.title}
                        </h3>
                        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
                            {activePanel.description}
                        </p>

                        <div className="mt-8 grid gap-4 md:grid-cols-3">
                            {activePanel.outcomes.map((item) => (
                                <div
                                    key={item}
                                    className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <div className="mb-4 h-10 w-10 rounded-2xl bg-gradient-to-br from-orange-400/20 to-cyan-400/20" />
                                    <p className="text-sm leading-6 text-slate-200">{item}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </section>

        </main>
    );
}
