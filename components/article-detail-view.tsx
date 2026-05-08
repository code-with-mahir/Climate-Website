'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Share2 } from 'lucide-react';
import type { ClimateArticleWithSlug } from '../lib/articles';

type Props = {
    article: ClimateArticleWithSlug;
};

type ToastState = {
    message: string;
    tone: 'success' | 'error';
};

export default function ArticleDetailView({ article }: Props) {
    const [toast, setToast] = useState<ToastState | null>(null);
    const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    function showToast(message: string, tone: ToastState['tone']) {
        if (toastTimer.current) {
            clearTimeout(toastTimer.current);
        }

        setToast({ message, tone });
        toastTimer.current = setTimeout(() => setToast(null), 2400);
    }

    async function handleShare() {
        const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

        try {
            if (typeof navigator !== 'undefined' && navigator.share) {
                await navigator.share({
                    title: article.title,
                    text: article.meta_description,
                    url: shareUrl,
                });
                showToast('Article shared successfully.', 'success');
                return;
            }

            if (typeof navigator !== 'undefined' && navigator.clipboard && shareUrl) {
                await navigator.clipboard.writeText(shareUrl);
                showToast('Link Copied to Clipboard', 'success');
                return;
            }

            showToast('Sharing is not supported on this browser.', 'error');
        } catch {
            showToast('Unable to share right now.', 'error');
        }
    }

    return (
        <section className="w-full">
            <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="glass-panel rounded-3xl p-6 sm:p-10">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
                    <Link
                        href="/"
                        className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:-translate-x-1 hover:scale-[1.02] hover:border-orange-200/35 hover:bg-orange-300/10">
                        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
                        Back to Home
                    </Link>

                    <button
                        type="button"
                        onClick={handleShare}
                        className="inline-flex items-center gap-2 rounded-full border border-orange-300/20 bg-orange-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-100 transition hover:bg-orange-400/20">
                        <Share2 className="h-3.5 w-3.5" />
                        Share
                    </button>
                </div>

                <motion.article
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08, duration: 0.4 }}>
                    <p className="text-xs uppercase tracking-[0.3em] text-orange-300/90">
                        Climate Briefing
                    </p>
                    <h1 className="heading-font mt-3 text-4xl font-semibold leading-tight text-white sm:text-5xl">
                        {article.title}
                    </h1>
                    <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
                        {article.meta_description}
                    </p>

                    <div className="mt-10 rounded-2xl border border-white/10 bg-black/20 p-5">
                        <ReactMarkdown
                            components={{
                                h2: ({ children }) => (
                                    <h2 className="heading-font mt-8 text-2xl font-semibold text-white first:mt-0">
                                        {children}
                                    </h2>
                                ),
                                p: ({ children }) => (
                                    <p className="mt-4 text-base leading-8 text-slate-300">
                                        {children}
                                    </p>
                                ),
                                ul: ({ children }) => (
                                    <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-200">
                                        {children}
                                    </ul>
                                ),
                                li: ({ children }) => <li className="leading-7">{children}</li>,
                                strong: ({ children }) => (
                                    <strong className="font-semibold text-white">{children}</strong>
                                ),
                            }}>
                            {article.full_article_markdown}
                        </ReactMarkdown>
                    </div>
                </motion.article>
            </motion.div>

            <AnimatePresence>
                {toast ? (
                    <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.2 }}
                        className={`fixed bottom-6 right-6 z-50 rounded-2xl border px-4 py-3 text-sm font-medium shadow-xl backdrop-blur ${
                            toast.tone === 'success'
                                ? 'border-emerald-300/25 bg-emerald-400/15 text-emerald-100'
                                : 'border-rose-300/25 bg-rose-400/15 text-rose-100'
                        }`}>
                        {toast.message}
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </section>
    );
}
