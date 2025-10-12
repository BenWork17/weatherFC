'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WeatherIcon } from '@/components/weather/weather-icon';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, Plus, MapPin, Thermometer } from 'lucide-react';

interface FavoriteCity {
  id: string;
  name: string;
  country: string;
  temp: number;
  weather: string;
  icon: string;
  lastUpdated: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteCity[]>([
    {
      id: '1',
      name: 'Hà Nội',
      country: 'VN',
      temp: 28,
      weather: 'Có mây',
      icon: '02d',
      lastUpdated: '10 phút trước'
    },
    {
      id: '2',
      name: 'Hồ Chí Minh',
      country: 'VN',
      temp: 32,
      weather: 'Nắng',
      icon: '01d',
      lastUpdated: '15 phút trước'
    },
    {
      id: '3',
      name: 'Đà Nẵng',
      country: 'VN',
      temp: 30,
      weather: 'Mưa nhẹ',
      icon: '10d',
      lastUpdated: '5 phút trước'
    }
  ]);

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter(city => city.id !== id));
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Thành phố yêu thích
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Theo dõi thời tiết tại các địa điểm bạn quan tâm
          </p>
        </motion.div>

        {/* Add New Favorite Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-8"
        >
          <Button size="lg" className="px-8">
            <Plus className="w-5 h-5 mr-2" />
            Thêm thành phố
          </Button>
        </motion.div>

        {/* Favorites Grid */}
        <AnimatePresence>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((city, index) => (
                <motion.div
                  key={city.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  layout
                >
                  <Card className="backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <CardTitle className="text-lg">
                            {city.name}, {city.country}
                          </CardTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFavorite(city.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <WeatherIcon icon={city.icon} size="lg" animated={false} />
                          <div>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">
                              {city.temp}°C
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                              {city.weather}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          Cập nhật {city.lastUpdated}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Xem chi tiết
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center py-16"
            >
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Chưa có thành phố yêu thích
              </h2>
              <p className="text-gray-500 dark:text-gray-500 mb-6">
                Thêm các thành phố bạn quan tâm để theo dõi thời tiết dễ dàng hơn
              </p>
              <Button size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Thêm thành phố đầu tiên
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Stats */}
        {favorites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12"
          >
            <Card className="backdrop-blur-md bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {favorites.length}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">Thành phố theo dõi</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {Math.round(favorites.reduce((sum, city) => sum + city.temp, 0) / favorites.length)}°C
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">Nhiệt độ trung bình</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {Math.max(...favorites.map(city => city.temp))}°C
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">Nhiệt độ cao nhất</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
    </div>
  );
}