// Demo data for weather app
export const demoCurrentWeather = {
  id: 1581130,
  name: 'Hà Nội',
  country: 'VN',
  temp: 28,
  feels_like: 32,
  humidity: 78,
  pressure: 1013,
  visibility: 10000,
  uv_index: 6,
  wind_speed: 3.2,
  wind_direction: 180,
  weather_code: 'Clouds',
  weather_description: 'có mây',
  icon: '02d',
  sunrise: Math.floor(Date.now() / 1000) - 3600,
  sunset: Math.floor(Date.now() / 1000) + 7200,
  timezone: 25200,
  coords: {
    lat: 21.0285,
    lon: 105.8542
  }
};

export const demoHourlyForecast = Array.from({ length: 24 }, (_, i) => ({
  time: Math.floor(Date.now() / 1000) + (i * 3600),
  temp: 28 + Math.sin(i * 0.3) * 5 + Math.random() * 3,
  feels_like: 30 + Math.sin(i * 0.3) * 5 + Math.random() * 3,
  humidity: 70 + Math.random() * 20,
  wind_speed: 2 + Math.random() * 4,
  weather_code: i % 4 === 0 ? 'Rain' : i % 3 === 0 ? 'Clouds' : 'Clear',
  weather_description: i % 4 === 0 ? 'mưa nhẹ' : i % 3 === 0 ? 'có mây' : 'trời quang',
  icon: i % 4 === 0 ? '10d' : i % 3 === 0 ? '02d' : '01d',
  pop: Math.random() * 100
}));

export const demoDailyForecast = Array.from({ length: 7 }, (_, i) => ({
  date: Math.floor(Date.now() / 1000) + (i * 86400),
  temp_min: 22 + Math.random() * 3,
  temp_max: 32 + Math.random() * 5,
  temp_day: 28 + Math.random() * 4,
  temp_night: 24 + Math.random() * 3,
  humidity: 65 + Math.random() * 25,
  wind_speed: 2 + Math.random() * 3,
  weather_code: i % 3 === 0 ? 'Rain' : i % 2 === 0 ? 'Clouds' : 'Clear',
  weather_description: i % 3 === 0 ? 'mưa vừa' : i % 2 === 0 ? 'có mây' : 'nắng đẹp',
  icon: i % 3 === 0 ? '10d' : i % 2 === 0 ? '02d' : '01d',
  pop: Math.random() * 100,
  uv_index: 3 + Math.random() * 7
}));

export const demoCities = [
  { name: 'Hà Nội', country: 'VN', lat: 21.0285, lon: 105.8542 },
  { name: 'Hồ Chí Minh', country: 'VN', lat: 10.8231, lon: 106.6297 },
  { name: 'Đà Nẵng', country: 'VN', lat: 16.0471, lon: 108.2068 },
  { name: 'Hải Phòng', country: 'VN', lat: 20.8449, lon: 106.6881 },
  { name: 'Cần Thơ', country: 'VN', lat: 10.0452, lon: 105.7469 }
];