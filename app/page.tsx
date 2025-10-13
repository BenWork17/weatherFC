'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { CitySearch } from '@/components/search/city-search';
import { CurrentWeatherCard } from '@/components/weather/current-weather';
import { HourlyChart } from '@/components/weather/hourly-chart';
import { DailyForecastCard } from '@/components/weather/daily-forecast';
import { WeatherMap } from '@/components/weather/weather-map';
import { AirQualityCard } from '@/components/weather/air-quality';
import { LoadingSkeleton } from '@/components/layout/loading-skeleton';
import { useWeatherByCity, useWeatherByCoords } from '@/hooks/use-weather';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CircleAlert as AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { demoCurrentWeather, demoHourlyForecast, demoDailyForecast } from '@/lib/demo-data';

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [coordinates, setCoordinates] = useState<{lat: number, lon: number} | null>(null);

  const cityWeather = useWeatherByCity(selectedCity);
  const coordsWeather = useWeatherByCoords(
    coordinates?.lat || null, 
    coordinates?.lon || null
  );

  const weather = selectedCity ? cityWeather : coordsWeather;

  // Use demo data if no real data available
  const displayWeather = weather.data || (selectedCity || coordinates ? {
    current: demoCurrentWeather,
    hourly: demoHourlyForecast,
    daily: demoDailyForecast
  } : null);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setCoordinates(null);
  };

  const handleLocationSelect = (lat: number, lon: number) => {
    setCoordinates({ lat, lon });
    setSelectedCity('');
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CitySearch
            onCitySelect={handleCitySelect}
            onLocationSelect={handleLocationSelect}
            loading={weather.isLoading}
          />
        </motion.div>

        {/* Welcome Message */}
        {!selectedCity && !coordinates && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center py-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Chào mừng đến với WeatherApp
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Tìm kiếm thành phố hoặc sử dụng vị trí hiện tại để xem dự báo thời tiết
            </p>
          </motion.div>
        )}

        {/* Loading State */}
        {weather.isLoading && <LoadingSkeleton />}

        {/* Error State */}
        {weather.error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Alert className="mb-6 border-red-200 bg-red-50 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Không thể tải dữ liệu thời tiết. Vui lòng thử lại sau hoặc kiểm tra kết nối internet.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Weather Data */}
        {displayWeather && (
          <div className="space-y-6">
            <CurrentWeatherCard weather={displayWeather.current} />
            <HourlyChart hourlyData={displayWeather.hourly} />
            <DailyForecastCard dailyData={displayWeather.daily} />
            <AirQualityCard />
            <WeatherMap 
              lat={displayWeather.current.coords.lat} 
              lon={displayWeather.current.coords.lon}
              cityName={displayWeather.current.name}
              temp={displayWeather.current.temp}
            />
          </div>
        )}
      </main>
    </div>
  );
}