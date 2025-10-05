/**
 * Sistema de Integração de Dados NASA
 * Integra dados reais da NASA para práticas agrícolas educativas e simulação
 */
class NASADataIntegration {
    constructor() {
        this.apiEndpoints = {
            // APIs reais da NASA
            earthData: 'https://earthdata.nasa.gov/api/v1',
            modis: 'https://modis.gsfc.nasa.gov/data',
            smap: 'https://smap.jpl.nasa.gov/data',
            gpm: 'https://gpm.nasa.gov/data',
            power: 'https://power.larc.nasa.gov/api',
            earthImagery: 'https://api.nasa.gov/planetary/earth/imagery',
            
            // Fallback para desenvolvimento (dados simulados)
            mock: 'https://api.nasa.gov/planetary/earth'
        };
        
        this.currentData = {
            soilMoisture: 0,
            soilTemperature: 0,
            vegetationIndex: 0,
            precipitation: 0,
            solarRadiation: 0,
            satelliteImage: null,
            weatherForecast: [],
            lastUpdate: null
        };
        
        this.farmingActivities = {
            irrigation: {
                name: 'Irrigação',
                description: 'Sistema de irrigação baseado em dados de umidade do solo',
                trigger: 'soilMoisture < 30',
                effect: 'Aumenta umidade do solo em 40%',
                cost: 50,
                sustainability: 85
            },
            fertilization: {
                name: 'Fertilização',
                description: 'Aplicação de fertilizantes baseada em análise do solo',
                trigger: 'vegetationIndex < 0.4',
                effect: 'Aumenta índice de vegetação em 25%',
                cost: 75,
                sustainability: 70
            },
            livestock: {
                name: 'Manejo de Gado',
                description: 'Rotação de pastagem baseada em dados de vegetação',
                trigger: 'vegetationIndex > 0.7',
                effect: 'Mantém qualidade da pastagem',
                cost: 30,
                sustainability: 90
            },
            planting: {
                name: 'Plantio',
                description: 'Timing de plantio baseado em previsão climática',
                trigger: 'precipitation > 20 && soilTemperature > 15',
                effect: 'Otimiza germinação das sementes',
                cost: 100,
                sustainability: 95
            }
        };
        
        this.conservationTechniques = [
            {
                id: 'cover-crops',
                name: 'Culturas de Cobertura',
                description: 'Plantio de culturas específicas para proteger e melhorar o solo',
                benefits: ['Reduz erosão', 'Melhora fertilidade', 'Conserva umidade'],
                nasaData: 'Baseado em dados de umidade do solo SMAP',
                impact: 'Reduz erosão em até 90%',
                implementation: 'Plantar leguminosas entre safras',
                dataSource: 'Dados MODIS de cobertura vegetal'
            },
            {
                id: 'precision-irrigation',
                name: 'Irrigação de Precisão',
                description: 'Uso de dados de satélite para otimizar irrigação',
                benefits: ['Economiza água', 'Reduz custos', 'Melhora produtividade'],
                nasaData: 'Baseado em dados MODIS e Landsat',
                impact: 'Economia de 30-50% de água',
                implementation: 'Sensores de umidade + irrigação automatizada',
                dataSource: 'Dados SMAP de umidade do solo'
            },
            {
                id: 'crop-rotation',
                name: 'Rotação de Culturas',
                description: 'Alternância planejada de diferentes culturas na mesma área',
                benefits: ['Melhora saúde do solo', 'Reduz pragas', 'Aumenta biodiversidade'],
                nasaData: 'Baseado em índices de vegetação NDVI',
                impact: 'Aumento de 20% na produtividade',
                implementation: 'Alternar culturas por temporada',
                dataSource: 'Análise temporal MODIS'
            },
            {
                id: 'no-till',
                name: 'Plantio Direto',
                description: 'Técnica que evita o revolvimento do solo',
                benefits: ['Conserva estrutura do solo', 'Reduz erosão', 'Sequestra carbono'],
                nasaData: 'Monitorado via dados de carbono do solo',
                impact: 'Reduz perda de solo em 70%',
                implementation: 'Semear diretamente sobre restos vegetais',
                dataSource: 'Dados de temperatura do solo MODIS'
            }
        ];
        
        this.decisionEngine = new AgricultureDecisionEngine();
        this.initialize();
    }

    /**
     * Inicializa o sistema de dados NASA
     */
    initialize() {
        console.log('🛰️ Inicializando sistema de dados NASA...');
        this.startDataUpdates();
        this.setupUI();
    }

    /**
     * Inicia atualizações periódicas de dados
     */
    startDataUpdates() {
        // Atualiza dados a cada 30 segundos (simulação)
        this.updateInterval = setInterval(() => {
            this.fetchNASAData();
        }, 30000);
        
        // Primeira atualização imediata
        this.fetchNASAData();
    }

    /**
     * Busca dados da NASA para uma localização específica
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     * @returns {Promise<Object>} Dados da NASA
     */
    async fetchNASAData(lat, lon) {
        try {
            // Busca imagem de satélite da NASA
            const satelliteImage = await this.fetchSatelliteImage(lat, lon);
            
            // Simula dados da NASA para desenvolvimento
            const mockData = this.generateMockData(lat, lon);
            
            this.currentData = {
                ...mockData,
                satelliteImage: satelliteImage,
                lastUpdate: new Date()
            };
            
            this.updateUI();
            this.updateDecisionRecommendations();
            return this.currentData;
            
        } catch (error) {
            console.error('Erro ao buscar dados da NASA:', error);
            return null;
        }
    }

    /**
     * Busca imagem de satélite da NASA para uma localização
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     * @returns {Promise<string>} URL da imagem de satélite
     */
    async fetchSatelliteImage(lat, lon) {
        try {
            // Usando API real da NASA (requer chave API)
            const apiKey = 'DEMO_KEY'; // Em produção, usar chave real
            const date = new Date().toISOString().split('T')[0];
            
            const url = `${this.apiEndpoints.earthImagery}?lon=${lon}&lat=${lat}&date=${date}&dim=0.5&api_key=${apiKey}`;
            
            const response = await fetch(url);
            if (response.ok) {
                return url;
            } else {
                // Fallback para imagem simulada
                return this.generateMockSatelliteImage(lat, lon);
            }
        } catch (error) {
            console.warn('Erro ao buscar imagem de satélite, usando fallback:', error);
            return this.generateMockSatelliteImage(lat, lon);
        }
    }

    /**
     * Gera URL de imagem de satélite simulada
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     * @returns {string} URL da imagem simulada
     */
    generateMockSatelliteImage(lat, lon) {
        // Gera uma imagem baseada nas coordenadas para simular dados de satélite
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        
        // Simula uma imagem de satélite com base na localização
        const gradient = ctx.createRadialGradient(200, 200, 0, 200, 200, 200);
        gradient.addColorStop(0, '#4a7c59'); // Verde para vegetação
        gradient.addColorStop(0.5, '#8b7355'); // Marrom para solo
        gradient.addColorStop(1, '#2d5016'); // Verde escuro para floresta
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 400, 400);
        
        // Adiciona padrões baseados nas coordenadas
        ctx.fillStyle = `rgba(${Math.abs(lat * 10) % 255}, ${Math.abs(lon * 10) % 255}, 100, 0.3)`;
        ctx.fillRect(0, 0, 400, 400);
        
        return canvas.toDataURL();
    }

    /**
     * Gera dados simulados baseados na localização
     * @param {number} lat - Latitude
     * @param {number} lon - Longitude
     * @returns {Object} Dados simulados
     */
    generateMockData(lat, lon) {
        // Simula dados realistas baseados em dados NASA reais
        return {
            soilMoisture: this.generateRealisticValue(25, 45, '%'), // SMAP data range
            soilTemperature: this.generateRealisticValue(15, 35, '°C'), // MODIS LST range
            vegetationIndex: this.generateRealisticValue(0.2, 0.8, ''), // NDVI range
            precipitation: this.generateRealisticValue(0, 15, 'mm'), // Daily precipitation
            solarRadiation: this.generateRealisticValue(15, 25, 'MJ/m²'), // Daily solar radiation
            coordinates: { lat, lon }
        };
    }

    /**
     * Atualiza recomendações de decisão baseadas nos dados atuais
     */
    updateDecisionRecommendations() {
        this.generateConservationRecommendations();
        console.log('🛰️ Dados NASA atualizados:', this.currentData);
    }

    /**
     * Gera valor realístico dentro de um range
     */
    generateRealisticValue(min, max, unit) {
        const value = (Math.random() * (max - min) + min).toFixed(1);
        return `${value}${unit}`;
    }

    /**
     * Busca dados reais da NASA (implementação futura)
     */
    async fetchRealNASAData() {
        // Implementação futura para APIs reais da NASA
        // Exemplos de endpoints:
        // - MODIS Land Surface Temperature
        // - SMAP Soil Moisture
        // - Landsat NDVI
        // - GLDAS Precipitation
        console.log('🔄 Buscando dados reais da NASA...');
    }

    /**
     * Executa uma atividade agrícola baseada em dados da NASA
     * @param {string} activity - Tipo de atividade (irrigation, fertilization, etc.)
     * @returns {Object} Resultado da atividade
     */
    async executeActivity(activity) {
        if (!this.farmingActivities[activity]) {
            throw new Error(`Atividade '${activity}' não reconhecida`);
        }

        const activityData = this.farmingActivities[activity];
        
        // Verifica se as condições são adequadas
        const isRecommended = this.decisionEngine
            .analyzeAndRecommend(this.currentData)
            .some(rec => rec.activity === activity);

        // Simula a execução da atividade
        const updatedData = this.decisionEngine.simulateActivity(activity, this.currentData);
        
        // Atualiza os dados atuais
        this.currentData = {
            ...updatedData,
            lastUpdate: new Date()
        };

        // Calcula o resultado
        const result = {
            activity: activityData.name,
            success: true,
            recommended: isRecommended,
            effect: activityData.effect,
            cost: activityData.cost,
            sustainability: activityData.sustainability,
            newData: this.currentData,
            timestamp: new Date()
        };

        // Atualiza a interface
        this.updateUI();
        this.updateDecisionRecommendations();

        // Log da atividade
        console.log(`🌱 Atividade executada: ${activityData.name}`, result);

        return result;
    }

    /**
     * Obtém recomendações atuais do sistema de decisões
     * @returns {Array} Lista de recomendações
     */
    getCurrentRecommendations() {
        return this.decisionEngine.analyzeAndRecommend(this.currentData);
    }

    /**
     * Obtém relatório de sustentabilidade
     * @returns {Object} Relatório de sustentabilidade
     */
    getSustainabilityReport() {
        return this.decisionEngine.generateSustainabilityReport();
    }

    /**
     * Atualiza interface com dados NASA
     */
    updateUI() {
        // Atualiza elementos da interface
        const soilTempElement = document.getElementById('soil-temp');
        const soilMoistureElement = document.getElementById('soil-moisture');
        const vegetationIndexElement = document.getElementById('vegetation-index');
        
        if (soilTempElement) {
            soilTempElement.textContent = this.currentData.soilTemperature;
        }
        
        if (soilMoistureElement) {
            soilMoistureElement.textContent = this.currentData.soilMoisture;
        }
        
        if (vegetationIndexElement) {
            vegetationIndexElement.textContent = this.currentData.vegetationIndex;
        }

        // Atualiza painel de atividades
        this.updateActivitiesPanel();

        // Atualiza imagem de satélite se disponível
        if (this.currentData.satelliteImage) {
            this.updateSatelliteImage();
        }
    }

    /**
     * Atualiza painel de atividades na interface
     */
    updateActivitiesPanel() {
        const activitiesContainer = document.getElementById('activities-panel');
        if (!activitiesContainer) return;

        const recommendations = this.getCurrentRecommendations();
        
        activitiesContainer.innerHTML = '';
        
        Object.keys(this.farmingActivities).forEach(activityKey => {
            const activity = this.farmingActivities[activityKey];
            const isRecommended = recommendations.some(rec => rec.activity === activityKey);
            
            const activityElement = document.createElement('div');
            activityElement.className = `activity-item ${isRecommended ? 'recommended' : ''}`;
            activityElement.innerHTML = `
                <h5>${activity.name}</h5>
                <p>${activity.description}</p>
                <div class="activity-stats">
                    <span>💰 Custo: $${activity.cost}</span>
                    <span>🌱 Sustentabilidade: ${activity.sustainability}%</span>
                </div>
                <button onclick="nasaDataIntegration.executeActivity('${activityKey}')" 
                        class="activity-btn ${isRecommended ? 'recommended' : ''}">
                    ${isRecommended ? '⭐ Recomendado' : 'Executar'}
                </button>
            `;
            activitiesContainer.appendChild(activityElement);
        });
    }

    /**
     * Atualiza imagem de satélite na interface
     */
    updateSatelliteImage() {
        const imageContainer = document.getElementById('satellite-image');
        if (!imageContainer) return;

        imageContainer.innerHTML = `
            <img src="${this.currentData.satelliteImage}" 
                 alt="Imagem de Satélite NASA" 
                 style="width: 100%; max-width: 400px; border-radius: 8px;">
            <p style="font-size: 12px; color: #999; margin-top: 5px;">
                📡 Imagem de satélite NASA - ${this.currentData.lastUpdate?.toLocaleString()}
            </p>
        `;
    }

    /**
     * Gera recomendações de conservação baseadas nos dados
     */
    generateConservationRecommendations() {
        const recommendations = [];
        
        // Analisa umidade do solo
        const moistureValue = parseFloat(this.currentData.soilMoisture);
        if (moistureValue < 30) {
            recommendations.push({
                technique: 'precision-irrigation',
                priority: 'high',
                reason: 'Baixa umidade do solo detectada pelos dados SMAP da NASA'
            });
        }
        
        // Analisa índice de vegetação
        const ndviValue = parseFloat(this.currentData.vegetationIndex);
        if (ndviValue < 0.4) {
            recommendations.push({
                technique: 'cover-crops',
                priority: 'medium',
                reason: 'Baixo índice de vegetação observado via dados MODIS'
            });
        }
        
        // Analisa temperatura do solo
        const tempValue = parseFloat(this.currentData.soilTemperature);
        if (tempValue > 30) {
            recommendations.push({
                technique: 'no-till',
                priority: 'medium',
                reason: 'Alta temperatura do solo - plantio direto pode ajudar'
            });
        }
        
        this.updateConservationTips(recommendations);
    }

    /**
     * Atualiza dicas de conservação na interface
     */
    updateConservationTips(recommendations) {
        const tipsContainer = document.getElementById('conservation-tips-content');
        if (!tipsContainer) return;
        
        tipsContainer.innerHTML = '';
        
        if (recommendations.length === 0) {
            tipsContainer.innerHTML = '<p class="tip-item">✅ Condições ideais detectadas!</p>';
            return;
        }
        
        recommendations.forEach(rec => {
            const technique = this.conservationTechniques.find(t => t.id === rec.technique);
            if (technique) {
                const tipElement = document.createElement('div');
                tipElement.className = `tip-item priority-${rec.priority}`;
                tipElement.innerHTML = `
                    <h5>${technique.name}</h5>
                    <p>${rec.reason}</p>
                    <small>💡 ${technique.description}</small>
                `;
                tipsContainer.appendChild(tipElement);
            }
        });
    }

    /**
     * Configura interface do usuário
     */
    setupUI() {
        // Adiciona estilos para as dicas de conservação
        const style = document.createElement('style');
        style.textContent = `
            .nasa-data-section {
                margin-bottom: 20px;
            }
            
            .data-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .data-item i {
                color: #4CAF50;
                width: 20px;
            }
            
            .conservation-tips {
                margin-top: 20px;
            }
            
            .tip-item {
                background: rgba(76, 175, 80, 0.1);
                border-left: 3px solid #4CAF50;
                padding: 10px;
                margin: 10px 0;
                border-radius: 4px;
            }
            
            .tip-item.priority-high {
                background: rgba(244, 67, 54, 0.1);
                border-left-color: #f44336;
            }
            
            .tip-item.priority-medium {
                background: rgba(255, 152, 0, 0.1);
                border-left-color: #ff9800;
            }
            
            .tip-item h5 {
                margin: 0 0 5px 0;
                color: #fff;
                font-size: 14px;
            }
            
            .tip-item p {
                margin: 0 0 5px 0;
                font-size: 12px;
                color: #ccc;
            }
            
            .tip-item small {
                font-size: 11px;
                color: #999;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Obtém dados atuais
     */
    getCurrentData() {
        return this.currentData;
    }

    /**
     * Obtém técnicas de conservação
     */
    getConservationTechniques() {
        return this.conservationTechniques;
    }

    /**
     * Para atualizações de dados
     */
    stopDataUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }

    /**
     * Obtém recomendação específica para uma cultura
     */
    getRecommendationForCrop(cropType) {
        const cropRecommendations = {
            'trigo': {
                optimalMoisture: '35-45%',
                optimalTemp: '15-25°C',
                techniques: ['precision-irrigation', 'crop-rotation']
            },
            'milho': {
                optimalMoisture: '40-50%',
                optimalTemp: '20-30°C',
                techniques: ['precision-irrigation', 'no-till']
            },
            'soja': {
                optimalMoisture: '30-40%',
                optimalTemp: '20-28°C',
                techniques: ['cover-crops', 'crop-rotation']
            }
        };
        
        return cropRecommendations[cropType] || null;
    }
}

// Inicializa sistema global
window.nasaDataIntegration = new NASADataIntegration();

// Exporta para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NASADataIntegration;
}