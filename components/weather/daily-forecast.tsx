'use client';

import { DailyForecast } from '@/lib/weather-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WeatherIcon } from './weather-icon';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Droplets, Wind } from 'lucide-react';

interface DailyForecastProps {
  dailyData: DailyForecast[];
}

export function DailyForecastCard({ dailyData }: DailyForecastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Card className="backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Dự báo 7 ngày
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dailyData.map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <WeatherIcon icon={day.icon} size="md" animated={false} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {index === 0 ? 'Hôm nay' : format(new Date(day.date * 1000), 'EEEE', { locale: vi })}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                      {day.weather_description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span>{Math.round(day.pop)}%</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <Wind className="w-4 h-4 text-green-500" />
                    <span>{day.wind_speed.toFixed(1)} m/s</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{day.temp_min}°</span>
                    <div className="w-16 h-2 bg-gradient-to-r from-blue-200 via-yellow-200 to-red-200 rounded-full relative">
                      <div 
                        className="absolute h-2 bg-gradient-to-r from-blue-500 to-red-500 rounded-full"
                        style={{ 
                          width: `${Math.min(100, (day.temp_max - day.temp_min) * 3)}%`,
                          left: `${Math.max(0, (day.temp_min + 10) * 2)}%`
                        }}
                      />
                    </div>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">{day.temp_max}°</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}