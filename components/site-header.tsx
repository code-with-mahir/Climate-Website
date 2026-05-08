'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/weather', label: 'Weather' },
    { href: '/news', label: 'News' },
    { href: '/action', label: 'Action Center' },
    { href: '/archive', label: 'Archive' },
    { href: '/about', label: 'Methodology' },
];

const searchSuggestions = [
    { label: 'New Delhi', type: 'location' },
    { label: 'Lagos', type: 'location' },
    { label: 'New York', type: 'location' },
    { label: 'London', type: 'location' },
    { label: 'Tokyo', type: 'location' },
    { label: 'Sydney', type: 'location' },
    { label: 'Sao Paulo', type: 'location' },
    { label: 'Nairobi', type: 'location' },
    { label: 'IPCC policy update', type: 'topic' },
    { label: 'NASA heat anomaly', type: 'topic' },
    { label: 'Sea level rise', type: 'topic' },
    { label: 'Arctic ice melt', type: 'topic' },
    { label: 'Air quality index', type: 'topic' },
];

export default function SiteHeader() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    const locationKeywords = useMemo(
        () => ['weather', 'temperature', 'temp', 'humidity', 'aqi', 'uv', 'climate'],
        [],
    );

    const filteredSuggestions = useMemo(() => {
        const normalized = searchQuery.trim().toLowerCase();
        if (!normalized) {
            return [];
        }
        return searchSuggestions
            .filter((item) => item.label.toLowerCase().includes(normalized))
            .slice(0, 6);
    }, [searchQuery]);

    function isLocationQuery(query: string) {
        const normalized = query.toLowerCase();
        if (locationKeywords.some((keyword) => normalized.includes(keyword))) {
            return true;
        }
        if (normalized.includes(',') || normalized.includes(' in ')) {
            return true;
        }
        const newsKeywords = ['report', 'article', 'policy', 'ipcc', 'nasa', 'brief'];
        if (newsKeywords.some((keyword) => normalized.includes(keyword))) {
            return false;
        }
        return normalized.split(' ').length <= 3;
    }

    function handleSearchSubmit(event: React.FormEvent) {
        event.preventDefault();
        const trimmed = searchQuery.trim();
        if (!trimmed) {
            return;
        }

        if (isLocationQuery(trimmed)) {
            router.push(`/weather?location=${encodeURIComponent(trimmed)}`);
        } else {
            router.push(`/news?q=${encodeURIComponent(trimmed)}`);
        }
    }

    function handleSuggestionPick(value: string) {
        setSearchQuery(value);
        if (isLocationQuery(value)) {
            router.push(`/weather?location=${encodeURIComponent(value)}`);
        } else {
            router.push(`/news?q=${encodeURIComponent(value)}`);
        }
    }

    return (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-ink-950/80 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 sm:px-10 lg:px-12">
                <Link href="/" className="heading-font text-lg font-semibold text-white">
                    EcoPulse
                </Link>
                <nav className="hidden items-center gap-6 text-sm font-semibold uppercase tracking-[0.2em] text-slate-200 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="transition hover:text-white">
                            {link.label}
                        </Link>
                    ))}
                </nav>
                <form
                    onSubmit={handleSearchSubmit}
                    className="hidden flex-1 justify-center px-4 md:flex">
                    <div className="relative w-full max-w-md">
                        <div className="flex w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-300">
                            <Search className="h-4 w-4 text-slate-400" />
                            <input
                                name="q"
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                placeholder="Search reports, locations"
                                className="w-full bg-transparent text-[11px] text-white placeholder:text-slate-500 focus:outline-none"
                            />
                        </div>
                        {filteredSuggestions.length ? (
                            <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-ink-950/95 text-xs text-slate-200 shadow-xl">
                                {filteredSuggestions.map((item) => (
                                    <button
                                        key={item.label}
                                        type="button"
                                        onMouseDown={() => handleSuggestionPick(item.label)}
                                        className="flex w-full items-center justify-between px-4 py-2 text-left transition hover:bg-white/10">
                                        <span>{item.label}</span>
                                        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                                            {item.type}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </form>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:border-orange-200/35 hover:bg-orange-300/10">
                    Back to Portal
                </Link>
            </div>
            <div className="mx-auto flex max-w-7xl flex-wrap gap-3 px-6 pb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 md:hidden">
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="rounded-full border border-white/10 px-3 py-1">
                        {link.label}
                    </Link>
                ))}
            </div>
            <form
                onSubmit={handleSearchSubmit}
                className="mx-auto flex max-w-7xl px-6 pb-4 md:hidden">
                <div className="relative w-full">
                    <div className="flex w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-slate-300">
                        <Search className="h-4 w-4 text-slate-400" />
                        <input
                            name="q"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Search reports, locations"
                            className="w-full bg-transparent text-[11px] text-white placeholder:text-slate-500 focus:outline-none"
                        />
                    </div>
                    {filteredSuggestions.length ? (
                        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-ink-950/95 text-xs text-slate-200 shadow-xl">
                            {filteredSuggestions.map((item) => (
                                <button
                                    key={`${item.label}-mobile`}
                                    type="button"
                                    onMouseDown={() => handleSuggestionPick(item.label)}
                                    className="flex w-full items-center justify-between px-4 py-2 text-left transition hover:bg-white/10">
                                    <span>{item.label}</span>
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                                        {item.type}
                                    </span>
                                </button>
                            ))}
                        </div>
                    ) : null}
                </div>
            </form>
        </header>
    );
}
