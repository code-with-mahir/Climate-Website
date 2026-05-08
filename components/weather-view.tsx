'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Cloud, CloudRain, Search, Sun } from 'lucide-react';

const placeholderData = {
    temp: 29,
    humidity: 64,
    uv: 7,
    aqi: 54,
    historicalAvg: 26,
};

export default function WeatherView() {
    const searchParams = useSearchParams();
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('New Delhi');

    useEffect(() => {
        const param = searchParams.get('location');
        if (param) {
            setLocation(param);
        }
    }, [searchParams]);

    const climateContext = useMemo(() => {
        const diff = placeholderData.temp - placeholderData.historicalAvg;
        const direction = diff >= 0 ? 'above' : 'below';
        return `Current temperature is ${Math.abs(diff)} C ${direction} the historical average.`;
    }, []);

    const WeatherIcon = useMemo(() => {
        if (placeholderData.temp >= 30) {
            return Sun;
        }
        if (placeholderData.humidity >= 70) {
            return CloudRain;
        }
        return Cloud;
    }, []);

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (!query.trim()) {
            return;
        }
        setLocation(query.trim());
        setQuery('');
    }

    return (
        <main className="mx-auto max-w-6xl px-6 py-12 sm:px-10 lg:px-12">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-panel rounded-3xl p-8 sm:p-12">
                <div className="flex flex-wrap items-center justify-between gap-6">
                    <div>
                        <p className="text-sm uppercase tracking-[0.28em] text-orange-300/80">
                            Localized Climate and Weather
                        </p>
                        <h1 className="heading-font mt-3 text-4xl font-semibold text-white sm:text-5xl">
                            Search any city for live conditions
                        </h1>
                        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                            Monitor heat, humidity, UV, and air quality in real time, with climate
                            context overlaid.
                        </p>
                    </div>
                    <form
                        onSubmit={handleSubmit}
                        className="flex w-full max-w-md items-center gap-3">
                        <div className="flex w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                            <Search className="h-4 w-4 text-slate-400" />
                            <input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search city or region"
                                className="w-full bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/20">
                            Go
                        </button>
                    </form>
                </div>

                <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                                    Current conditions
                                </p>
                                <h2 className="heading-font mt-2 text-3xl font-semibold text-white">
                                    {location}
                                </h2>
                            </div>
                            <WeatherIcon className="h-8 w-8 text-orange-300" />
                        </div>
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                    Temperature
                                </p>
                                <p className="mt-2 text-3xl font-semibold text-white">
                                    {placeholderData.temp} C
                                </p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                    Humidity
                                </p>
                                <p className="mt-2 text-3xl font-semibold text-white">
                                    {placeholderData.humidity}%
                                </p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                    UV Index
                                </p>
                                <p className="mt-2 text-3xl font-semibold text-white">
                                    {placeholderData.uv}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                    AQI
                                </p>
                                <p className="mt-2 text-3xl font-semibold text-white">
                                    {placeholderData.aqi}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                        <p className="text-sm uppercase tracking-[0.28em] text-slate-400">
                            Climate Context
                        </p>
                        <h3 className="heading-font mt-3 text-2xl font-semibold text-white">
                            Temperature anomaly check
                        </h3>
                        <p className="mt-4 text-base leading-7 text-slate-300">{climateContext}</p>
                        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                Historical average
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-white">
                                {placeholderData.historicalAvg} C
                            </p>
                        </div>
                        <p className="mt-4 text-sm text-slate-400">
                            Placeholder context will be replaced with validated historical climate
                            baselines.
                        </p>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
