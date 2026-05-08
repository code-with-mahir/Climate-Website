import { Suspense } from 'react';
import WeatherView from '../../components/weather-view';

export default function WeatherPage() {
    return (
        <Suspense
            fallback={
                <div className="mx-auto max-w-6xl px-6 py-12 sm:px-10 lg:px-12">
                    <div className="glass-panel rounded-3xl p-8 sm:p-12">
                        <div className="h-6 w-40 rounded-full bg-white/10" />
                        <div className="mt-6 h-10 w-72 rounded-3xl bg-white/10" />
                        <div className="mt-8 h-5 w-full max-w-xl rounded-3xl bg-white/10" />
                    </div>
                </div>
            }>
            <WeatherView />
        </Suspense>
    );
}
