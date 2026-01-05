'use client';

import { CurrentWeather } from '@/lib/weather-api';
import { WeatherIcon } from './weather-icon';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Droplets, Wind, Eye, Sunrise, Sunset } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface CurrentWeatherProps {
  weather: CurrentWeather;
}

export function CurrentWeatherCard({ weather }: CurrentWeatherProps) {
  const formatTime = (timestamp: number) => {
    return format(new Date(timestamp * 1000), 'HH:mm', { locale: vi });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-0 shadow-2xl">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {weather.name}, {weather.country}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 capitalize">
                {weather.weather_description}
              </p>
            </div>
            <WeatherIcon icon={weather.icon} size="xl" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="text-center md:text-left">
              <motion.div
                className="text-6xl font-bold text-gray-900 dark:text-white mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              >
                {weather.temp}°C
              </motion.div>
              <p className="text-gray-600 dark:text-gray-300">
                Cảm giác như {weather.feels_like}°C
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Droplets className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Độ ẩm</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{weather.humidity}%</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Wind className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Gió</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{weather.wind_speed} m/s</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Tầm nhìn</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{(weather.visibility / 1000).toFixed(1)} km</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Thermometer className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Áp suất</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{weather.pressure} hPa</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Sunrise className="w-5 h-5 text-orange-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Bình minh: {formatTime(weather.sunrise)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Sunset className="w-5 h-5 text-orange-600" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Hoàng hôn: {formatTime(weather.sunset)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}