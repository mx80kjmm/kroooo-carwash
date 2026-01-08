'use client';

import { useEffect, useState } from 'react';

type WeatherData = {
    daily: {
        time: string[];
        weathercode: number[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
    };
};

const getWeatherIcon = (code: number) => {
    // WMO Weather interpretation codes (WW)
    // 0: Clear sky
    if (code === 0) return '☀️';
    // 1, 2, 3: Mainly clear, partly cloudy, and overcast
    if ([1, 2, 3].includes(code)) return '☁️';
    // 45, 48: Fog
    if ([45, 48].includes(code)) return '🌫️';
    // 51, 53, 55, 56, 57: Drizzle
    if ([51, 53, 55, 56, 57].includes(code)) return '🌦️';
    // 61, 63, 65, 66, 67: Rain
    if ([61, 63, 65, 66, 67].includes(code)) return '☔';
    // 71, 73, 75, 77: Snow
    if ([71, 73, 75, 77].includes(code)) return '⛄';
    // 80, 81, 82: Rain showers
    if ([80, 81, 82].includes(code)) return '☔';
    // 85, 86: Snow showers
    if ([85, 86].includes(code)) return '🌨️';
    // 95, 96, 99: Thunderstorm
    if ([95, 96, 99].includes(code)) return '⚡';

    return '❓';
};

const getWeatherDescription = (code: number) => {
    if (code === 0) return '快晴';
    if ([1, 2, 3].includes(code)) return '曇り';
    if ([45, 48].includes(code)) return '霧';
    if ([51, 53, 55, 56, 57].includes(code)) return '霧雨';
    if ([61, 63, 65, 66, 67].includes(code)) return '雨';
    if ([71, 73, 75, 77].includes(code)) return '雪';
    if ([80, 81, 82].includes(code)) return 'にわか雨';
    if ([85, 86].includes(code)) return '雪嵐';
    if ([95, 96, 99].includes(code)) return '雷雨';
    return '不明';
};

// 洗車指数 (簡易版: 雨なら低い、晴れなら高い)
const getCarWashIndex = (code: number) => {
    if (code === 0) return { label: '最高', color: 'text-red-500', icon: '✨' };
    if ([1, 2].includes(code)) return { label: '良い', color: 'text-orange-500', icon: '◎' };
    if (code === 3) return { label: '普通', color: 'text-gray-500', icon: '〇' };
    if ([45, 48].includes(code)) return { label: '微妙', color: 'text-blue-400', icon: '△' };
    return { label: '延期推奨', color: 'text-blue-600', icon: '☔' };
};

export default function WeatherForecast({ lat, lng }: { lat: number; lng: number }) {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Asia%2FTokyo`
                );
                const data = await response.json();
                setWeather(data);
            } catch (error) {
                console.error('Failed to fetch weather:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [lat, lng]);

    if (loading) return <div className="animate-pulse bg-gray-200 h-32 rounded-xl"></div>;
    if (!weather) return null;

    return (
        <div className="bg-white/90 backdrop-blur rounded-xl p-4 shadow-sm border border-cyan-100">
            <h3 className="text-lg font-bold text-cyan-900 mb-3 flex items-center gap-2">
                <span>🌤️</span> 洗車予報 (週間天気)
            </h3>
            <div className="flex overflow-x-auto pb-2 gap-4 snap-x">
                {weather.daily.time.map((time, index) => {
                    const code = weather.daily.weathercode[index];
                    const date = new Date(time);
                    const dayStr = date.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric', weekday: 'short' });
                    const indexInfo = getCarWashIndex(code);

                    return (
                        <div key={time} className="flex-shrink-0 flex flex-col items-center min-w-[80px] snap-start bg-white p-2 rounded-lg border border-gray-100">
                            <span className="text-xs text-gray-500 font-medium mb-1">{dayStr}</span>
                            <span className="text-3xl mb-1 drop-shadow-sm">{getWeatherIcon(code)}</span>
                            <div className="flex flex-col items-center mt-1">
                                <span className={`text-xs font-bold ${indexInfo.color} whitespace-nowrap`}>
                                    {indexInfo.icon} {indexInfo.label}
                                </span>
                                <div className="flex gap-1 text-[10px] text-gray-400 mt-1">
                                    <span className="text-red-400">{Math.round(weather.daily.temperature_2m_max[index])}°</span>
                                    <span className="text-blue-400">{Math.round(weather.daily.temperature_2m_min[index])}°</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
