/**
 * Sistema Climático - NASA Farm Navigators
 * Gerencia condições meteorológicas, previsões e impactos na agricultura
 */

class WeatherSystem {
    constructor() {
        this.isInitialized = false;
        this.currentWeather = null;
        this.forecast = [];
        this.weatherHistory = [];
        
        // Configurações do sistema climático
        this.config = {
            updateInterval: 60000, // 1 minuto
            forecastDays: 7,
            historyDays: 30,
            extremeWeatherChance: 0.05, // 5% chance de clima extremo
            seasonalTransition: true,
            realTimeWeather: false // Se deve usar dados reais da API
        };
        
        // Tipos de condições climáticas
        this.weatherTypes = {
            sunny: {
                name: 'Ensolarado',
                icon: '☀️',
                cropGrowthMultiplier: 1.2,
                waterConsumption: 1.5,
                diseaseRisk: 0.1,
                description: 'Céu claro e ensolarado'
            },
            cloudy: {
                name: 'Nublado',
                icon: '☁️',
                cropGrowthMultiplier: 1.0,
                waterConsumption: 1.0,
                diseaseRisk: 0.15,
                description: 'Céu parcialmente nublado'
            },
            rainy: {
                name: 'Chuvoso',
                icon: '🌧️',
                cropGrowthMultiplier: 1.1,
                waterConsumption: 0.3,
                diseaseRisk: 0.3,
                description: 'Chuva moderada'
            },
            stormy: {
                name: 'Tempestade',
                icon: '⛈️',
                cropGrowthMultiplier: 0.7,
                waterConsumption: 0.1,
                diseaseRisk: 0.4,
                description: 'Tempestade com ventos fortes'
            },
            drought: {
                name: 'Seca',
                icon: '🌵',
                cropGrowthMultiplier: 0.5,
                waterConsumption: 2.0,
                diseaseRisk: 0.2,
                description: 'Condições de seca severa'
            },
            frost: {
                name: 'Geada',
                icon: '❄️',
                cropGrowthMultiplier: 0.3,
                waterConsumption: 0.8,
                diseaseRisk: 0.1,
                description: 'Temperaturas abaixo de zero'
            },
            heatwave: {
                name: 'Onda de Calor',
                icon: '🔥',
                cropGrowthMultiplier: 0.6,
                waterConsumption: 2.5,
                diseaseRisk: 0.25,
                description: 'Temperaturas extremamente altas'
            }
        };
        
        // Padrões sazonais
        this.seasonalPatterns = {
            spring: {
                temperature: { min: 15, max: 25 },
                humidity: { min: 60, max: 80 },
                precipitation: { min: 50, max: 150 },
                commonWeather: ['sunny', 'cloudy', 'rainy']
            },
            summer: {
                temperature: { min: 25, max: 35 },
                humidity: { min: 40, max: 70 },
                precipitation: { min: 20, max: 100 },
                commonWeather: ['sunny', 'cloudy', 'heatwave']
            },
            autumn: {
                temperature: { min: 10, max: 20 },
                humidity: { min: 70, max: 90 },
                precipitation: { min: 80, max: 200 },
                commonWeather: ['cloudy', 'rainy', 'stormy']
            },
            winter: {
                temperature: { min: -5, max: 10 },
                humidity: { min: 50, max: 80 },
                precipitation: { min: 30, max: 120 },
                commonWeather: ['cloudy', 'frost', 'stormy']
            }
        };
        
        // Alertas climáticos
        this.weatherAlerts = [];
        
        // Bind methods
        this.updateWeather = this.updateWeather.bind(this);
        this.onWeatherChanged = this.onWeatherChanged.bind(this);
    }

    /**
     * Inicializa o sistema climático
     */
    async initialize() {
        try {
            console.log('🌤️ Inicializando Sistema Climático...');
            
            // Carrega dados salvos
            await this.loadWeatherData();
            
            // Gera clima inicial se não existir
            if (!this.currentWeather) {
                this.generateInitialWeather();
            }
            
            // Gera previsão inicial
            this.generateForecast();
            
            // Configura eventos
            this.setupEventListeners();
            
            // Inicia atualizações automáticas
            this.startWeatherUpdates();
            
            this.isInitialized = true;
            console.log('✅ Sistema Climático inicializado com sucesso');
            
            // Dispara evento de inicialização
            this.dispatchEvent('weatherSystemInitialized', {
                currentWeather: this.currentWeather,
                forecastDays: this.forecast.length
            });
            
        } catch (error) {
            console.error('❌ Erro ao inicializar Sistema Climático:', error);
            throw error;
        }
    }

    /**
     * Gera condições climáticas iniciais
     */
    generateInitialWeather() {
        const currentSeason = this.getCurrentSeason();
        const seasonPattern = this.seasonalPatterns[currentSeason];
        
        this.currentWeather = {
            condition: this.selectRandomWeather(seasonPattern.commonWeather),
            temperature: this.randomBetween(seasonPattern.temperature.min, seasonPattern.temperature.max),
            humidity: this.randomBetween(seasonPattern.humidity.min, seasonPattern.humidity.max),
            precipitation: this.randomBetween(seasonPattern.precipitation.min, seasonPattern.precipitation.max),
            windSpeed: this.randomBetween(5, 25),
            windDirection: this.getRandomWindDirection(),
            pressure: this.randomBetween(980, 1030),
            visibility: this.randomBetween(5, 15),
            uvIndex: this.calculateUVIndex(),
            timestamp: new Date(),
            season: currentSeason
        };
        
        console.log(`🌤️ Clima inicial: ${this.getWeatherDescription()}`);
    }

    /**
     * Configura os ouvintes de eventos
     */
    setupEventListeners() {
        // Eventos de consulta climática
        document.addEventListener('getWeatherForecast', (e) => this.getForecast(e.detail));
        document.addEventListener('getWeatherHistory', (e) => this.getHistory(e.detail));
        document.addEventListener('setWeatherAlert', (e) => this.setWeatherAlert(e.detail));
        
        // Eventos de mudança sazonal
        document.addEventListener('seasonChanged', (e) => this.onSeasonChanged(e.detail));
    }

    /**
     * Inicia atualizações automáticas do clima
     */
    startWeatherUpdates() {
        this.weatherUpdateTimer = setInterval(() => {
            this.updateWeather();
        }, this.config.updateInterval);
        
        console.log('🌤️ Atualizações automáticas do clima iniciadas');
    }

    /**
     * Atualiza as condições climáticas
     */
    updateWeather() {
        const previousWeather = { ...this.currentWeather };
        
        // Determina se haverá mudança significativa
        const changeChance = 0.3; // 30% chance de mudança
        
        if (Math.random() < changeChance) {
            this.generateNewWeatherCondition();
        } else {
            this.updateCurrentConditions();
        }
        
        // Adiciona ao histórico
        this.addToHistory(previousWeather);
        
        // Atualiza previsão
        this.updateForecast();
        
        // Verifica alertas
        this.checkWeatherAlerts();
        
        // Dispara evento de mudança
        this.dispatchEvent('weatherUpdated', {
            previous: previousWeather,
            current: this.currentWeather,
            timestamp: new Date()
        });
        
        console.log(`🌤️ Clima atualizado: ${this.getWeatherDescription()}`);
    }

    /**
     * Gera nova condição climática
     */
    generateNewWeatherCondition() {
        const currentSeason = this.getCurrentSeason();
        const seasonPattern = this.seasonalPatterns[currentSeason];
        
        // Verifica chance de clima extremo
        let availableWeather = [...seasonPattern.commonWeather];
        
        if (Math.random() < this.config.extremeWeatherChance) {
            // Adiciona climas extremos baseados na estação
            if (currentSeason === 'summer') {
                availableWeather.push('heatwave', 'drought');
            } else if (currentSeason === 'winter') {
                availableWeather.push('frost');
            } else {
                availableWeather.push('stormy');
            }
        }
        
        const newCondition = this.selectRandomWeather(availableWeather);
        
        this.currentWeather = {
            condition: newCondition,
            temperature: this.generateTemperature(currentSeason, newCondition),
            humidity: this.generateHumidity(newCondition),
            precipitation: this.generatePrecipitation(newCondition),
            windSpeed: this.generateWindSpeed(newCondition),
            windDirection: this.getRandomWindDirection(),
            pressure: this.generatePressure(newCondition),
            visibility: this.generateVisibility(newCondition),
            uvIndex: this.calculateUVIndex(newCondition),
            timestamp: new Date(),
            season: currentSeason
        };
    }

    /**
     * Atualiza condições atuais com pequenas variações
     */
    updateCurrentConditions() {
        // Pequenas variações nas condições atuais
        this.currentWeather.temperature += this.randomBetween(-2, 2);
        this.currentWeather.humidity += this.randomBetween(-5, 5);
        this.currentWeather.windSpeed += this.randomBetween(-3, 3);
        this.currentWeather.pressure += this.randomBetween(-5, 5);
        
        // Mantém valores dentro dos limites
        this.currentWeather.temperature = Math.max(-10, Math.min(45, this.currentWeather.temperature));
        this.currentWeather.humidity = Math.max(0, Math.min(100, this.currentWeather.humidity));
        this.currentWeather.windSpeed = Math.max(0, Math.min(50, this.currentWeather.windSpeed));
        this.currentWeather.pressure = Math.max(950, Math.min(1050, this.currentWeather.pressure));
        
        this.currentWeather.timestamp = new Date();
    }

    /**
     * Gera previsão do tempo
     */
    generateForecast() {
        this.forecast = [];
        let baseWeather = { ...this.currentWeather };
        
        for (let i = 1; i <= this.config.forecastDays; i++) {
            const forecastDate = new Date();
            forecastDate.setDate(forecastDate.getDate() + i);
            
            // Evolui o clima baseado no dia anterior
            baseWeather = this.evolveForecastWeather(baseWeather, i);
            
            this.forecast.push({
                date: forecastDate,
                condition: baseWeather.condition,
                temperatureMin: Math.round(baseWeather.temperature - this.randomBetween(3, 8)),
                temperatureMax: Math.round(baseWeather.temperature + this.randomBetween(3, 8)),
                humidity: Math.round(baseWeather.humidity),
                precipitation: Math.round(baseWeather.precipitation),
                windSpeed: Math.round(baseWeather.windSpeed),
                confidence: Math.max(0.5, 1 - (i * 0.1)) // Confiança diminui com o tempo
            });
        }
        
        console.log(`📅 Previsão gerada para ${this.forecast.length} dias`);
    }

    /**
     * Evolui o clima para previsão
     */
    evolveForecastWeather(baseWeather, dayOffset) {
        const currentSeason = this.getCurrentSeason();
        const seasonPattern = this.seasonalPatterns[currentSeason];
        
        // Chance de mudança aumenta com o tempo
        const changeChance = 0.2 + (dayOffset * 0.1);
        
        if (Math.random() < changeChance) {
            return {
                condition: this.selectRandomWeather(seasonPattern.commonWeather),
                temperature: this.randomBetween(seasonPattern.temperature.min, seasonPattern.temperature.max),
                humidity: this.randomBetween(seasonPattern.humidity.min, seasonPattern.humidity.max),
                precipitation: this.randomBetween(seasonPattern.precipitation.min, seasonPattern.precipitation.max),
                windSpeed: this.randomBetween(5, 25)
            };
        } else {
            // Pequenas variações
            return {
                condition: baseWeather.condition,
                temperature: baseWeather.temperature + this.randomBetween(-3, 3),
                humidity: Math.max(20, Math.min(100, baseWeather.humidity + this.randomBetween(-10, 10))),
                precipitation: Math.max(0, baseWeather.precipitation + this.randomBetween(-20, 20)),
                windSpeed: Math.max(0, baseWeather.windSpeed + this.randomBetween(-5, 5))
            };
        }
    }

    /**
     * Métodos auxiliares de geração
     */
    
    generateTemperature(season, condition) {
        const seasonPattern = this.seasonalPatterns[season];
        let baseTemp = this.randomBetween(seasonPattern.temperature.min, seasonPattern.temperature.max);
        
        // Ajustes baseados na condição
        const adjustments = {
            sunny: 3,
            heatwave: 8,
            frost: -10,
            stormy: -2,
            cloudy: -1
        };
        
        return baseTemp + (adjustments[condition] || 0);
    }
    
    generateHumidity(condition) {
        const baseHumidity = {
            sunny: this.randomBetween(40, 60),
            cloudy: this.randomBetween(60, 80),
            rainy: this.randomBetween(80, 95),
            stormy: this.randomBetween(85, 100),
            drought: this.randomBetween(20, 40),
            frost: this.randomBetween(70, 90),
            heatwave: this.randomBetween(30, 50)
        };
        
        return baseHumidity[condition] || this.randomBetween(50, 70);
    }
    
    generatePrecipitation(condition) {
        const basePrecipitation = {
            sunny: 0,
            cloudy: this.randomBetween(0, 20),
            rainy: this.randomBetween(50, 150),
            stormy: this.randomBetween(100, 300),
            drought: 0,
            frost: this.randomBetween(0, 30),
            heatwave: 0
        };
        
        return basePrecipitation[condition] || 0;
    }
    
    generateWindSpeed(condition) {
        const baseWindSpeed = {
            sunny: this.randomBetween(5, 15),
            cloudy: this.randomBetween(10, 20),
            rainy: this.randomBetween(15, 25),
            stormy: this.randomBetween(30, 50),
            drought: this.randomBetween(5, 15),
            frost: this.randomBetween(10, 20),
            heatwave: this.randomBetween(5, 15)
        };
        
        return baseWindSpeed[condition] || this.randomBetween(10, 20);
    }
    
    generatePressure(condition) {
        const basePressure = {
            sunny: this.randomBetween(1015, 1025),
            cloudy: this.randomBetween(1005, 1015),
            rainy: this.randomBetween(995, 1005),
            stormy: this.randomBetween(980, 995),
            drought: this.randomBetween(1020, 1030),
            frost: this.randomBetween(1010, 1020),
            heatwave: this.randomBetween(1010, 1020)
        };
        
        return basePressure[condition] || this.randomBetween(1000, 1020);
    }
    
    generateVisibility(condition) {
        const baseVisibility = {
            sunny: this.randomBetween(12, 15),
            cloudy: this.randomBetween(8, 12),
            rainy: this.randomBetween(3, 8),
            stormy: this.randomBetween(1, 5),
            drought: this.randomBetween(5, 10),
            frost: this.randomBetween(6, 10),
            heatwave: this.randomBetween(8, 12)
        };
        
        return baseVisibility[condition] || this.randomBetween(8, 12);
    }
    
    calculateUVIndex(condition = null) {
        const currentCondition = condition || this.currentWeather?.condition || 'sunny';
        const season = this.getCurrentSeason();
        
        let baseUV = {
            spring: 6,
            summer: 9,
            autumn: 4,
            winter: 2
        }[season];
        
        const uvAdjustments = {
            sunny: 0,
            cloudy: -2,
            rainy: -4,
            stormy: -5,
            drought: 2,
            frost: -3,
            heatwave: 3
        };
        
        return Math.max(0, Math.min(11, baseUV + (uvAdjustments[currentCondition] || 0)));
    }

    /**
     * Métodos de consulta
     */
    
    getCurrentWeather() {
        return {
            ...this.currentWeather,
            description: this.getWeatherDescription(),
            impact: this.getWeatherImpact()
        };
    }
    
    getForecast(days = null) {
        const requestedDays = days || this.config.forecastDays;
        return this.forecast.slice(0, requestedDays).map(day => ({
            ...day,
            description: this.weatherTypes[day.condition]?.description || 'Condição desconhecida'
        }));
    }
    
    getHistory(days = 7) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        return this.weatherHistory
            .filter(entry => entry.timestamp >= cutoffDate)
            .map(entry => ({
                ...entry,
                description: this.weatherTypes[entry.condition]?.description || 'Condição desconhecida'
            }));
    }
    
    getWeatherDescription() {
        if (!this.currentWeather) return 'Dados não disponíveis';
        
        const weatherType = this.weatherTypes[this.currentWeather.condition];
        const temp = Math.round(this.currentWeather.temperature);
        
        return `${weatherType?.icon || '🌤️'} ${weatherType?.name || 'Desconhecido'} - ${temp}°C`;
    }
    
    getWeatherImpact() {
        if (!this.currentWeather) return null;
        
        const weatherType = this.weatherTypes[this.currentWeather.condition];
        if (!weatherType) return null;
        
        return {
            cropGrowth: weatherType.cropGrowthMultiplier,
            waterConsumption: weatherType.waterConsumption,
            diseaseRisk: weatherType.diseaseRisk,
            recommendation: this.getWeatherRecommendation()
        };
    }
    
    getWeatherRecommendation() {
        if (!this.currentWeather) return 'Dados não disponíveis';
        
        const condition = this.currentWeather.condition;
        const recommendations = {
            sunny: 'Ótimo dia para atividades agrícolas. Monitore irrigação.',
            cloudy: 'Condições normais. Continue atividades planejadas.',
            rainy: 'Evite aplicação de defensivos. Boa para crescimento.',
            stormy: 'Evite atividades ao ar livre. Proteja culturas.',
            drought: 'Aumente irrigação. Considere culturas resistentes.',
            frost: 'Proteja culturas sensíveis. Evite plantio.',
            heatwave: 'Aumente irrigação. Forneça sombra se possível.'
        };
        
        return recommendations[condition] || 'Monitore condições cuidadosamente.';
    }

    /**
     * Sistema de alertas
     */
    
    setWeatherAlert(alertData) {
        const alert = {
            id: this.generateAlertId(),
            type: alertData.type,
            condition: alertData.condition,
            threshold: alertData.threshold,
            message: alertData.message,
            active: true,
            created: new Date()
        };
        
        this.weatherAlerts.push(alert);
        console.log(`🚨 Alerta climático criado: ${alert.message}`);
        
        return alert;
    }
    
    checkWeatherAlerts() {
        this.weatherAlerts.forEach(alert => {
            if (!alert.active) return;
            
            let triggered = false;
            
            switch (alert.type) {
                case 'temperature':
                    triggered = this.currentWeather.temperature >= alert.threshold;
                    break;
                case 'precipitation':
                    triggered = this.currentWeather.precipitation >= alert.threshold;
                    break;
                case 'wind':
                    triggered = this.currentWeather.windSpeed >= alert.threshold;
                    break;
                case 'condition':
                    triggered = this.currentWeather.condition === alert.condition;
                    break;
            }
            
            if (triggered) {
                this.triggerWeatherAlert(alert);
            }
        });
    }
    
    triggerWeatherAlert(alert) {
        console.log(`🚨 ALERTA CLIMÁTICO: ${alert.message}`);
        
        this.dispatchEvent('weatherAlert', {
            alert: alert,
            currentWeather: this.currentWeather,
            timestamp: new Date()
        });
        
        // Desativa o alerta após ser disparado
        alert.active = false;
    }

    /**
     * Métodos auxiliares
     */
    
    getCurrentSeason() {
        // Obtém estação atual (pode vir de outro sistema)
        return window.gameInstance?.gameState?.time?.season || 'spring';
    }
    
    selectRandomWeather(weatherArray) {
        return weatherArray[Math.floor(Math.random() * weatherArray.length)];
    }
    
    getRandomWindDirection() {
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        return directions[Math.floor(Math.random() * directions.length)];
    }
    
    randomBetween(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    generateAlertId() {
        return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    addToHistory(weatherData) {
        this.weatherHistory.push({
            ...weatherData,
            timestamp: new Date()
        });
        
        // Mantém apenas últimos registros
        const maxHistory = this.config.historyDays * 24; // Registros por hora
        if (this.weatherHistory.length > maxHistory) {
            this.weatherHistory = this.weatherHistory.slice(-maxHistory);
        }
    }
    
    updateForecast() {
        // Remove o primeiro dia da previsão e adiciona um novo
        this.forecast.shift();
        
        const lastForecast = this.forecast[this.forecast.length - 1];
        const newDate = new Date(lastForecast.date);
        newDate.setDate(newDate.getDate() + 1);
        
        const newForecast = this.evolveForecastWeather(lastForecast, this.forecast.length + 1);
        
        this.forecast.push({
            date: newDate,
            condition: newForecast.condition,
            temperatureMin: Math.round(newForecast.temperature - this.randomBetween(3, 8)),
            temperatureMax: Math.round(newForecast.temperature + this.randomBetween(3, 8)),
            humidity: Math.round(newForecast.humidity),
            precipitation: Math.round(newForecast.precipitation),
            windSpeed: Math.round(newForecast.windSpeed),
            confidence: 0.6
        });
    }

    /**
     * Eventos
     */
    
    onWeatherChanged(event) {
        console.log('🌤️ Evento: Clima alterado', event.detail);
    }
    
    onSeasonChanged(seasonData) {
        console.log(`🍂 Mudança de estação: ${seasonData.newSeason}`);
        
        // Regenera clima baseado na nova estação
        this.generateNewWeatherCondition();
        this.generateForecast();
        
        this.dispatchEvent('weatherSeasonChanged', {
            season: seasonData.newSeason,
            weather: this.currentWeather
        });
    }
    
    dispatchEvent(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }

    /**
     * Gerenciamento de dados
     */
    
    async loadWeatherData() {
        try {
            const savedData = localStorage.getItem('weatherSystemData');
            if (savedData) {
                const data = JSON.parse(savedData);
                
                if (data.currentWeather) {
                    this.currentWeather = data.currentWeather;
                    this.currentWeather.timestamp = new Date(this.currentWeather.timestamp);
                }
                
                if (data.weatherHistory) {
                    this.weatherHistory = data.weatherHistory.map(entry => ({
                        ...entry,
                        timestamp: new Date(entry.timestamp)
                    }));
                }
                
                if (data.weatherAlerts) {
                    this.weatherAlerts = data.weatherAlerts.map(alert => ({
                        ...alert,
                        created: new Date(alert.created)
                    }));
                }
                
                console.log('💾 Dados climáticos carregados');
            }
        } catch (error) {
            console.error('❌ Erro ao carregar dados climáticos:', error);
        }
    }
    
    saveWeatherData() {
        try {
            const dataToSave = {
                currentWeather: this.currentWeather,
                weatherHistory: this.weatherHistory,
                weatherAlerts: this.weatherAlerts,
                lastSaved: new Date().toISOString()
            };
            
            localStorage.setItem('weatherSystemData', JSON.stringify(dataToSave));
            console.log('💾 Dados climáticos salvos');
            
        } catch (error) {
            console.error('❌ Erro ao salvar dados climáticos:', error);
        }
    }

    /**
     * Limpeza e destruição
     */
    
    destroy() {
        // Salva dados antes de destruir
        this.saveWeatherData();
        
        // Para atualizações automáticas
        if (this.weatherUpdateTimer) {
            clearInterval(this.weatherUpdateTimer);
        }
        
        // Remove event listeners
        document.removeEventListener('getWeatherForecast', this.getForecast);
        document.removeEventListener('getWeatherHistory', this.getHistory);
        document.removeEventListener('setWeatherAlert', this.setWeatherAlert);
        document.removeEventListener('seasonChanged', this.onSeasonChanged);
        
        // Limpa dados
        this.currentWeather = null;
        this.forecast = [];
        this.weatherHistory = [];
        this.weatherAlerts = [];
        this.isInitialized = false;
        
        console.log('🧹 Sistema Climático destruído');
    }
}

// Exporta para uso global e módulos
if (typeof window !== 'undefined') {
    window.WeatherSystem = WeatherSystem;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = WeatherSystem;
}