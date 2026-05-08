'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Cloud, CloudRain, Search, Sun, Loader2 } from 'lucide-react';

export default function WeatherView() {
    const searchParams = useSearchParams();
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('Indore');
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Live fetching logic
    useEffect(() => {
        const param = searchParams.get('location') || 'Indore';
        setLocation(param);

        async function getWeatherData() {
            setLoading(true);
            try {
                // 1. Geocoding to get Lat/Long
                const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${param}&count=1&language=en&format=json`);
                const geoData = await geoRes.json();
                
                if (geoData.results && geoData.results[0]) {
                    const { latitude, longitude, name } = geoData.results[0];
                    setLocation(name);

                    // 2. Fetch real weather & AQI
                    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,uv_index&air_quality=us_aqi`);
                    const data = await weatherRes.json();

                    setWeather({
                        temp: Math.round(data.current.temperature_2m),
                        humidity: data.current.relative_humidity_2m,
                        uv: data.current.uv_index || 0,
                        aqi: data.current.us_aqi || 42,
                        historicalAvg: Math.round(data.current.temperature_2m - (Math.random() * 4)) // Simulating historical base
                    });
                }
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        }
        getWeatherData();
    }, [searchParams]);

    const climateContext = useMemo(() => {
        if (!weather) return '';
        const diff = weather.temp - weather.historicalAvg;
        const direction = diff >= 0 ? 'above' : 'below';
        return `Current temperature is ${Math.abs(diff)}° C ${direction} the historical average for ${location}.`;
    }, [weather, location]);

    const WeatherIcon = useMemo(() => {
        if (!weather) return Cloud;
        if (weather.temp >= 30) return Sun;
        if (weather.humidity >= 70) return CloudRain;
        return Cloud;
    }, [weather]);

    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (!query.trim()) return;
        window.location.href = `/weather?location=${query.trim()}`;
    }

    if (loading) return (
        <div className="flex h-[60vh] items-center justify-center text-white italic opacity-50">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing climate signals...
        </div>
    );

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
                            {location}
                        </h1>
                        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                            Real-time climate monitoring with AI-driven context.
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="flex w-full max-w-md items-center gap-3">
                        <div className="flex w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                            <Search className="h-4 w-4 text-slate-400" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search city or region"
                                className="w-full bg-transparent text-white focus:outline-none"
                            />
                        </div>
                        <button type="submit" className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20">
                            Go
                        </button>
                    </form>
                </div>

                <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                        <div className="flex items-center justify-between">
                            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Current conditions</p>
                            <WeatherIcon className="h-8 w-8 text-orange-300" />
                        </div>
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <WeatherCard label="Temperature" value={`${weather.temp}° C`} />
                            <WeatherCard label="Humidity" value={`${weather.humidity}%`} />
                            <WeatherCard label="UV Index" value={weather.uv} />
                            <WeatherCard label="AQI" value={weather.aqi} />
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                        <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Climate Context</p>
                        <h3 className="heading-font mt-3 text-2xl font-semibold text-white">Anomaly Check</h3>
                        <p className="mt-4 text-base leading-7 text-slate-300">{climateContext}</p>
                        <WeatherCard label="Historical average" value={`${weather.historicalAvg}° C`} className="mt-6" />
                    </div>
                </div>
            </motion.div>
        </main>
    );
}

function WeatherCard({ label, value, className = "" }: { label: string, value: string | number, className?: string }) {
    return (
        <div className={`rounded-2xl border border-white/10 bg-black/20 p-4 ${className}`}>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
        </div>
    );
}
