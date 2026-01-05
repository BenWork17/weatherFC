'use client';

import { HourlyForecast } from '@/lib/weather-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface HourlyChartProps {
  hourlyData: HourlyForecast[];
}

export function HourlyChart({ hourlyData }: HourlyChartProps) {
  const data = {
    labels: hourlyData.map(item => format(new Date(item.time * 1000), 'HH:mm')),
    datasets: [
      {
        label: 'Nhiệt độ (°C)',
        data: hourlyData.map(item => item.temp),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Cảm giác như (°C)',
        data: hourlyData.map(item => item.feels_like),
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: false,
        tension: 0.4,
        pointBackgroundColor: 'rgb(245, 158, 11)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 3,
        borderDash: [5, 5],
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          }
        }
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            const datasetLabel = context.dataset.label || '';
            const value = context.parsed.y;
            const hourlyItem = hourlyData[context.dataIndex];
            
            if (context.datasetIndex === 0) {
              return [
                `${datasetLabel}: ${value}°C`,
                `Độ ẩm: ${hourlyItem.humidity}%`,
                `Gió: ${hourlyItem.wind_speed} m/s`,
                `Mưa: ${Math.round(hourlyItem.pop)}%`
              ];
            }
            return `${datasetLabel}: ${value}°C`;
          },
          title: function(context: any) {
            const time = format(new Date(hourlyData[context[0].dataIndex].time * 1000), 'HH:mm, dd/MM');
            return time;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          maxTicksLimit: 8,
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value: any) {
            return value + '°C';
          }
        }
      }
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Dự báo 24 giờ tới
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <Line data={data} options={options} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}