import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface CurrentWeather {
  id: number;
  name: string;
  country: string;
  temp: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  visibility: number;
  uv_index: number;
  wind_speed: number;
  wind_direction: number;
  weather_code: string;
  weather_description: string;
  icon: string;
  sunrise: number;
  sunset: number;
  timezone: number;
  coords: {
    lat: number;
    lon: number;
  };
}

export interface HourlyForecast {
  time: number;
  temp: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  weather_code: string;
  weather_description: string;
  icon: string;
  pop: number; // Probability of precipitation
}

export interface DailyForecast {
  date: number;
  temp_min: number;
  temp_max: number;
  temp_day: number;
  temp_night: number;
  humidity: number;
  wind_speed: number;
  weather_code: string;
  weather_description: string;
  icon: string;
  pop: number;
  uv_index: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

export class WeatherAPI {
  private static instance: WeatherAPI;
  private apiKey: string;

  constructor() {
    this.apiKey = API_KEY || '';
  }

  static getInstance(): WeatherAPI {
    if (!WeatherAPI.instance) {
      WeatherAPI.instance = new WeatherAPI();
    }
    return WeatherAPI.instance;
  }

  async getCurrentWeather(lat: number, lon: number): Promise<CurrentWeather> {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric',
          lang: 'vi'
        }
      });

      const data = response.data;
      return {
        id: data.id,
        name: data.name,
        country: data.sys.country,
        temp: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        visibility: data.visibility,
        uv_index: 0,
        wind_speed: data.wind.speed,
        wind_direction: data.wind.deg,
        weather_code: data.weather[0].main,
        weather_description: data.weather[0].description,
        icon: data.weather[0].icon,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        timezone: data.timezone,
        coords: {
          lat: data.coord.lat,
          lon: data.coord.lon
        }
      };
    } catch (error) {
      throw new Error('Failed to fetch current weather');
    }
  }

  async getForecast(lat: number, lon: number): Promise<{ hourly: HourlyForecast[], daily: DailyForecast[] }> {
    try {
      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric',
          lang: 'vi'
        }
      });

      const hourlyData = response.data.list.slice(0, 24).map((item: any) => ({
        time: item.dt,
        temp: Math.round(item.main.temp),
        feels_like: Math.round(item.main.feels_like),
        humidity: item.main.humidity,
        wind_speed: item.wind.speed,
        weather_code: item.weather[0].main,
        weather_description: item.weather[0].description,
        icon: item.weather[0].icon,
        pop: item.pop * 100
      }));

      // Group by day for daily forecast
      const dailyMap = new Map<string, any[]>();
      response.data.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dateKey = date.toISOString().split('T')[0];
        if (!dailyMap.has(dateKey)) {
          dailyMap.set(dateKey, []);
        }
        dailyMap.get(dateKey)!.push(item);
      });

      const dailyData = Array.from(dailyMap.entries()).slice(0, 7).map(([dateKey, items]) => {
        const temps = items.map(item => item.main.temp);
        const dayItems = items.filter(item => {
          const hour = new Date(item.dt * 1000).getHours();
          return hour >= 6 && hour <= 18;
        });
        const nightItems = items.filter(item => {
          const hour = new Date(item.dt * 1000).getHours();
          return hour < 6 || hour > 18;
        });

        const representative = items[Math.floor(items.length / 2)];
        
        return {
          date: new Date(dateKey).getTime() / 1000,
          temp_min: Math.round(Math.min(...temps)),
          temp_max: Math.round(Math.max(...temps)),
          temp_day: dayItems.length ? Math.round(dayItems.reduce((sum, item) => sum + item.main.temp, 0) / dayItems.length) : Math.round(representative.main.temp),
          temp_night: nightItems.length ? Math.round(nightItems.reduce((sum, item) => sum + item.main.temp, 0) / nightItems.length) : Math.round(representative.main.temp),
          humidity: representative.main.humidity,
          wind_speed: representative.wind.speed,
          weather_code: representative.weather[0].main,
          weather_description: representative.weather[0].description,
          icon: representative.weather[0].icon,
          pop: Math.max(...items.map(item => item.pop)) * 100,
          uv_index: 0
        };
      });

      return { hourly: hourlyData, daily: dailyData };
    } catch (error) {
      throw new Error('Failed to fetch forecast data');
    }
  }

  async getWeatherByCity(city: string): Promise<WeatherData> {
    try {
      const geoResponse = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, {
        params: {
          q: city,
          limit: 1,
          appid: this.apiKey
        }
      });

      if (!geoResponse.data.length) {
        throw new Error('City not found');
      }

      const { lat, lon } = geoResponse.data[0];
      const current = await this.getCurrentWeather(lat, lon);
      const { hourly, daily } = await this.getForecast(lat, lon);

      return { current, hourly, daily };
    } catch (error) {
      throw new Error('Failed to fetch weather data');
    }
  }

  async getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    try {
      const current = await this.getCurrentWeather(lat, lon);
      const { hourly, daily } = await this.getForecast(lat, lon);
      return { current, hourly, daily };
    } catch (error) {
      throw new Error('Failed to fetch weather data');
    }
  }

  async searchCities(query: string): Promise<Array<{name: string, country: string, lat: number, lon: number}>> {
    try {
      const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, {
        params: {
          q: query,
          limit: 5,
          appid: this.apiKey
        }
      });

      return response.data.map((item: any) => ({
        name: item.name,
        country: item.country,
        lat: item.lat,
        lon: item.lon
      }));
    } catch (error) {
      return [];
    }
  }
}

export const weatherAPI = WeatherAPI.getInstance();