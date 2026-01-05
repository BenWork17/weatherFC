'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { MapPin, Thermometer } from 'lucide-react';

interface WeatherMapProps {
  lat: number;
  lon: number;
  cityName: string;
  temp: number;
}

export function WeatherMap({ lat, lon, cityName, temp }: WeatherMapProps) {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !containerRef.current) return;

    let map: any = null;
    let resizeObserver: ResizeObserver | null = null;

    const initMap = async () => {
      try {
  // Dynamic import Leaflet and its stylesheet (client-only)
  const L = (await import('leaflet')).default;
  // Import Leaflet CSS dynamically to ensure map tiles and controls render correctly
  // This must run on the client; importing CSS from node_modules here avoids including it in SSR bundle
  await import('leaflet/dist/leaflet.css');
        
        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        // Create custom temperature icon
        const customIcon = L.divIcon({
          html: `
            <div style="
              background: linear-gradient(135deg, #3B82F6, #1D4ED8);
              color: white;
              border-radius: 50%;
              width: 44px;
              height: 44px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 13px;
              border: 3px solid white;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              font-family: 'Inter', sans-serif;
            ">
              ${temp}°
            </div>
          `,
          className: 'custom-temp-marker',
          iconSize: [44, 44],
          iconAnchor: [22, 22],
        });

        // Ensure container is ready
        const container = containerRef.current;
        if (!container) return;

        // Ensure container has Leaflet's container class so CSS rules apply
        if (!container.classList.contains('leaflet-container')) {
          container.classList.add('leaflet-container');
        }

        // Clear any existing map
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }

        // Force container dimensions
        container.style.width = '100%';
        container.style.height = '400px';
        container.style.position = 'relative';
        container.style.zIndex = '1';

        // Wait for container to be fully rendered
        await new Promise(resolve => {
          requestAnimationFrame(() => {
            requestAnimationFrame(resolve);
          });
        });

        // Initialize map with explicit options
        map = L.map(container, {
          center: [lat, lon],
          zoom: 11,
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          dragging: true,
          attributionControl: true,
          preferCanvas: false,
          renderer: L.svg(),
          fadeAnimation: true,
          zoomAnimation: true,
          markerZoomAnimation: true
        });

  // Add tile layer with optimized settings
        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
          minZoom: 3,
          tileSize: 256,
          zoomOffset: 0,
          subdomains: ['a', 'b', 'c'],
          errorTileUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          // avoid setting crossOrigin here; letting browser default helps with public tile servers
          updateWhenIdle: false,
          updateWhenZooming: false,
          keepBuffer: 2,
          detectRetina: false
        });

        tileLayer.addTo(map);

        // Debugging hooks: surface tile load errors to console to help diagnose blank tiles
        tileLayer.on('tileerror', (error: any) => {
          // Log error and tile coordinates if available
          try {
            console.error('Leaflet tileerror', error);
          } catch (e) {
            console.error('Leaflet tileerror (unknown)', e);
          }
        });

        // When individual tiles load, force an invalidateSize to reflow
        tileLayer.on('tileload', () => {
          if (map) {
            try {
              map.invalidateSize({ animate: false });
            } catch {}
          }
        });

        // When tile layer finished loading all tiles, mark map loaded
        tileLayer.on('load', () => {
          setMapLoaded(true);
          setTimeout(() => {
            try { map.invalidateSize({ animate: false }); } catch {}
          }, 100);
        });

        // Add weather overlay if API key is available
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
        if (!apiKey) {
          console.warn('OPENWEATHER API KEY not set. Weather overlay will be skipped.');
        }
        if (apiKey && apiKey !== 'demo') {
          const weatherLayer = L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
            attribution: 'Weather © <a href="https://openweathermap.org">OpenWeatherMap</a>',
            opacity: 0.5,
            maxZoom: 19,
            crossOrigin: true
          });
          weatherLayer.addTo(map);
        }

        // Add marker
        const marker = L.marker([lat, lon], { icon: customIcon }).addTo(map);
        
        // Add popup
        marker.bindPopup(`
          <div style="text-align: center; padding: 12px; font-family: 'Inter', sans-serif;">
            <h3 style="margin: 0 0 8px 0; font-weight: 600; color: #1f2937; font-size: 16px;">${cityName}</h3>
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 8px;">
              <span style="font-size: 18px;">🌡️</span>
              <span style="font-size: 20px; font-weight: bold; color: #3b82f6;">${temp}°C</span>
            </div>
            <p style="margin: 0; font-size: 12px; color: #6b7280;">
              ${lat.toFixed(4)}, ${lon.toFixed(4)}
            </p>
          </div>
        `, {
          closeButton: true,
          autoClose: false,
          className: 'custom-popup'
        });

        mapRef.current = map;

        // Force map to recalculate size multiple times
        const forceResize = () => {
          if (map && !map._container._leaflet_pos) {
            map.invalidateSize({ animate: false, pan: false });
          }
        };

        // Immediate resize
        setTimeout(forceResize, 0);
        setTimeout(forceResize, 50);
        setTimeout(forceResize, 100);
        setTimeout(forceResize, 200);
        setTimeout(forceResize, 500);

        // Setup ResizeObserver to handle container size changes
        if (window.ResizeObserver) {
          resizeObserver = new ResizeObserver(() => {
            if (map) {
              setTimeout(() => {
                map.invalidateSize({ animate: false, pan: false });
              }, 10);
            }
          });
          resizeObserver.observe(container);
        }

        // Listen for tile load events
        tileLayer.on('load', () => {
          setMapLoaded(true);
          setTimeout(() => {
            if (map) {
              map.invalidateSize({ animate: false, pan: false });
            }
          }, 100);
        });

        // Handle window resize
        const handleResize = () => {
          if (map) {
            setTimeout(() => {
              map.invalidateSize({ animate: false, pan: false });
            }, 100);
          }
        };

        window.addEventListener('resize', handleResize);

        // Cleanup function
        return () => {
          window.removeEventListener('resize', handleResize);
          if (resizeObserver) {
            resizeObserver.disconnect();
          }
        };

      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    const cleanup = initMap();

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (cleanup && typeof cleanup.then === 'function') {
        cleanup.then(cleanupFn => {
          if (typeof cleanupFn === 'function') {
            cleanupFn();
          }
        });
      }
    };
  }, [isClient, lat, lon, cityName, temp]);

  if (!isClient) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card className="backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-green-500" />
              <span>Bản đồ vị trí</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <div className="text-gray-500">Đang tải bản đồ...</div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <Card className="backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-green-500" />
            <span>Bản đồ vị trí</span>
            {!mapLoaded && (
              <div className="ml-2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            ref={containerRef}
            className="w-full h-96 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800"
            style={{ 
              minHeight: '400px',
              height: '400px',
              width: '100%',
              position: 'relative',
              zIndex: 1
            }}
          />
          
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Tọa độ: {lat.toFixed(4)}, {lon.toFixed(4)}</span>
            <div className="flex items-center space-x-1">
              <Thermometer className="w-4 h-4" />
              <span>{temp}°C</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              🗺️ <strong>Bản đồ tương tác:</strong> Click và kéo để di chuyển, scroll để zoom. 
              Marker hiển thị nhiệt độ tại vị trí được chọn.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}