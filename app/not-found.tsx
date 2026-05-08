'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <main className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-10 sm:px-10 lg:px-12">
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="glass-panel w-full rounded-3xl p-8 sm:p-12">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-200">
                    <Search className="h-3.5 w-3.5" />
                    Page Not Found
                </div>

                <h1 className="heading-font mt-6 text-4xl font-semibold text-white sm:text-5xl">
                    The climate brief you requested is missing.
                </h1>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                    The link may be outdated, or the article slug no longer exists. Return to the
                    homepage to view the latest generated climate reports.
                </p>

                <div className="mt-10 flex flex-wrap gap-3">
                    <Link
                        href="/"
                        className="group inline-flex items-center gap-2 rounded-full border border-orange-300/30 bg-orange-400/10 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-orange-100 transition duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-orange-400/20">
                        <Home className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110" />
                        Back to Home
                    </Link>

                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:-translate-x-0.5 hover:bg-white/10">
                        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
                        Go Back
                    </button>
                </div>
            </motion.section>
        </main>
    );
}
