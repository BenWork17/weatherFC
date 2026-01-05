'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Wind, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react';

interface AirQualityProps {
  aqi?: number;
}

export function AirQualityCard({ aqi = 65 }: AirQualityProps) {
  const getAQIStatus = (value: number) => {
    if (value <= 50) return { label: 'Tốt', color: 'bg-green-500', icon: CheckCircle, textColor: 'text-green-700' };
    if (value <= 100) return { label: 'Trung bình', color: 'bg-yellow-500', icon: AlertTriangle, textColor: 'text-yellow-700' };
    if (value <= 150) return { label: 'Kém', color: 'bg-orange-500', icon: AlertTriangle, textColor: 'text-orange-700' };
    return { label: 'Xấu', color: 'bg-red-500', icon: XCircle, textColor: 'text-red-700' };
  };

  const status = getAQIStatus(aqi);
  const StatusIcon = status.icon;

  const pollutants = [
    { name: 'PM2.5', value: 25, unit: 'μg/m³', max: 50 },
    { name: 'PM10', value: 45, unit: 'μg/m³', max: 100 },
    { name: 'O₃', value: 80, unit: 'μg/m³', max: 160 },
    { name: 'NO₂', value: 35, unit: 'μg/m³', max: 80 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <Card className="backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wind className="w-5 h-5 text-blue-500" />
            <span>Chất lượng không khí</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {aqi}
              </div>
              <div className="flex items-center space-x-2">
                <StatusIcon className={`w-4 h-4 ${status.textColor}`} />
                <Badge variant="outline" className={`${status.textColor} border-current`}>
                  {status.label}
                </Badge>
              </div>
            </div>
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-gray-200 dark:text-gray-700"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={`${(aqi / 200) * 100}, 100`}
                  className={status.color.replace('bg-', 'text-')}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  AQI
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">Chi tiết chất ô nhiễm</h4>
            {pollutants.map((pollutant, index) => (
              <motion.div
                key={pollutant.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <span className="font-medium text-gray-700 dark:text-gray-300 w-12">
                    {pollutant.name}
                  </span>
                  <Progress 
                    value={(pollutant.value / pollutant.max) * 100} 
                    className="flex-1 h-2"
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-3">
                  {pollutant.value} {pollutant.unit}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 <strong>Lời khuyên:</strong> Chất lượng không khí ở mức {status.label.toLowerCase()}. 
              {aqi <= 50 ? ' Thích hợp cho mọi hoạt động ngoài trời.' : 
               aqi <= 100 ? ' Hạn chế hoạt động ngoài trời kéo dài.' : 
               ' Nên ở trong nhà và sử dụng máy lọc không khí.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}