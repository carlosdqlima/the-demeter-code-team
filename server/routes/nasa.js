/**
 * Rotas da API para dados da NASA
 * Fornece endpoints para acessar dados de satélite, clima e agricultura
 */
import express from 'express';
import axios from 'axios';

const router = express.Router();

// Configurações da API da NASA
const NASA_API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';
const NASA_BASE_URL = 'https://api.nasa.gov';

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
  
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return res.status(400).json({
      error: 'Coordenadas fora do intervalo válido'
    });
  }
  
  req.coordinates = { lat: latitude, lon: longitude };
  next();
};

/**
 * GET /api/nasa/power/daily
 * Obtém dados diários de energia solar e meteorológicos
 */
router.get('/power/daily', validateCoordinates, async (req, res) => {
  try {
    const { lat, lon } = req.coordinates;
    const { start, end } = req.query;
    
    const parameters = [
      'ALLSKY_SFC_SW_DWN',  // Irradiação solar
      'T2M',                // Temperatura a 2m
      'PRECTOTCORR',        // Precipitação
      'RH2M',               // Umidade relativa
      'WS2M'                // Velocidade do vento
    ].join(',');
    
    const url = `${NASA_BASE_URL}/planetary/power/v1/daily`;
    const params = {
      parameters,
      community: 'AG',
      longitude: lon,
      latitude: lat,
      start: start || '20230101',
      end: end || '20231231',
      format: 'JSON',
      api_key: NASA_API_KEY
    };
    
    const response = await axios.get(url, { params });
    
    res.json({
      success: true,
      data: response.data,
      coordinates: { lat, lon },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Erro ao buscar dados NASA POWER:', error.message);
    res.status(500).json({
      error: 'Erro ao buscar dados da NASA',
      details: error.response?.data || error.message
    });
  }
});

/**
 * GET /api/nasa/power/monthly
 * Obtém dados mensais de energia solar e meteorológicos
 */
router.get('/power/monthly', validateCoordinates, async (req, res) => {
  try {
    const { lat, lon } = req.coordinates;
    const { start, end } = req.query;
    
    const parameters = [
      'ALLSKY_SFC_SW_DWN',
      'T2M_MAX',
      'T2M_MIN',
      'PRECTOTCORR',
      'RH2M'
    ].join(',');
    
    const url = `${NASA_BASE_URL}/planetary/power/v1/monthly`;
    const params = {
      parameters,
      community: 'AG',
      longitude: lon,
      latitude: lat,
      start: start || '202301',
      end: end || '202312',
      format: 'JSON',
      api_key: NASA_API_KEY
    };
    
    const response = await axios.get(url, { params });
    
    res.json({
      success: true,
      data: response.data,
      coordinates: { lat, lon },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Erro ao buscar dados mensais NASA POWER:', error.message);
    res.status(500).json({
      error: 'Erro ao buscar dados mensais da NASA',
      details: error.response?.data || error.message
    });
  }
});

/**
 * GET /api/nasa/imagery/earth
 * Obtém imagens de satélite da Terra
 */
router.get('/imagery/earth', validateCoordinates, async (req, res) => {
  try {
    const { lat, lon } = req.coordinates;
    const { date, dim } = req.query;
    
    const url = `${NASA_BASE_URL}/planetary/earth/imagery`;
    const params = {
      lon,
      lat,
      date: date || new Date().toISOString().split('T')[0],
      dim: dim || 0.15,
      api_key: NASA_API_KEY
    };
    
    const response = await axios.get(url, { 
      params,
      responseType: 'arraybuffer'
    });
    
    res.set('Content-Type', 'image/png');
    res.send(response.data);
    
  } catch (error) {
    console.error('Erro ao buscar imagem da Terra:', error.message);
    res.status(500).json({
      error: 'Erro ao buscar imagem de satélite',
      details: error.response?.data || error.message
    });
  }
});

/**
 * GET /api/nasa/apod
 * Obtém a Imagem Astronômica do Dia
 */
router.get('/apod', async (req, res) => {
  try {
    const { date, count } = req.query;
    
    const url = `${NASA_BASE_URL}/planetary/apod`;
    const params = {
      api_key: NASA_API_KEY,
      ...(date && { date }),
      ...(count && { count })
    };
    
    const response = await axios.get(url, { params });
    
    res.json({
      success: true,
      data: response.data,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Erro ao buscar APOD:', error.message);
    res.status(500).json({
      error: 'Erro ao buscar Imagem Astronômica do Dia',
      details: error.response?.data || error.message
    });
  }
});

/**
 * GET /api/nasa/neo/feed
 * Obtém dados de objetos próximos à Terra
 */
router.get('/neo/feed', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    const url = `${NASA_BASE_URL}/neo/rest/v1/feed`;
    const params = {
      api_key: NASA_API_KEY,
      start_date: start_date || new Date().toISOString().split('T')[0],
      end_date: end_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    
    const response = await axios.get(url, { params });
    
    res.json({
      success: true,
      data: response.data,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Erro ao buscar dados NEO:', error.message);
    res.status(500).json({
      error: 'Erro ao buscar dados de objetos próximos à Terra',
      details: error.response?.data || error.message
    });
  }
});

/**
 * GET /api/nasa/mars/weather
 * Obtém dados meteorológicos de Marte
 */
router.get('/mars/weather', async (req, res) => {
  try {
    const url = `${NASA_BASE_URL}/insight_weather/`;
    const params = {
      api_key: NASA_API_KEY,
      feedtype: 'json',
      ver: '1.0'
    };
    
    const response = await axios.get(url, { params });
    
    res.json({
      success: true,
      data: response.data,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Erro ao buscar dados do tempo em Marte:', error.message);
    res.status(500).json({
      error: 'Erro ao buscar dados meteorológicos de Marte',
      details: error.response?.data || error.message
    });
  }
});

export default router;