'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Cloud, Heart, Settings, Info } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function Header() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Trang chủ', icon: Cloud },
    { href: '/favorites', label: 'Yêu thích', icon: Heart },
    { href: '/settings', label: 'Cài đặt', icon: Settings },
    { href: '/about', label: 'Giới thiệu', icon: Info },
  ];

  return (
    <motion.header 
      className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div 
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Link href="/" className="flex items-center space-x-2">
            <Cloud className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              WeatherApp
            </h1>
          </Link>
        </motion.div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "flex items-center space-x-2 rounded-full transition-all",
                    isActive && "bg-blue-500 text-white hover:bg-blue-600"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
        <nav className="container mx-auto px-4 py-2">
          <div className="flex justify-around">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "flex flex-col items-center space-y-1 h-auto py-2 px-3 rounded-lg",
                      isActive && "text-blue-500"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </motion.header>
  );
}