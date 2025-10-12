'use client';

import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Cloud, Thermometer, Wind, Droplets, Sun, Moon, MapPin, Smartphone } from 'lucide-react';

export default function AboutPage() {
  const features = [
    {
      icon: <Cloud className="w-8 h-8 text-blue-500" />,
      title: "Dự báo chính xác",
      description: "Dữ liệu thời tiết từ OpenWeatherMap API với độ chính xác cao"
    },
    {
      icon: <Thermometer className="w-8 h-8 text-red-500" />,
      title: "Biểu đồ nhiệt độ",
      description: "Theo dõi nhiệt độ theo giờ với biểu đồ trực quan"
    },
    {
      icon: <Wind className="w-8 h-8 text-green-500" />,
      title: "Thông tin chi tiết",
      description: "Độ ẩm, tốc độ gió, áp suất và tầm nhìn"
    },
    {
      icon: <MapPin className="w-8 h-8 text-purple-500" />,
      title: "Định vị GPS",
      description: "Tự động phát hiện vị trí hiện tại của bạn"
    },
    {
      icon: <Sun className="w-8 h-8 text-yellow-500" />,
      title: "Dark Mode",
      description: "Giao diện sáng/tối theo sở thích"
    },
    {
      icon: <Smartphone className="w-8 h-8 text-indigo-500" />,
      title: "PWA Ready",
      description: "Cài đặt như ứng dụng trên điện thoại"
    }
  ];

  const technologies = [
    "Next.js 13", "TypeScript", "Tailwind CSS", "Shadcn/UI", 
    "React Query", "Chart.js", "Framer Motion", "OpenWeatherMap API"
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Về WeatherApp
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Ứng dụng dự báo thời tiết hiện đại được xây dựng với công nghệ tiên tiến, 
            mang đến trải nghiệm người dùng tuyệt vời và thông tin thời tiết chính xác.
          </p>
        </motion.div>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Tính năng nổi bật
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl hover:shadow-2xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Technologies Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <Card className="backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-gray-900 dark:text-white">
                Công nghệ sử dụng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-center gap-3">
                {technologies.map((tech, index) => (
                  <motion.div
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      {tech}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Mission Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="backdrop-blur-md bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Sứ mệnh của chúng tôi
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                WeatherApp được tạo ra với mục tiêu mang đến thông tin thời tiết chính xác và kịp thời 
                cho người dùng Việt Nam. Chúng tôi tin rằng việc có được dự báo thời tiết đáng tin cậy 
                sẽ giúp mọi người lên kế hoạch tốt hơn cho cuộc sống hàng ngày, từ việc chọn trang phục 
                phù hợp đến việc quyết định các hoạt động ngoài trời.
              </p>
            </CardContent>
          </Card>
        </motion.section>
      </main>
    </div>
  );
}