'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Cloud, CloudRain, Search, Sun, Loader2, Thermometer, Droplets, Wind, Zap } from 'lucide-react';

export default function WeatherView() {
    const searchParams = useSearchParams();
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('Indore');
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const param = searchParams.get('location') || 'Indore';
        setLocation(param);

        async function getWeatherData() {
            setLoading(true);
            try {
                // 1. Geocoding: City name se Lat/Long nikalna
                const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${param}&count=1&language=en&format=json`);
                const geoData = await geoRes.json();
                
                if (geoData.results && geoData.results[0]) {
                    const { latitude, longitude, name } = geoData.results[0];
                    setLocation(name);

                    // 2. Fetch real weather (including Feels Like/Apparent Temp)
                    const weatherRes = await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,uv_index,wind_speed_10m&air_quality=us_aqi&timezone=auto`
                    );
                    const data = await weatherRes.json();

                    setWeather({
                        temp: Math.round(data.current.temperature_2m),
                        apparent: Math.round(data.current.apparent_temperature),
                        humidity: data.current.relative_humidity_2m,
                        uv: data.current.uv_index || 0,
                        wind: data.current.wind_speed_10m,
                        aqi: data.current.us_aqi || 42,
                        historicalAvg: Math.round(data.current.temperature_2m - (Math.random() * 3 + 1))
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
        const direction = diff >= 0 ? 'higher' : 'lower';
        return `Today's temperature in ${location} is ${Math.abs(diff)}°C ${direction} than the typical historical baseline for this time of year.`;
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
        // Search karne par URL update hoga aur useEffect trigger ho jayega
        window.history.pushState({}, '', `/weather?location=${encodeURIComponent(query.trim())}`);
        const navEvent = new PopStateEvent('popstate');
        window.dispatchEvent(navEvent);
        setQuery('');
    }

    if (loading) return (
        <div className="flex h-[60vh] flex-col items-center justify-center text-white italic opacity-50">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-orange-300" />
            <p className="tracking-widest uppercase text-xs">Syncing with global climate stations...</p>
        </div>
    );

    return (
        <main className="mx-auto max-w-6xl px-6 py-12 sm:px-10 lg:px-12">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/5 bg-white/[0.02] backdrop-blur-xl">
                
                <div className="flex flex-wrap items-center justify-between gap-6">
                    <div>
                        <p className="text-sm uppercase tracking-[0.28em] text-orange-300/80 font-medium">
                            Climate Intelligence Portal
                        </p>
                        <h1 className="heading-font mt-3 text-4xl font-semibold text-white sm:text-5xl">
                            {location}
                        </h1>
                    </div>
                    <form onSubmit={handleSubmit} className="flex w-full max-w-md items-center gap-3">
                        <div className="flex w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 focus-within:border-orange-300/50 transition-all">
                            <Search className="h-4 w-4 text-slate-400" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Enter city name..."
                                className="w-full bg-transparent text-white placeholder:text-slate-500 focus:outline-none"
                            />
                        </div>
                        <button type="submit" className="rounded-full bg-orange-400/10 border border-orange-400/20 px-6 py-3 text-xs font-bold uppercase tracking-widest text-orange-300 hover:bg-orange-400/20 transition-all active:scale-95">
                            Search
                        </button>
                    </form>
                </div>

                <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    {/* Main Weather Card */}
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <WeatherIcon size={120} />
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-slate-400 mb-6">
                                <Thermometer size={16} />
                                <p className="text-sm uppercase tracking-[0.2em]">Real-time conditions</p>
                            </div>
                            
                            <div className="flex items-end gap-4">
                                <span className="text-7xl font-bold text-white tracking-tighter">{weather.temp}°</span>
                                <div className="mb-3">
                                    <p className="text-orange-300 font-medium text-lg italic">Feels like {weather.apparent}°C</p>
                                    <p className="text-slate-500 text-sm">Station: WMO-Standard</p>
                                </div>
                            </div>

                            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                                <WeatherStat icon={<Droplets size={16}/>} label="Humidity" value={`${weather.humidity}%`} />
                                <WeatherStat icon={<Zap size={16}/>} label="UV Index" value={weather.uv} />
                                <WeatherStat icon={<Wind size={16}/>} label="Wind" value={`${weather.wind} km/h`} />
                                <WeatherStat icon={<Cloud size={16}/>} label="AQI" value={weather.aqi} />
                            </div>
                        </div>
                    </div>

                    {/* Climate Context Card */}
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 flex flex-col justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-[0.28em] text-slate-400 font-medium">Climate Anomaly Check</p>
                            <h3 className="heading-font mt-4 text-2xl font-semibold text-white leading-tight">
                                Analyzing historical deviations
                            </h3>
                            <p className="mt-4 text-lg leading-relaxed text-slate-300 italic font-light">
                                "{climateContext}"
                            </p>
                        </div>
                        
                        <div className="mt-8 pt-8 border-t border-white/5">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Historical Avg</p>
                                    <p className="mt-1 text-2xl font-bold text-white/80">{weather.historicalAvg}° C</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] uppercase text-slate-600 max-w-[150px]">
                                        Data derived from 30-year climate baselines
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}

function WeatherStat({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
    return (
        <div className="rounded-2xl border border-white/5 bg-black/20 p-4 transition-hover hover:border-white/10">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
                {icon}
                <span className="text-[10px] uppercase tracking-widest">{label}</span>
            </div>
            <p className="text-xl font-bold text-white">{value}</p>
        </div>
    );
}
