/**
 * Configurações globais do FarmVerse
 * Centraliza todas as configurações do jogo para fácil manutenção
 */

const GameConfig = {
    // ===== CONFIGURAÇÕES GERAIS =====
    version: '1.0.0',
    debug: true,
    
    // ===== CONFIGURAÇÕES DA NASA API =====
    nasa: {
        apiKey: 'DEMO_KEY', // Substitua pela sua chave da NASA
        baseUrl: 'https://api.nasa.gov',
        endpoints: {
            earth: '/planetary/earth/imagery',
            power: '/power/api/temporal/daily/point',
            weather: '/insight_weather/',
            apod: '/planetary/apod'
        },
        rateLimit: 1000, // ms entre requisições
        timeout: 10000 // timeout em ms
    },
    
    // ===== CONFIGURAÇÕES DO PHASER =====
    phaser: {
        type: Phaser.AUTO,
        width: 1200,
        height: 800,
        parent: 'phaser-container',
        backgroundColor: '#2c5530',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 0 },
                debug: false
            }
        },
        scale: {
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_BOTH
        }
    },
    
    // ===== CONFIGURAÇÕES DO MAPA =====
    map: {
        defaultCenter: [0, 0], // Lat, Lng
        defaultZoom: 2,
        minZoom: 1,
        maxZoom: 10,
        tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; OpenStreetMap contributors'
    },
    
    // ===== CONFIGURAÇÕES DE GAMEPLAY =====
    gameplay: {
        // Configurações de tempo
        timeScale: 1, // Velocidade do jogo (1 = normal)
        seasonDuration: 30000, // Duração de uma estação em ms
        dayDuration: 5000, // Duração de um dia em ms
        
        // Configurações de fazenda
        maxFarms: 10,
        farmSize: { width: 8, height: 6 }, // Grade de lotes
        plotSize: 64, // Tamanho de cada lote em pixels
        
        // Configurações de culturas
        cropGrowthTime: {
            wheat: 15000,    // 15 segundos
            corn: 20000,     // 20 segundos
            rice: 25000,     // 25 segundos
            soybean: 18000,  // 18 segundos
            potato: 12000,   // 12 segundos
            tomato: 22000    // 22 segundos
        },
        
        // Configurações econômicas
        startingMoney: 50000,
        basePrices: {
            wheat: 150,
            corn: 180,
            rice: 200,
            soybean: 170,
            potato: 120,
            tomato: 250
        },
        
        // Configurações de sustentabilidade
        sustainabilityFactors: {
            waterUsage: 0.3,
            soilHealth: 0.25,
            biodiversity: 0.2,
            carbonFootprint: 0.15,
            energyEfficiency: 0.1
        }
    },
    
    // ===== CONFIGURAÇÕES DE TECNOLOGIA =====
    technology: {
        solarPanels: {
            levels: 5,
            baseCost: 10000,
            costMultiplier: 1.5,
            efficiencyBonus: 0.1 // 10% por nível
        },
        irrigation: {
            levels: 3,
            baseCost: 5000,
            costMultiplier: 2.0,
            waterSavings: 0.15 // 15% por nível
        },
        drones: {
            levels: 4,
            baseCost: 15000,
            costMultiplier: 1.8,
            monitoringBonus: 0.2 // 20% por nível
        },
        precision: {
            levels: 3,
            baseCost: 20000,
            costMultiplier: 2.5,
            yieldBonus: 0.12 // 12% por nível
        }
    },
    
    // ===== CONFIGURAÇÕES CLIMÁTICAS =====
    climate: {
        // Faixas ideais para culturas
        optimalConditions: {
            wheat: { temp: [15, 25], humidity: [40, 70], solar: [4, 7] },
            corn: { temp: [20, 30], humidity: [50, 80], solar: [5, 8] },
            rice: { temp: [25, 35], humidity: [70, 90], solar: [4, 6] },
            soybean: { temp: [18, 28], humidity: [45, 75], solar: [5, 7] },
            potato: { temp: [10, 20], humidity: [60, 80], solar: [3, 6] },
            tomato: { temp: [22, 32], humidity: [50, 70], solar: [6, 9] }
        },
        
        // Eventos climáticos extremos
        extremeEvents: {
            drought: { probability: 0.1, duration: 7, impact: -0.4 },
            flood: { probability: 0.08, duration: 3, impact: -0.6 },
            heatwave: { probability: 0.12, duration: 5, impact: -0.3 },
            frost: { probability: 0.06, duration: 2, impact: -0.8 }
        }
    },
    
    // ===== CONFIGURAÇÕES DE REGIÕES =====
    regions: {
        // Regiões agrícolas principais do mundo
        northAmerica: {
            name: 'América do Norte',
            center: [45, -100],
            climate: 'temperate',
            specialties: ['wheat', 'corn', 'soybean'],
            bonus: { yield: 0.1 }
        },
        southAmerica: {
            name: 'América do Sul',
            center: [-15, -60],
            climate: 'tropical',
            specialties: ['soybean', 'corn', 'rice'],
            bonus: { growth: 0.15 }
        },
        europe: {
            name: 'Europa',
            center: [50, 10],
            climate: 'temperate',
            specialties: ['wheat', 'potato', 'tomato'],
            bonus: { efficiency: 0.12 }
        },
        asia: {
            name: 'Ásia',
            center: [30, 100],
            climate: 'varied',
            specialties: ['rice', 'wheat', 'corn'],
            bonus: { sustainability: 0.1 }
        },
        africa: {
            name: 'África',
            center: [0, 20],
            climate: 'arid',
            specialties: ['corn', 'soybean', 'wheat'],
            bonus: { resilience: 0.2 }
        },
        oceania: {
            name: 'Oceania',
            center: [-25, 140],
            climate: 'varied',
            specialties: ['wheat', 'corn', 'potato'],
            bonus: { innovation: 0.15 }
        }
    },
    
    // ===== CONFIGURAÇÕES DE UI =====
    ui: {
        animationDuration: 300,
        notificationDuration: 3000,
        tooltipDelay: 500,
        autoSaveInterval: 30000, // 30 segundos
        
        // Cores temáticas
        colors: {
            primary: '#1e3a8a',
            secondary: '#059669',
            accent: '#f59e0b',
            success: '#10b981',
            warning: '#f59e0b',
            danger: '#dc2626',
            nasa: '#0b3d91'
        }
    },
    
    // ===== CONFIGURAÇÕES DE ÁUDIO =====
    audio: {
        enabled: true,
        masterVolume: 0.7,
        sfxVolume: 0.8,
        musicVolume: 0.5,
        
        sounds: {
            plant: 'assets/sounds/plant.mp3',
            harvest: 'assets/sounds/harvest.mp3',
            water: 'assets/sounds/water.mp3',
            notification: 'assets/sounds/notification.mp3',
            success: 'assets/sounds/success.mp3',
            error: 'assets/sounds/error.mp3'
        }
    },
    
    // ===== CONFIGURAÇÕES DE PERFORMANCE =====
    performance: {
        maxParticles: 100,
        renderDistance: 1000,
        updateFrequency: 60, // FPS
        enableGPUAcceleration: true,
        enableWebGL: true
    },
    
    // ===== CONFIGURAÇÕES DE SAVE/LOAD =====
    save: {
        storageKey: 'nasa-farm-navigators-save',
        autoSave: true,
        compressionEnabled: true,
        maxSaveSlots: 5
    }
};

/**
 * Função para obter configuração específica
 * @param {string} path - Caminho da configuração (ex: 'gameplay.timeScale')
 * @returns {any} Valor da configuração
 */
function getConfig(path) {
    return path.split('.').reduce((obj, key) => obj && obj[key], GameConfig);
}

/**
 * Função para definir configuração específica
 * @param {string} path - Caminho da configuração
 * @param {any} value - Novo valor
 */
function setConfig(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, key) => obj[key], GameConfig);
    if (target) {
        target[lastKey] = value;
    }
}

/**
 * Função para validar configurações
 * @returns {boolean} True se todas as configurações são válidas
 */
function validateConfig() {
    try {
        // Validações básicas
        if (!GameConfig.nasa.apiKey) {
            console.warn('NASA API key não configurada');
        }
        
        if (GameConfig.gameplay.timeScale <= 0) {
            console.error('timeScale deve ser maior que 0');
            return false;
        }
        
        if (GameConfig.gameplay.startingMoney < 0) {
            console.error('startingMoney não pode ser negativo');
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Erro na validação de configurações:', error);
        return false;
    }
}

// Exporta as configurações globalmente
if (typeof window !== 'undefined') {
    window.GameConfig = GameConfig;
    window.getConfig = getConfig;
    window.setConfig = setConfig;
    window.validateConfig = validateConfig;
}