/**
 * Sistema de Tomada de Decisões Agrícolas
 * Analisa dados da NASA e fornece recomendações para atividades agrícolas
 */
class AgricultureDecisionEngine {
    constructor() {
        this.decisionRules = {
            irrigation: {
                condition: (data) => data.soilMoisture < 30,
                urgency: (data) => data.soilMoisture < 20 ? 'alta' : 'média',
                recommendation: 'Irrigação recomendada - Solo com baixa umidade detectada',
                action: 'Ativar sistema de irrigação por gotejamento'
            },
            fertilization: {
                condition: (data) => data.vegetationIndex < 0.4,
                urgency: (data) => data.vegetationIndex < 0.3 ? 'alta' : 'média',
                recommendation: 'Fertilização necessária - Índice de vegetação baixo',
                action: 'Aplicar fertilizante orgânico baseado em análise do solo'
            },
            planting: {
                condition: (data) => data.precipitation > 20 && data.soilTemperature > 15,
                urgency: () => 'baixa',
                recommendation: 'Condições ideais para plantio detectadas',
                action: 'Iniciar plantio das culturas selecionadas'
            },
            harvest: {
                condition: (data) => data.vegetationIndex > 0.7 && data.soilMoisture < 40,
                urgency: () => 'média',
                recommendation: 'Condições favoráveis para colheita',
                action: 'Programar colheita nos próximos dias'
            },
            pestControl: {
                condition: (data) => data.soilTemperature > 25 && data.soilMoisture > 60,
                urgency: () => 'média',
                recommendation: 'Condições favoráveis para pragas - Monitoramento necessário',
                action: 'Implementar controle biológico preventivo'
            }
        };

        this.sustainabilityMetrics = {
            waterEfficiency: 0,
            soilHealth: 0,
            carbonSequestration: 0,
            biodiversity: 0,
            energyUse: 0
        };

        this.currentRecommendations = [];
    }

    /**
     * Analisa dados da NASA e gera recomendações
     * @param {Object} nasaData - Dados da NASA
     * @returns {Array} Lista de recomendações
     */
    analyzeAndRecommend(nasaData) {
        this.currentRecommendations = [];

        // Analisa cada regra de decisão
        for (const [activity, rule] of Object.entries(this.decisionRules)) {
            if (rule.condition(nasaData)) {
                const recommendation = {
                    activity: activity,
                    urgency: rule.urgency(nasaData),
                    message: rule.recommendation,
                    action: rule.action,
                    dataSource: this.getDataSource(activity),
                    impact: this.calculateImpact(activity, nasaData),
                    timestamp: new Date()
                };

                this.currentRecommendations.push(recommendation);
            }
        }

        // Calcula métricas de sustentabilidade
        this.updateSustainabilityMetrics(nasaData);

        return this.currentRecommendations;
    }

    /**
     * Calcula o impacto esperado de uma atividade
     * @param {string} activity - Tipo de atividade
     * @param {Object} data - Dados atuais
     * @returns {Object} Impacto esperado
     */
    calculateImpact(activity, data) {
        const impacts = {
            irrigation: {
                soilMoisture: '+40%',
                waterUse: '+15L/m²',
                sustainability: 85,
                cost: 50
            },
            fertilization: {
                vegetationIndex: '+25%',
                soilHealth: '+20%',
                sustainability: 70,
                cost: 75
            },
            planting: {
                productivity: '+30%',
                soilCover: '+100%',
                sustainability: 95,
                cost: 100
            },
            harvest: {
                yield: 'Máximo',
                quality: '+15%',
                sustainability: 90,
                cost: 80
            },
            pestControl: {
                pestReduction: '70%',
                chemicalUse: '-50%',
                sustainability: 85,
                cost: 40
            }
        };

        return impacts[activity] || {};
    }

    /**
     * Identifica a fonte de dados NASA para cada atividade
     * @param {string} activity - Tipo de atividade
     * @returns {string} Fonte de dados
     */
    getDataSource(activity) {
        const sources = {
            irrigation: 'SMAP - Soil Moisture Active Passive',
            fertilization: 'MODIS - Vegetation Index (NDVI)',
            planting: 'GPM - Global Precipitation Measurement',
            harvest: 'MODIS - Land Surface Temperature',
            pestControl: 'MODIS - Temperature & Humidity'
        };

        return sources[activity] || 'NASA Earth Data';
    }

    /**
     * Atualiza métricas de sustentabilidade
     * @param {Object} data - Dados da NASA
     */
    updateSustainabilityMetrics(data) {
        // Calcula eficiência hídrica baseada na umidade do solo
        this.sustainabilityMetrics.waterEfficiency = Math.min(100, 
            (data.soilMoisture / 50) * 100);

        // Calcula saúde do solo baseada no índice de vegetação
        this.sustainabilityMetrics.soilHealth = Math.min(100, 
            (data.vegetationIndex / 0.8) * 100);

        // Calcula sequestro de carbono baseado na cobertura vegetal
        this.sustainabilityMetrics.carbonSequestration = Math.min(100, 
            (data.vegetationIndex * 125));

        // Calcula biodiversidade baseada na variação dos dados
        this.sustainabilityMetrics.biodiversity = Math.min(100, 
            ((data.vegetationIndex + data.soilMoisture / 100) / 2) * 100);

        // Calcula uso de energia baseado na eficiência das práticas
        this.sustainabilityMetrics.energyUse = Math.max(0, 
            100 - (this.currentRecommendations.length * 10));
    }

    /**
     * Gera relatório de sustentabilidade
     * @returns {Object} Relatório de sustentabilidade
     */
    generateSustainabilityReport() {
        const averageScore = Object.values(this.sustainabilityMetrics)
            .reduce((sum, value) => sum + value, 0) / 
            Object.keys(this.sustainabilityMetrics).length;

        return {
            overallScore: Math.round(averageScore),
            metrics: this.sustainabilityMetrics,
            recommendations: this.currentRecommendations,
            improvements: this.suggestImprovements(),
            timestamp: new Date()
        };
    }

    /**
     * Sugere melhorias baseadas nas métricas atuais
     * @returns {Array} Lista de sugestões
     */
    suggestImprovements() {
        const suggestions = [];

        if (this.sustainabilityMetrics.waterEfficiency < 70) {
            suggestions.push({
                area: 'Eficiência Hídrica',
                suggestion: 'Implementar irrigação por gotejamento',
                impact: 'Redução de 30-50% no uso de água'
            });
        }

        if (this.sustainabilityMetrics.soilHealth < 60) {
            suggestions.push({
                area: 'Saúde do Solo',
                suggestion: 'Adicionar culturas de cobertura',
                impact: 'Melhoria de 40% na estrutura do solo'
            });
        }

        if (this.sustainabilityMetrics.carbonSequestration < 50) {
            suggestions.push({
                area: 'Sequestro de Carbono',
                suggestion: 'Implementar agrofloresta',
                impact: 'Aumento de 60% no sequestro de carbono'
            });
        }

        return suggestions;
    }

    /**
     * Simula execução de uma atividade agrícola
     * @param {string} activity - Tipo de atividade
     * @param {Object} currentData - Dados atuais
     * @returns {Object} Dados atualizados após a atividade
     */
    simulateActivity(activity, currentData) {
        const updatedData = { ...currentData };

        switch (activity) {
            case 'irrigation':
                updatedData.soilMoisture = Math.min(100, updatedData.soilMoisture + 40);
                break;
            case 'fertilization':
                updatedData.vegetationIndex = Math.min(1.0, updatedData.vegetationIndex + 0.25);
                break;
            case 'planting':
                updatedData.vegetationIndex = Math.min(1.0, updatedData.vegetationIndex + 0.15);
                updatedData.soilMoisture = Math.max(0, updatedData.soilMoisture - 10);
                break;
            case 'harvest':
                updatedData.vegetationIndex = Math.max(0, updatedData.vegetationIndex - 0.3);
                break;
            case 'pestControl':
                // Mantém os valores atuais, mas melhora a saúde geral
                updatedData.vegetationIndex = Math.min(1.0, updatedData.vegetationIndex + 0.05);
                break;
        }

        return updatedData;
    }

    /**
     * Obtém recomendações atuais
     * @returns {Array} Lista de recomendações
     */
    getCurrentRecommendations() {
        return this.currentRecommendations;
    }

    /**
     * Obtém métricas de sustentabilidade
     * @returns {Object} Métricas de sustentabilidade
     */
    getSustainabilityMetrics() {
        return this.sustainabilityMetrics;
    }
}

// Export para uso como módulo ES6
export { AgricultureDecisionEngine };