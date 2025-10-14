'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, MapPin, Loader as Loader2 } from 'lucide-react';
import { useCitySearch } from '@/hooks/use-weather';
import { motion, AnimatePresence } from 'framer-motion';
import { GeolocationService } from '@/lib/geolocation';
import { demoCities } from '@/lib/demo-data';

interface CitySearchProps {
  onCitySelect: (city: string) => void;
  onLocationSelect: (lat: number, lon: number) => void;
  loading?: boolean;
}

export function CitySearch({ onCitySelect, onLocationSelect, loading }: CitySearchProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: cities, isLoading } = useCitySearch(query);
  
  // Use demo cities if no API data available
  const displayCities = cities && cities.length > 0 ? cities : 
    query.length > 2 ? demoCities.filter(city => 
      city.name.toLowerCase().includes(query.toLowerCase())
    ) : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setGeoError(null); // Clear any geolocation errors
      onCitySelect(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleCityClick = (cityName: string, country: string) => {
    const fullName = `${cityName}, ${country}`;
    setQuery(fullName);
    setGeoError(null); // Clear any geolocation errors
    onCitySelect(fullName);
    setShowSuggestions(false);
  };

  const handleGeolocation = async () => {
    setGeoLoading(true);
    setGeoError(null); // Clear previous errors
    try {
      if (!navigator.geolocation) {
        throw new Error('Trình duyệt không hỗ trợ định vị GPS');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 15000, // Tăng timeout lên 15 giây
            maximumAge: 300000 // 5 phút
          }
        );
      });

      const { latitude, longitude } = position.coords;
      console.log('Vị trí GPS:', latitude, longitude);
      onLocationSelect(latitude, longitude);
      setQuery(`Vị trí hiện tại (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
    } catch (error) {
      let errorMessage = 'Không thể lấy vị trí hiện tại';
      
      if (error instanceof Error && 'code' in error) {
        const geoError = error as GeolocationPositionError;
        switch (error.code) {
          case geoError.PERMISSION_DENIED:
            errorMessage = 'Bạn đã từ chối quyền truy cập vị trí. Vui lòng cho phép truy cập vị trí trong cài đặt trình duyệt.';
            console.info('Geolocation permission denied by user');
            break;
          case geoError.POSITION_UNAVAILABLE:
            errorMessage = 'Không thể xác định vị trí hiện tại. Vui lòng thử lại sau.';
            console.warn('Geolocation position unavailable:', error);
            break;
          case geoError.TIMEOUT:
            errorMessage = 'Hết thời gian chờ khi lấy vị trí. Vui lòng thử lại.';
            console.warn('Geolocation timeout:', error);
            break;
          default:
            errorMessage = 'Lỗi không xác định khi lấy vị trí GPS.';
            console.error('Geolocation error:', error);
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
        console.error('Geolocation error:', error);
      }
      
      setGeoError(errorMessage);
    } finally {
      setGeoLoading(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSearch} className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Tìm kiếm thành phố..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="pl-10 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 bg-white/90 backdrop-blur-sm"
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
            )}
          </div>
          <Button 
            type="submit" 
            disabled={loading || !query.trim()}
            size="lg"
            className="px-6 rounded-xl bg-blue-500 hover:bg-blue-600 text-white"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleGeolocation}
            disabled={geoLoading}
            className="px-4 rounded-xl border-2"
          >
            {geoLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
          </Button>
        </form>
      </motion.div>

      <AnimatePresence>
        {geoError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mt-3"
          >
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertDescription className="text-red-800">
                {geoError}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuggestions && displayCities && displayCities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-full z-50"
          >
            <Card className="border-2 border-gray-200 shadow-2xl bg-white/95 backdrop-blur-sm">
              <CardContent className="p-0">
                {displayCities.map((city, index) => (
                  <motion.div
                    key={`${city.name}-${city.country}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                    onClick={() => handleCityClick(city.name, city.country)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{city.name}</p>
                          <p className="text-sm text-gray-500">{city.country}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {city.lat.toFixed(2)}, {city.lon.toFixed(2)}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}