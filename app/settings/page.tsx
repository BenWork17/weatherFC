'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Bell, Globe, Thermometer, Wind, Eye, Palette, Smartphone } from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [autoLocation, setAutoLocation] = useState(false);
  const [temperatureUnit, setTemperatureUnit] = useState('celsius');
  const [windUnit, setWindUnit] = useState('ms');
  const [language, setLanguage] = useState('vi');

  const handleNotificationToggle = () => {
    setNotifications(!notifications);
    if (!notifications) {
      // Request notification permission
      if ('Notification' in window) {
        Notification.requestPermission();
      }
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Cài đặt
          </h1>

          {/* Appearance Settings */}
          <Card className="mb-6 backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5 text-purple-500" />
                <span>Giao diện</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme-select" className="text-base">Chế độ hiển thị</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Sáng</SelectItem>
                    <SelectItem value="dark">Tối</SelectItem>
                    <SelectItem value="system">Hệ thống</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Units Settings */}
          <Card className="mb-6 backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Thermometer className="w-5 h-5 text-red-500" />
                <span>Đơn vị đo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="temp-unit" className="text-base">Nhiệt độ</Label>
                <Select value={temperatureUnit} onValueChange={setTemperatureUnit}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="celsius">°C</SelectItem>
                    <SelectItem value="fahrenheit">°F</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="wind-unit" className="text-base">Tốc độ gió</Label>
                <Select value={windUnit} onValueChange={setWindUnit}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ms">m/s</SelectItem>
                    <SelectItem value="kmh">km/h</SelectItem>
                    <SelectItem value="mph">mph</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Location Settings */}
          <Card className="mb-6 backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-green-500" />
                <span>Vị trí</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-location" className="text-base">Tự động phát hiện vị trí</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sử dụng GPS để hiển thị thời tiết tại vị trí hiện tại
                  </p>
                </div>
                <Switch
                  id="auto-location"
                  checked={autoLocation}
                  onCheckedChange={setAutoLocation}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications Settings */}
          <Card className="mb-6 backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-yellow-500" />
                <span>Thông báo</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications" className="text-base">Thông báo thời tiết</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Nhận cảnh báo về thời tiết xấu và cập nhật quan trọng
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={handleNotificationToggle}
                />
              </div>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card className="mb-6 backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-blue-500" />
                <span>Ngôn ngữ</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="language" className="text-base">Ngôn ngữ hiển thị</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* PWA Settings */}
          <Card className="mb-6 backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-indigo-500" />
                <span>Ứng dụng</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Cài đặt WeatherApp như một ứng dụng trên thiết bị của bạn
                </p>
                <Button variant="outline" className="w-full">
                  Cài đặt ứng dụng
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="text-center">
            <Button size="lg" className="px-8">
              Lưu cài đặt
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}