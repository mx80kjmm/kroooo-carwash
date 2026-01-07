'use client';

import { useEffect, useState } from 'react';

interface WeatherWidgetProps {
  latitude: number;
  longitude: number;
  locationName?: string;
}

export default function WeatherWidget({ latitude, longitude, locationName }: WeatherWidgetProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // OpenWeatherMap widget URL
  const widgetUrl = `https://openweathermap.org/weatherwidget?basemap=map&cities=false&location=${latitude},${longitude}&zoom=10&appid=`;

  return (
    <div className="weather-widget">
      <div className="mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          🌤️ 洗車予報
          {locationName && <span className="text-sm font-normal text-gray-600">（{locationName}周辺）</span>}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          洗車に最適な天気をチェックしましょう
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
        <div className="space-y-3">
          {/* 天気予報サービスへのリンク */}
          <a
            href={`https://weather.yahoo.co.jp/weather/search/?lat=${latitude}&lon=${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">☀️</span>
                <div>
                  <p className="font-bold text-gray-800">Yahoo!天気で確認</p>
                  <p className="text-xs text-gray-600">詳細な天気予報を見る</p>
                </div>
              </div>
              <span className="text-blue-600 text-xl">→</span>
            </div>
          </a>

          <a
            href={`https://tenki.jp/forecast/point-${latitude}-${longitude}.html`}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🌦️</span>
                <div>
                  <p className="font-bold text-gray-800">tenki.jpで確認</p>
                  <p className="text-xs text-gray-600">10日間の天気予報</p>
                </div>
              </div>
              <span className="text-blue-600 text-xl">→</span>
            </div>
          </a>

          <div className="bg-blue-100 rounded-lg p-3 text-sm">
            <p className="text-blue-800">
              💡 <strong>洗車のベストタイミング：</strong>
              晴れの日の午前中がおすすめです。雨予報の前日は避けましょう。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
