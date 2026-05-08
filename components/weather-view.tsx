"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function WeatherView() {
    const searchParams = useSearchParams();
    const location = searchParams.get('location') || 'Indore'; // Default location
    const [weatherData, setWeatherData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWeather() {
            setLoading(true);
            try {
                // 1. Geocoding: City name se Lat/Long nikalna
                const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1&language=en&format=json`);
                const geoData = await geoRes.json();
                
                if (geoData.results && geoData.results[0]) {
                    const { latitude, longitude, name } = geoData.results[0];

                    // 2. Weather: Real-time data fetch karna
                    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,uv_index&air_quality=us_aqi`);
                    const data = await weatherRes.json();

                    setWeatherData({
                        name: name,
                        temp: Math.round(data.current.temperature_2m),
                        humidity: data.current.relative_humidity_2m,
                        uv: data.current.uv_index || 0,
                        aqi: data.current.us_aqi || 50
                    });
                }
            } catch (error) {
                console.error("Weather fetch error:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchWeather();
    }, [location]);

    if (loading) return <div className="p-20 text-center">Fetching live climate data...</div>;

    return (
        <div className="mx-auto max-w-6xl px-6 py-12">
            {/* Yahan aapka UI code aayega jo weatherData.temp wagera use karega */}
            <div className="glass-panel p-8 rounded-3xl">
                <h1 className="text-4xl font-bold lowercase">{weatherData?.name || location}</h1>
                <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="p-6 bg-white/5 rounded-2xl">
                        <p className="text-xs uppercase opacity-50">Temperature</p>
                        <p className="text-3xl font-bold">{weatherData?.temp}° C</p>
                    </div>
                    <div className="p-6 bg-white/5 rounded-2xl">
                        <p className="text-xs uppercase opacity-50">Humidity</p>
                        <p className="text-3xl font-bold">{weatherData?.humidity}%</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
