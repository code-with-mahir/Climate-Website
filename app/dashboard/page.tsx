'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Cloud, CloudRain, Sun } from 'lucide-react';

const chartBars = [62, 68, 71, 75, 79, 83, 87, 90, 94, 98];
const co2Bars = [58, 60, 64, 67, 70, 74, 79, 83, 87, 92];
const tickerItems = [
    'NASA: Arctic summer sea ice hits lower decade average',
    'IPCC: New synthesis report emphasizes adaptation gaps',
    'NASA: Ocean heat content reaches record seasonal high',
    'IPCC: Coastal resilience funding remains uneven',
    'NASA: Global temperature anomaly remains elevated',
    'IPCC: Mitigation pathways need faster deployment',
];

export default function DashboardPage() {
    const [locationLabel, setLocationLabel] = useState('Detecting location');
    const [localSummary] = useState({ temp: 28, humidity: 62, uv: 6, aqi: 58 });

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationLabel('Location unavailable');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toFixed(2);
                const lon = position.coords.longitude.toFixed(2);
                setLocationLabel(`Lat ${lat}, Lon ${lon}`);
            },
            () => {
                setLocationLabel('Location blocked');
            },
            { timeout: 8000 },
        );
    }, []);

    const WeatherIcon = useMemo(() => {
        if (localSummary.temp >= 30) {
            return Sun;
        }
        if (localSummary.humidity >= 70) {
            return CloudRain;
        }
        return Cloud;
    }, [localSummary]);

    return (
        <main className="mx-auto max-w-7xl px-6 py-10 sm:px-10 lg:px-12">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-panel rounded-3xl p-6 sm:p-10">
                <div className="mb-8">
                    <p className="text-sm uppercase tracking-[0.28em] text-orange-300/80">
                        Intelligence Dashboard
                    </p>
                    <h1 className="heading-font mt-3 text-4xl font-semibold text-white sm:text-5xl">
                        Global climate signals, streamed continuously
                    </h1>
                    <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
                        Track temperature acceleration, atmospheric CO2 pressure, and key impacts
                        across the cryosphere.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                                    Global temperature (10y)
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-white">
                                    +1.47°C trendline
                                </p>
                            </div>
                            <ArrowUpRight className="h-6 w-6 text-orange-300" />
                        </div>
                        <div className="mt-6 flex items-end gap-2">
                            {chartBars.map((height, index) => (
                                <motion.div
                                    key={`temp-${index}`}
                                    initial={{ height: 20 }}
                                    animate={{ height }}
                                    transition={{ duration: 0.6, delay: index * 0.05 }}
                                    className="w-full rounded-full bg-gradient-to-t from-orange-500/20 to-orange-400/70"
                                    style={{ minHeight: 24 }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                                    Atmospheric CO2 (10y)
                                </p>
                                <p className="mt-2 text-2xl font-semibold text-white">426.8 ppm</p>
                            </div>
                            <ArrowUpRight className="h-6 w-6 text-cyan-300" />
                        </div>
                        <div className="mt-6 flex items-end gap-2">
                            {co2Bars.map((height, index) => (
                                <motion.div
                                    key={`co2-${index}`}
                                    initial={{ height: 18 }}
                                    animate={{ height }}
                                    transition={{ duration: 0.6, delay: index * 0.05 }}
                                    className="w-full rounded-full bg-gradient-to-t from-cyan-400/20 to-cyan-300/70"
                                    style={{ minHeight: 24 }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                                Local Weather Snapshot
                            </p>
                            <p className="mt-2 text-xl font-semibold text-white">{locationLabel}</p>
                        </div>
                        <WeatherIcon className="h-7 w-7 text-orange-300" />
                    </div>
                    <div className="mt-5 grid gap-4 sm:grid-cols-4">
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                Temp
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-white">
                                {localSummary.temp}°C
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                Humidity
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-white">
                                {localSummary.humidity}%
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                UV Index
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-white">
                                {localSummary.uv}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">AQI</p>
                            <p className="mt-2 text-2xl font-semibold text-white">
                                {localSummary.aqi}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                                    Arctic Ice Melt
                                </p>
                                <p className="mt-2 text-3xl font-semibold text-white">-12.8%</p>
                            </div>
                            <ArrowDownRight className="h-6 w-6 text-amber-300" />
                        </div>
                        <p className="mt-4 text-sm leading-6 text-slate-300">
                            Summer minimum ice extent continues to shrink versus 2000 baseline.
                        </p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                                    Sea Level Rise
                                </p>
                                <p className="mt-2 text-3xl font-semibold text-white">+3.4 mm/yr</p>
                            </div>
                            <ArrowUpRight className="h-6 w-6 text-emerald-300" />
                        </div>
                        <p className="mt-4 text-sm leading-6 text-slate-300">
                            Coastal defenses face compounding pressure from higher storm surges.
                        </p>
                    </div>
                </div>
            </motion.div>

            <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                <div className="border-b border-white/10 px-6 py-4 text-xs uppercase tracking-[0.3em] text-slate-400">
                    Source Stream
                </div>
                <div className="relative overflow-hidden py-4">
                    <div className="ticker-track flex min-w-full gap-8 px-6 text-sm text-slate-200">
                        {tickerItems.concat(tickerItems).map((item, index) => (
                            <span key={`${item}-${index}`} className="whitespace-nowrap">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
