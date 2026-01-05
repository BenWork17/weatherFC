'use client';

import { Cloud, CloudRain, CloudSnow, Sun, CloudDrizzle, CloudLightning, Wind, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface WeatherIconProps {
  icon: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

export function WeatherIcon({ icon, size = 'md', animated = true }: WeatherIconProps) {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const getIcon = () => {
    switch (icon) {
      case '01d':
      case '01n':
        return <Sun className={`${sizeMap[size]} text-yellow-500`} />;
      case '02d':
      case '02n':
      case '03d':
      case '03n':
      case '04d':
      case '04n':
        return <Cloud className={`${sizeMap[size]} text-gray-400`} />;
      case '09d':
      case '09n':
        return <CloudDrizzle className={`${sizeMap[size]} text-blue-400`} />;
      case '10d':
      case '10n':
        return <CloudRain className={`${sizeMap[size]} text-blue-500`} />;
      case '11d':
      case '11n':
        return <CloudLightning className={`${sizeMap[size]} text-purple-500`} />;
      case '13d':
      case '13n':
        return <CloudSnow className={`${sizeMap[size]} text-blue-200`} />;
      case '50d':
      case '50n':
        return <Wind className={`${sizeMap[size]} text-gray-300`} />;
      default:
        return <Sun className={`${sizeMap[size]} text-yellow-500`} />;
    }
  };

  if (!animated) {
    return <div>{getIcon()}</div>;
  }

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        duration: 0.6
      }}
      whileHover={{ scale: 1.1 }}
    >
      {getIcon()}
    </motion.div>
  );
}