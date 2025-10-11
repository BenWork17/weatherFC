'use client';

import { useQuery } from '@tanstack/react-query';
import { weatherAPI, WeatherData } from '@/lib/weather-api';

export function useWeatherByCity(city: string) {
  return useQuery<WeatherData>({
    queryKey: ['weather', 'city', city],
    queryFn: () => weatherAPI.getWeatherByCity(city),
    enabled: !!city,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

export function useWeatherByCoords(lat: number | null, lon: number | null) {
  return useQuery<WeatherData>({
    queryKey: ['weather', 'coords', lat, lon],
    queryFn: () => weatherAPI.getWeatherByCoords(lat!, lon!),
    enabled: lat !== null && lon !== null,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

export function useCitySearch(query: string) {
  return useQuery({
    queryKey: ['cities', query],
    queryFn: () => weatherAPI.searchCities(query),
    enabled: query.length > 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}