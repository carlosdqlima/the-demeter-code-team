/**
 * Rotas da API para dados meteorológicos
 * Fornece endpoints para previsões do tempo e dados climáticos
 */
import express from 'express';
import axios from 'axios';

const router = express.Router();

// Configurações da API de clima
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Middleware para validação de coordenadas
 */
const validateCoordinates = (req, res, next) => {
  const { lat, lon } = req.query;
  
  if (!lat || !lon) {
    return res.status(400).json({
      error: 'Coordenadas (lat, lon) são obrigatórias'
    });
  }
  
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  
  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({
      error: 'Coordenadas devem ser números válidos'
    });
  }
  
  req.coordinates = { lat: latitude, lon: longitude };
  next();
};

/**
 * GET /api/weather/current
 * Obtém dados meteorológicos atuais
 */
router.get('/current', validateCoordinates, async (req, res) => {
  try {
    const { lat, lon } = req.coordinates;
    const { units = 'metric', lang = 'pt_br' } = req.query;
    
    if (!OPENWEATHER_API_KEY) {
      return res.status(503).json({
        error: 'Serviço meteorológico indisponível - API key não configurada'
      });
    }
    
    const url = `${OPENWEATHER_BASE_URL}/weather`;
    const params = {
      lat,
      lon,
      appid: OPENWEATHER_API_KEY,
      units,
      lang
    };
    
    const response = await axios.get(url, { params });
    
    // Processar dados para formato mais amigável
    const weatherData = {
      location: {
        name: response.data.name,
        country: response.data.sys.country,
        coordinates: { lat, lon }
      },
      current: {
        temperature: response.data.main.temp,
        feelsLike: response.data.main.feels_like,
        humidity: response.data.main.humidity,
        pressure: response.data.main.pressure,
        visibility: response.data.visibility,
        uvIndex: response.data.uvi || null
      },
      weather: {
        main: response.data.weather[0].main,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon
      },
      wind: {
        speed: response.data.wind.speed,
        direction: response.data.wind.deg,
        gust: response.data.wind.gust || null
      },
      clouds: {
        coverage: response.data.clouds.all
      },
      sun: {
        sunrise: new Date(response.data.sys.sunrise * 1000).toISOString(),
        sunset: new Date(response.data.sys.sunset * 1000).toISOString()
      },
      timestamp: new Date(response.data.dt * 1000).toISOString()
    };
    
    res.json({
      success: true,
      data: weatherData,
      source: 'OpenWeatherMap'
    });
    
  } catch (error) {
    console.error('Erro ao buscar dados meteorológicos atuais:', error.message);
    res.status(500).json({
      error: 'Erro ao buscar dados meteorológicos',
      details: error.response?.data || error.message
    });
  }
});

/**
 * GET /api/weather/forecast
 * Obtém previsão do tempo para 5 dias
 */
router.get('/forecast', validateCoordinates, async (req, res) => {
  try {
    const { lat, lon } = req.coordinates;
    const { units = 'metric', lang = 'pt_br' } = req.query;
    
    if (!OPENWEATHER_API_KEY) {
      return res.status(503).json({
        error: 'Serviço meteorológico indisponível - API key não configurada'
      });
    }
    
    const url = `${OPENWEATHER_BASE_URL}/forecast`;
    const params = {
      lat,
      lon,
      appid: OPENWEATHER_API_KEY,
      units,
      lang
    };
    
    const response = await axios.get(url, { params });
    
    // Processar previsão por dias
    const forecastByDay = {};
    
    response.data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0];
      
      if (!forecastByDay[date]) {
        forecastByDay[date] = {
          date,
          temperatures: [],
          conditions: [],
          humidity: [],
          precipitation: [],
          wind: []
        };
      }
      
      forecastByDay[date].temperatures.push(item.main.temp);
      forecastByDay[date].conditions.push({
        main: item.weather[0].main,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        time: new Date(item.dt * 1000).toISOString()
      });
      forecastByDay[date].humidity.push(item.main.humidity);
      forecastByDay[date].precipitation.push(item.rain?.['3h'] || 0);
      forecastByDay[date].wind.push({
        speed: item.wind.speed,
        direction: item.wind.deg
      });
    });
    
    // Calcular médias e resumos por dia
    const dailyForecast = Object.values(forecastByDay).map(day => ({
      date: day.date,
      temperature: {
        min: Math.min(...day.temperatures),
        max: Math.max(...day.temperatures),
        avg: day.temperatures.reduce((a, b) => a + b, 0) / day.temperatures.length
      },
      humidity: {
        avg: day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length
      },
      precipitation: {
        total: day.precipitation.reduce((a, b) => a + b, 0),
        probability: day.precipitation.filter(p => p > 0).length / day.precipitation.length
      },
      wind: {
        avgSpeed: day.wind.reduce((a, b) => a + b.speed, 0) / day.wind.length
      },
      conditions: day.conditions,
      dominantCondition: day.conditions.reduce((prev, current) => 
        day.conditions.filter(c => c.main === current.main).length > 
        day.conditions.filter(c => c.main === prev.main).length ? current : prev
      )
    }));
    
    res.json({
      success: true,
      location: {
        name: response.data.city.name,
        country: response.data.city.country,
        coordinates: { lat, lon }
      },
      forecast: dailyForecast,
      source: 'OpenWeatherMap',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Erro ao buscar previsão do tempo:', error.message);
    res.status(500).json({
      error: 'Erro ao buscar previsão do tempo',
      details: error.response?.data || error.message
    });
  }
});

/**
 * GET /api/weather/alerts
 * Obtém alertas meteorológicos
 */
router.get('/alerts', validateCoordinates, async (req, res) => {
  try {
    const { lat, lon } = req.coordinates;
    
    if (!OPENWEATHER_API_KEY) {
      return res.status(503).json({
        error: 'Serviço meteorológico indisponível - API key não configurada'
      });
    }
    
    const url = `${OPENWEATHER_BASE_URL}/onecall`;
    const params = {
      lat,
      lon,
      appid: OPENWEATHER_API_KEY,
      exclude: 'minutely,hourly,daily',
      units: 'metric'
    };
    
    const response = await axios.get(url, { params });
    
    const alerts = response.data.alerts || [];
    
    // Processar alertas para formato mais amigável
    const processedAlerts = alerts.map(alert => ({
      sender: alert.sender_name,
      event: alert.event,
      description: alert.description,
      severity: alert.tags?.[0] || 'unknown',
      start: new Date(alert.start * 1000).toISOString(),
      end: new Date(alert.end * 1000).toISOString(),
      areas: alert.areas || []
    }));
    
    res.json({
      success: true,
      coordinates: { lat, lon },
      alerts: processedAlerts,
      count: processedAlerts.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Erro ao buscar alertas meteorológicos:', error.message);
    res.status(500).json({
      error: 'Erro ao buscar alertas meteorológicos',
      details: error.response?.data || error.message
    });
  }
});

/**
 * GET /api/weather/agricultural
 * Obtém dados meteorológicos específicos para agricultura
 */
router.get('/agricultural', validateCoordinates, async (req, res) => {
  try {
    const { lat, lon } = req.coordinates;
    
    // Buscar dados atuais e previsão
    const [currentResponse, forecastResponse] = await Promise.all([
      axios.get(`/api/weather/current?lat=${lat}&lon=${lon}`, { baseURL: req.protocol + '://' + req.get('host') }),
      axios.get(`/api/weather/forecast?lat=${lat}&lon=${lon}`, { baseURL: req.protocol + '://' + req.get('host') })
    ]);
    
    const current = currentResponse.data.data;
    const forecast = forecastResponse.data.forecast;
    
    // Calcular índices agrícolas
    const agriculturalData = {
      irrigation: {
        recommendation: calculateIrrigationNeed(current, forecast),
        soilMoisture: estimateSoilMoisture(current, forecast),
        evapotranspiration: calculateEvapotranspiration(current)
      },
      planting: {
        conditions: evaluatePlantingConditions(current, forecast),
        riskLevel: assessWeatherRisk(current, forecast),
        bestDays: findBestPlantingDays(forecast)
      },
      harvest: {
        conditions: evaluateHarvestConditions(current, forecast),
        riskLevel: assessHarvestRisk(current, forecast),
        recommendedDays: findBestHarvestDays(forecast)
      },
      pestDisease: {
        riskLevel: assessPestDiseaseRisk(current, forecast),
        recommendations: getPestDiseaseRecommendations(current, forecast)
      }
    };
    
    res.json({
      success: true,
      coordinates: { lat, lon },
      current,
      forecast: forecast.slice(0, 3), // Próximos 3 dias
      agricultural: agriculturalData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Erro ao buscar dados agrícolas:', error.message);
    res.status(500).json({
      error: 'Erro ao buscar dados meteorológicos agrícolas',
      details: error.message
    });
  }
});

// Funções auxiliares para cálculos agrícolas
function calculateIrrigationNeed(current, forecast) {
  const humidity = current.current.humidity;
  const precipitation = forecast.slice(0, 3).reduce((sum, day) => sum + day.precipitation.total, 0);
  
  if (precipitation > 10) return 'low';
  if (humidity < 40) return 'high';
  if (humidity < 60) return 'medium';
  return 'low';
}

function estimateSoilMoisture(current, forecast) {
  const precipitation = forecast.slice(0, 7).reduce((sum, day) => sum + day.precipitation.total, 0);
  const temperature = current.current.temperature;
  
  let moisture = 50; // Base
  moisture += precipitation * 2;
  moisture -= (temperature - 20) * 1.5;
  
  return Math.max(0, Math.min(100, moisture));
}

function calculateEvapotranspiration(current) {
  const temp = current.current.temperature;
  const humidity = current.current.humidity;
  const windSpeed = current.wind.speed;
  
  // Fórmula simplificada de Penman-Monteith
  const et0 = 0.0023 * (temp + 17.8) * Math.sqrt(Math.abs(temp - humidity)) * (windSpeed + 1);
  return Math.max(0, et0);
}

function evaluatePlantingConditions(current, forecast) {
  const temp = current.current.temperature;
  const humidity = current.current.humidity;
  const precipitation = forecast.slice(0, 3).reduce((sum, day) => sum + day.precipitation.total, 0);
  
  if (temp >= 15 && temp <= 30 && humidity >= 50 && precipitation < 20) {
    return 'excellent';
  } else if (temp >= 10 && temp <= 35 && humidity >= 40) {
    return 'good';
  } else {
    return 'poor';
  }
}

function assessWeatherRisk(current, forecast) {
  const risks = [];
  
  if (current.current.temperature > 35) risks.push('heat_stress');
  if (current.current.temperature < 5) risks.push('frost');
  if (current.wind.speed > 15) risks.push('strong_wind');
  
  forecast.slice(0, 3).forEach(day => {
    if (day.precipitation.total > 30) risks.push('heavy_rain');
    if (day.temperature.max > 40) risks.push('extreme_heat');
  });
  
  return risks.length === 0 ? 'low' : risks.length <= 2 ? 'medium' : 'high';
}

function findBestPlantingDays(forecast) {
  return forecast.slice(0, 7).filter(day => 
    day.temperature.min >= 10 && 
    day.temperature.max <= 30 && 
    day.precipitation.total < 5
  ).map(day => day.date);
}

function evaluateHarvestConditions(current, forecast) {
  const humidity = current.current.humidity;
  const precipitation = forecast.slice(0, 3).reduce((sum, day) => sum + day.precipitation.total, 0);
  
  if (humidity < 70 && precipitation < 5) return 'excellent';
  if (humidity < 80 && precipitation < 15) return 'good';
  return 'poor';
}

function assessHarvestRisk(current, forecast) {
  const risks = [];
  
  if (current.current.humidity > 80) risks.push('high_humidity');
  
  forecast.slice(0, 3).forEach(day => {
    if (day.precipitation.total > 10) risks.push('rain');
  });
  
  return risks.length === 0 ? 'low' : 'high';
}

function findBestHarvestDays(forecast) {
  return forecast.slice(0, 7).filter(day => 
    day.humidity.avg < 70 && 
    day.precipitation.total < 2
  ).map(day => day.date);
}

function assessPestDiseaseRisk(current, forecast) {
  const temp = current.current.temperature;
  const humidity = current.current.humidity;
  
  if (temp >= 20 && temp <= 30 && humidity >= 70) return 'high';
  if (temp >= 15 && temp <= 35 && humidity >= 60) return 'medium';
  return 'low';
}

function getPestDiseaseRecommendations(current, forecast) {
  const recommendations = [];
  
  if (current.current.humidity > 80) {
    recommendations.push('Monitor for fungal diseases');
  }
  
  if (current.current.temperature > 25 && current.current.humidity > 60) {
    recommendations.push('Increase pest monitoring');
  }
  
  return recommendations;
}

export default router;