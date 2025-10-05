/**
 * Sistema de Integração com APIs da NASA
 * Gerencia todas as chamadas para APIs da NASA e cache de dados
 */

class NASAApiService {
    constructor() {
        this.apiKey = getConfig('nasa.apiKey');
        this.baseUrl = getConfig('nasa.baseUrl');
        this.endpoints = getConfig('nasa.endpoints');
        this.rateLimit = getConfig('nasa.rateLimit');
        this.timeout = getConfig('nasa.timeout');
        
        // Cache de dados
        this.cache = new Map();
        this.cacheExpiry = new Map();
        this.cacheDuration = 300000; // 5 minutos
        
        // Controle de rate limiting
        this.lastRequest = 0;
        this.requestQueue = [];
        this.isProcessingQueue = false;
        
        // Status da conexão
        this.isOnline = true;
        this.connectionStatus = 'connected';
        
        this.initializeService();
    }
    
    /**
     * Inicializa o serviço da NASA API
     */
    initializeService() {
        console.log('Inicializando serviço NASA API...');
        
        // Verifica conectividade
        this.checkConnection();
        
        // Configura listeners de rede
        this.setupNetworkListeners();
        
        // Inicia processamento da fila
        this.startQueueProcessor();
        
        console.log('Serviço NASA API inicializado');
    }
    
    /**
     * Verifica conectividade com APIs da NASA
     */
    async checkConnection() {
        try {
            const response = await this.makeRequest('/planetary/apod', { 
                count: 1,
                thumbs: true 
            });
            
            this.isOnline = true;
            this.connectionStatus = 'connected';
            this.updateConnectionUI(true);
            
            console.log('Conexão com NASA API estabelecida');
            
        } catch (error) {
            console.warn('Falha na conexão com NASA API:', error.message);
            this.isOnline = false;
            this.connectionStatus = 'offline';
            this.updateConnectionUI(false);
        }
    }
    
    /**
     * Configura listeners de eventos de rede
     */
    setupNetworkListeners() {
        window.addEventListener('online', () => {
            console.log('Conexão restaurada');
            this.isOnline = true;
            this.checkConnection();
        });
        
        window.addEventListener('offline', () => {
            console.log('Conexão perdida');
            this.isOnline = false;
            this.connectionStatus = 'offline';
            this.updateConnectionUI(false);
        });
    }
    
    /**
     * Atualiza UI do status de conexão
     * @param {boolean} isConnected - Status da conexão
     */
    updateConnectionUI(isConnected) {
        const connectionIcon = document.getElementById('nasa-connection');
        if (connectionIcon) {
            connectionIcon.className = isConnected ? 
                'fas fa-satellite-dish animate-pulse' : 
                'fas fa-satellite-dish text-danger';
        }
        
        const statusText = connectionIcon?.nextElementSibling;
        if (statusText) {
            statusText.textContent = isConnected ? 'NASA Online' : 'NASA Offline';
        }
    }
    
    /**
     * Inicia processador da fila de requisições
     */
    startQueueProcessor() {
        setInterval(() => {
            if (!this.isProcessingQueue && this.requestQueue.length > 0) {
                this.processRequestQueue();
            }
        }, this.rateLimit);
    }
    
    /**
     * Processa fila de requisições respeitando rate limit
     */
    async processRequestQueue() {
        if (this.requestQueue.length === 0) return;
        
        this.isProcessingQueue = true;
        
        const request = this.requestQueue.shift();
        const now = Date.now();
        
        // Respeita rate limit
        if (now - this.lastRequest < this.rateLimit) {
            await Utils.delay(this.rateLimit - (now - this.lastRequest));
        }
        
        try {
            const result = await this.executeRequest(request);
            request.resolve(result);
        } catch (error) {
            request.reject(error);
        }
        
        this.lastRequest = Date.now();
        this.isProcessingQueue = false;
    }
    
    /**
     * Faz requisição para API da NASA
     * @param {string} endpoint - Endpoint da API
     * @param {Object} params - Parâmetros da requisição
     * @returns {Promise<Object>} Dados da API
     */
    async makeRequest(endpoint, params = {}) {
        // Verifica cache primeiro
        const cacheKey = this.getCacheKey(endpoint, params);
        const cachedData = this.getFromCache(cacheKey);
        
        if (cachedData) {
            console.log(`Dados obtidos do cache: ${endpoint}`);
            return cachedData;
        }
        
        // Se offline, retorna dados simulados
        if (!this.isOnline) {
            console.log(`Usando dados simulados (offline): ${endpoint}`);
            return this.getMockData(endpoint, params);
        }
        
        // Adiciona à fila de requisições
        return new Promise((resolve, reject) => {
            this.requestQueue.push({
                endpoint,
                params,
                resolve,
                reject
            });
        });
    }
    
    /**
     * Executa requisição HTTP
     * @param {Object} request - Objeto da requisição
     * @returns {Promise<Object>} Resposta da API
     */
    async executeRequest(request) {
        const { endpoint, params } = request;
        
        // Adiciona API key aos parâmetros
        const requestParams = {
            ...params,
            api_key: this.apiKey
        };
        
        const url = Utils.buildUrl(this.baseUrl + endpoint, requestParams);
        
        console.log(`Fazendo requisição NASA API: ${endpoint}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        try {
            const response = await fetch(url, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'NASA-Farm-Navigators/1.0'
                }
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Salva no cache
            const cacheKey = this.getCacheKey(endpoint, params);
            this.saveToCache(cacheKey, data);
            
            return data;
            
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new Error('Timeout na requisição NASA API');
            }
            
            throw error;
        }
    }
    
    /**
     * Obtém dados de imagem da Terra
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     * @param {string} date - Data (YYYY-MM-DD)
     * @returns {Promise<Object>} Dados da imagem
     */
    async getEarthImagery(lat, lon, date = null) {
        const params = {
            lat: lat,
            lon: lon,
            dim: 0.15
        };
        
        if (date) {
            params.date = date;
        }
        
        return this.makeRequest(this.endpoints.earth, params);
    }
    
    /**
     * Obtém dados meteorológicos
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     * @param {string} startDate - Data inicial (YYYYMMDD)
     * @param {string} endDate - Data final (YYYYMMDD)
     * @returns {Promise<Object>} Dados meteorológicos
     */
    async getWeatherData(lat, lon, startDate, endDate) {
        const params = {
            parameters: 'T2M,PRECTOTCORR,RH2M,ALLSKY_SFC_SW_DWN',
            community: 'AG',
            longitude: lon,
            latitude: lat,
            start: startDate,
            end: endDate,
            format: 'JSON'
        };
        
        return this.makeRequest(this.endpoints.power, params);
    }
    
    /**
     * Obtém dados de radiação solar
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     * @param {string} year - Ano (YYYY)
     * @returns {Promise<Object>} Dados de radiação solar
     */
    async getSolarRadiation(lat, lon, year = new Date().getFullYear()) {
        const startDate = `${year}0101`;
        const endDate = `${year}1231`;
        
        const params = {
            parameters: 'ALLSKY_SFC_SW_DWN,CLRSKY_SFC_SW_DWN',
            community: 'AG',
            longitude: lon,
            latitude: lat,
            start: startDate,
            end: endDate,
            format: 'JSON'
        };
        
        return this.makeRequest(this.endpoints.power, params);
    }
    
    /**
     * Obtém dados de precipitação
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     * @param {number} days - Número de dias para buscar
     * @returns {Promise<Object>} Dados de precipitação
     */
    async getPrecipitationData(lat, lon, days = 30) {
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - (days * 24 * 60 * 60 * 1000));
        
        const params = {
            parameters: 'PRECTOTCORR',
            community: 'AG',
            longitude: lon,
            latitude: lat,
            start: this.formatDate(startDate),
            end: this.formatDate(endDate),
            format: 'JSON'
        };
        
        return this.makeRequest(this.endpoints.power, params);
    }
    
    /**
     * Obtém dados de temperatura do solo
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     * @returns {Promise<Object>} Dados de temperatura do solo
     */
    async getSoilTemperature(lat, lon) {
        const params = {
            parameters: 'TS,T2M_MAX,T2M_MIN',
            community: 'AG',
            longitude: lon,
            latitude: lat,
            start: this.formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
            end: this.formatDate(new Date()),
            format: 'JSON'
        };
        
        return this.makeRequest(this.endpoints.power, params);
    }
    
    /**
     * Obtém dados climáticos completos para uma região
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     * @returns {Promise<Object>} Dados climáticos completos
     */
    async getCompleteClimateData(lat, lon) {
        try {
            const [weather, solar, precipitation, soil] = await Promise.all([
                this.getWeatherData(lat, lon, this.formatDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)), this.formatDate(new Date())),
                this.getSolarRadiation(lat, lon),
                this.getPrecipitationData(lat, lon, 30),
                this.getSoilTemperature(lat, lon)
            ]);
            
            return {
                weather,
                solar,
                precipitation,
                soil,
                timestamp: Date.now(),
                location: { lat, lon }
            };
            
        } catch (error) {
            console.error('Erro ao obter dados climáticos completos:', error);
            return this.getMockClimateData(lat, lon);
        }
    }
    
    /**
     * Formata data para API da NASA
     * @param {Date} date - Data a ser formatada
     * @returns {string} Data formatada (YYYYMMDD)
     */
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }
    
    /**
     * Gera chave de cache
     * @param {string} endpoint - Endpoint da API
     * @param {Object} params - Parâmetros da requisição
     * @returns {string} Chave de cache
     */
    getCacheKey(endpoint, params) {
        const sortedParams = Object.keys(params)
            .sort()
            .map(key => `${key}=${params[key]}`)
            .join('&');
        return `${endpoint}?${sortedParams}`;
    }
    
    /**
     * Obtém dados do cache
     * @param {string} key - Chave do cache
     * @returns {Object|null} Dados do cache ou null
     */
    getFromCache(key) {
        const expiry = this.cacheExpiry.get(key);
        if (expiry && Date.now() > expiry) {
            this.cache.delete(key);
            this.cacheExpiry.delete(key);
            return null;
        }
        return this.cache.get(key);
    }
    
    /**
     * Salva dados no cache
     * @param {string} key - Chave do cache
     * @param {Object} data - Dados a serem salvos
     */
    saveToCache(key, data) {
        this.cache.set(key, data);
        this.cacheExpiry.set(key, Date.now() + this.cacheDuration);
    }
    
    /**
     * Limpa cache expirado
     */
    clearExpiredCache() {
        const now = Date.now();
        for (const [key, expiry] of this.cacheExpiry.entries()) {
            if (now > expiry) {
                this.cache.delete(key);
                this.cacheExpiry.delete(key);
            }
        }
    }
    
    /**
     * Obtém dados simulados quando offline
     * @param {string} endpoint - Endpoint da API
     * @param {Object} params - Parâmetros da requisição
     * @returns {Object} Dados simulados
     */
    getMockData(endpoint, params) {
        switch (endpoint) {
            case this.endpoints.earth:
                return this.getMockEarthImagery(params);
            case this.endpoints.power:
                return this.getMockWeatherData(params);
            default:
                return { error: 'Dados não disponíveis offline' };
        }
    }
    
    /**
     * Gera dados simulados de imagem da Terra
     * @param {Object} params - Parâmetros da requisição
     * @returns {Object} Dados simulados
     */
    getMockEarthImagery(params) {
        return {
            date: params.date || new Date().toISOString().split('T')[0],
            id: `mock_${Date.now()}`,
            url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iIzRhOTBkOSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2VtIGRhIFRlcnJhPC90ZXh0Pjwvc3ZnPg=='
        };
    }
    
    /**
     * Gera dados simulados meteorológicos
     * @param {Object} params - Parâmetros da requisição
     * @returns {Object} Dados simulados
     */
    getMockWeatherData(params) {
        const lat = parseFloat(params.latitude) || 0;
        const lon = parseFloat(params.longitude) || 0;
        
        // Simula dados baseados na localização
        const baseTemp = 20 + (Math.abs(lat) > 30 ? -5 : 5) + Utils.random(-3, 3);
        const baseHumidity = 60 + Utils.random(-20, 20);
        const baseSolar = 5 + Utils.random(-2, 2);
        
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [lon, lat]
            },
            properties: {
                parameter: {
                    T2M: { [this.formatDate(new Date())]: baseTemp },
                    RH2M: { [this.formatDate(new Date())]: baseHumidity },
                    ALLSKY_SFC_SW_DWN: { [this.formatDate(new Date())]: baseSolar },
                    PRECTOTCORR: { [this.formatDate(new Date())]: Utils.random(0, 10) }
                }
            }
        };
    }
    
    /**
     * Gera dados climáticos simulados completos
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     * @returns {Object} Dados climáticos simulados
     */
    getMockClimateData(lat, lon) {
        return {
            temperature: 20 + Utils.random(-5, 10),
            humidity: 60 + Utils.random(-20, 20),
            solarRadiation: 5 + Utils.random(-2, 3),
            precipitation: Utils.random(0, 15),
            soilMoisture: 40 + Utils.random(-15, 25),
            windSpeed: Utils.random(5, 25),
            pressure: 1013 + Utils.random(-20, 20),
            timestamp: Date.now(),
            location: { lat, lon },
            source: 'simulated'
        };
    }
    
    /**
     * Obtém estatísticas do cache
     * @returns {Object} Estatísticas do cache
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            hitRate: this.cacheHits / (this.cacheHits + this.cacheMisses) || 0,
            memoryUsage: JSON.stringify([...this.cache.entries()]).length
        };
    }
    
    /**
     * Limpa todo o cache
     */
    clearCache() {
        this.cache.clear();
        this.cacheExpiry.clear();
        console.log('Cache da NASA API limpo');
    }
    
    /**
     * Obtém status do serviço
     * @returns {Object} Status do serviço
     */
    getStatus() {
        return {
            isOnline: this.isOnline,
            connectionStatus: this.connectionStatus,
            queueSize: this.requestQueue.length,
            cacheSize: this.cache.size,
            lastRequest: this.lastRequest
        };
    }
}

// Exporta a classe globalmente
if (typeof window !== 'undefined') {
    window.NASAApiService = NASAApiService;
}