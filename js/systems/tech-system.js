/**
 * Sistema de Tecnologia - NASA Farm Navigators
 * Gerencia pesquisa, desenvolvimento e aplicação de tecnologias agrícolas
 */

class TechSystem {
    constructor() {
        this.isInitialized = false;
        this.researchedTechnologies = new Map();
        this.availableTechnologies = new Map();
        this.activeResearch = null;
        this.researchQueue = [];
        
        // Configurações do sistema de tecnologia
        this.config = {
            researchUpdateInterval: 5000, // 5 segundos
            maxActiveResearch: 1,
            maxQueueSize: 5,
            researchSpeedMultiplier: 1.0,
            technologyDecayRate: 0.01 // 1% por dia
        };
        
        // Recursos de pesquisa
        this.researchResources = {
            researchPoints: 100,
            dataPoints: 50,
            funding: 10000,
            scientists: 3,
            equipment: 2
        };
        
        // Categorias de tecnologia
        this.techCategories = {
            agriculture: {
                name: 'Agricultura',
                icon: '🌾',
                description: 'Tecnologias para melhorar produção agrícola'
            },
            irrigation: {
                name: 'Irrigação',
                icon: '💧',
                description: 'Sistemas avançados de irrigação'
            },
            genetics: {
                name: 'Genética',
                icon: '🧬',
                description: 'Melhoramento genético de culturas'
            },
            automation: {
                name: 'Automação',
                icon: '🤖',
                description: 'Automação de processos agrícolas'
            },
            sustainability: {
                name: 'Sustentabilidade',
                icon: '♻️',
                description: 'Práticas agrícolas sustentáveis'
            },
            monitoring: {
                name: 'Monitoramento',
                icon: '📡',
                description: 'Sistemas de monitoramento e sensores'
            }
        };
        
        // Bind methods
        this.updateResearch = this.updateResearch.bind(this);
        this.onTechnologyUnlocked = this.onTechnologyUnlocked.bind(this);
    }

    /**
     * Inicializa o sistema de tecnologia
     */
    async initialize() {
        try {
            console.log('🔬 Inicializando Sistema de Tecnologia...');
            
            // Carrega dados salvos
            await this.loadTechData();
            
            // Inicializa tecnologias disponíveis
            this.initializeTechnologies();
            
            // Configura eventos
            this.setupEventListeners();
            
            // Inicia atualizações de pesquisa
            this.startResearchUpdates();
            
            this.isInitialized = true;
            console.log('✅ Sistema de Tecnologia inicializado com sucesso');
            
            // Dispara evento de inicialização
            this.dispatchEvent('techSystemInitialized', {
                availableTech: this.availableTechnologies.size,
                researchedTech: this.researchedTechnologies.size,
                researchPoints: this.researchResources.researchPoints
            });
            
        } catch (error) {
            console.error('❌ Erro ao inicializar Sistema de Tecnologia:', error);
            throw error;
        }
    }

    /**
     * Inicializa tecnologias disponíveis
     */
    initializeTechnologies() {
        const technologies = [
            // Tecnologias de Agricultura
            {
                id: 'crop_rotation',
                name: 'Rotação de Culturas',
                category: 'agriculture',
                description: 'Melhora a saúde do solo e reduz pragas',
                cost: { researchPoints: 50, funding: 2000 },
                researchTime: 30000, // 30 segundos
                prerequisites: [],
                effects: {
                    soilHealth: 1.2,
                    diseaseResistance: 1.15,
                    yieldBonus: 1.1
                },
                unlocked: false
            },
            {
                id: 'precision_farming',
                name: 'Agricultura de Precisão',
                category: 'agriculture',
                description: 'Uso de GPS e sensores para otimizar plantio',
                cost: { researchPoints: 100, funding: 5000, equipment: 1 },
                researchTime: 60000, // 1 minuto
                prerequisites: ['crop_rotation'],
                effects: {
                    efficiency: 1.3,
                    resourceUsage: 0.8,
                    yieldBonus: 1.25
                },
                unlocked: false
            },
            
            // Tecnologias de Irrigação
            {
                id: 'drip_irrigation',
                name: 'Irrigação por Gotejamento',
                category: 'irrigation',
                description: 'Sistema eficiente de irrigação localizada',
                cost: { researchPoints: 40, funding: 3000 },
                researchTime: 25000,
                prerequisites: [],
                effects: {
                    waterEfficiency: 1.4,
                    waterCost: 0.7,
                    cropGrowth: 1.1
                },
                unlocked: false
            },
            {
                id: 'smart_irrigation',
                name: 'Irrigação Inteligente',
                category: 'irrigation',
                description: 'Sistema automatizado baseado em sensores',
                cost: { researchPoints: 80, funding: 4500, equipment: 1 },
                researchTime: 45000,
                prerequisites: ['drip_irrigation'],
                effects: {
                    waterEfficiency: 1.6,
                    automation: 1.3,
                    laborCost: 0.8
                },
                unlocked: false
            },
            
            // Tecnologias de Genética
            {
                id: 'hybrid_seeds',
                name: 'Sementes Híbridas',
                category: 'genetics',
                description: 'Sementes com características melhoradas',
                cost: { researchPoints: 60, funding: 3500, dataPoints: 20 },
                researchTime: 40000,
                prerequisites: [],
                effects: {
                    yieldBonus: 1.3,
                    diseaseResistance: 1.2,
                    growthSpeed: 1.15
                },
                unlocked: false
            },
            {
                id: 'gmo_crops',
                name: 'Culturas Geneticamente Modificadas',
                category: 'genetics',
                description: 'Culturas resistentes a pragas e herbicidas',
                cost: { researchPoints: 120, funding: 8000, dataPoints: 40 },
                researchTime: 90000,
                prerequisites: ['hybrid_seeds'],
                effects: {
                    yieldBonus: 1.5,
                    pestResistance: 1.8,
                    herbicideResistance: 1.6
                },
                unlocked: false
            },
            
            // Tecnologias de Automação
            {
                id: 'automated_planting',
                name: 'Plantio Automatizado',
                category: 'automation',
                description: 'Máquinas autônomas para plantio',
                cost: { researchPoints: 90, funding: 6000, equipment: 2 },
                researchTime: 50000,
                prerequisites: [],
                effects: {
                    plantingSpeed: 2.0,
                    laborCost: 0.6,
                    precision: 1.3
                },
                unlocked: false
            },
            {
                id: 'robotic_harvesting',
                name: 'Colheita Robótica',
                category: 'automation',
                description: 'Robôs para colheita automatizada',
                cost: { researchPoints: 150, funding: 10000, equipment: 3 },
                researchTime: 120000,
                prerequisites: ['automated_planting'],
                effects: {
                    harvestSpeed: 2.5,
                    laborCost: 0.4,
                    cropLoss: 0.7
                },
                unlocked: false
            },
            
            // Tecnologias de Sustentabilidade
            {
                id: 'organic_farming',
                name: 'Agricultura Orgânica',
                category: 'sustainability',
                description: 'Práticas agrícolas sem químicos sintéticos',
                cost: { researchPoints: 45, funding: 2500 },
                researchTime: 35000,
                prerequisites: [],
                effects: {
                    soilHealth: 1.4,
                    marketPrice: 1.3,
                    chemicalCost: 0.0
                },
                unlocked: false
            },
            {
                id: 'renewable_energy',
                name: 'Energia Renovável',
                category: 'sustainability',
                description: 'Uso de energia solar e eólica na fazenda',
                cost: { researchPoints: 70, funding: 5500, equipment: 2 },
                researchTime: 55000,
                prerequisites: ['organic_farming'],
                effects: {
                    energyCost: 0.3,
                    carbonFootprint: 0.2,
                    sustainability: 1.8
                },
                unlocked: false
            },
            
            // Tecnologias de Monitoramento
            {
                id: 'soil_sensors',
                name: 'Sensores de Solo',
                category: 'monitoring',
                description: 'Monitoramento em tempo real do solo',
                cost: { researchPoints: 55, funding: 3000, equipment: 1 },
                researchTime: 30000,
                prerequisites: [],
                effects: {
                    soilMonitoring: 1.5,
                    fertilizer_efficiency: 1.3,
                    waterOptimization: 1.2
                },
                unlocked: false
            },
            {
                id: 'satellite_monitoring',
                name: 'Monitoramento por Satélite',
                category: 'monitoring',
                description: 'Análise de culturas via imagens de satélite',
                cost: { researchPoints: 100, funding: 7000, dataPoints: 30 },
                researchTime: 75000,
                prerequisites: ['soil_sensors'],
                effects: {
                    cropMonitoring: 2.0,
                    diseaseDetection: 1.8,
                    yieldPrediction: 1.6
                },
                unlocked: false
            }
        ];
        
        // Adiciona tecnologias ao mapa
        technologies.forEach(tech => {
            this.availableTechnologies.set(tech.id, tech);
        });
        
        console.log(`🔬 ${technologies.length} tecnologias inicializadas`);
    }

    /**
     * Configura os ouvintes de eventos
     */
    setupEventListeners() {
        // Eventos de pesquisa
        document.addEventListener('startResearch', (e) => this.startResearch(e.detail));
        document.addEventListener('cancelResearch', (e) => this.cancelResearch(e.detail));
        document.addEventListener('addToResearchQueue', (e) => this.addToQueue(e.detail));
        
        // Eventos de recursos
        document.addEventListener('addResearchPoints', (e) => this.addResearchPoints(e.detail));
        document.addEventListener('upgradeLab', (e) => this.upgradeLab(e.detail));
    }

    /**
     * Inicia atualizações de pesquisa
     */
    startResearchUpdates() {
        this.researchUpdateTimer = setInterval(() => {
            this.updateResearch();
        }, this.config.researchUpdateInterval);
        
        console.log('🔬 Atualizações de pesquisa iniciadas');
    }

    /**
     * Atualiza progresso da pesquisa
     */
    updateResearch() {
        if (!this.activeResearch) {
            this.processResearchQueue();
            return;
        }
        
        const research = this.activeResearch;
        const progressIncrement = this.calculateResearchProgress();
        
        research.progress += progressIncrement;
        research.timeRemaining = Math.max(0, research.timeRemaining - this.config.researchUpdateInterval);
        
        // Verifica se a pesquisa foi concluída
        if (research.progress >= 100 || research.timeRemaining <= 0) {
            this.completeResearch(research);
        }
        
        // Dispara evento de progresso
        this.dispatchEvent('researchProgress', {
            research: research,
            progress: research.progress,
            timeRemaining: research.timeRemaining
        });
    }

    /**
     * Inicia uma nova pesquisa
     */
    startResearch(researchData) {
        try {
            const { technologyId } = researchData;
            const technology = this.availableTechnologies.get(technologyId);
            
            if (!technology) {
                throw new Error(`Tecnologia ${technologyId} não encontrada`);
            }
            
            if (technology.unlocked) {
                throw new Error('Tecnologia já pesquisada');
            }
            
            if (!this.checkPrerequisites(technology)) {
                throw new Error('Pré-requisitos não atendidos');
            }
            
            if (!this.checkResearchCost(technology)) {
                throw new Error('Recursos insuficientes');
            }
            
            if (this.activeResearch) {
                throw new Error('Já existe uma pesquisa ativa');
            }
            
            // Consome recursos
            this.consumeResearchCost(technology);
            
            // Inicia pesquisa
            this.activeResearch = {
                technologyId: technologyId,
                technology: technology,
                progress: 0,
                timeRemaining: technology.researchTime,
                startTime: new Date()
            };
            
            console.log(`🔬 Pesquisa iniciada: ${technology.name}`);
            
            // Dispara evento
            this.dispatchEvent('researchStarted', {
                technology: technology,
                estimatedTime: technology.researchTime
            });
            
            return this.activeResearch;
            
        } catch (error) {
            console.error('❌ Erro ao iniciar pesquisa:', error);
            throw error;
        }
    }

    /**
     * Completa uma pesquisa
     */
    completeResearch(research) {
        const technology = research.technology;
        
        // Marca tecnologia como desbloqueada
        technology.unlocked = true;
        technology.unlockedAt = new Date();
        
        // Adiciona aos pesquisados
        this.researchedTechnologies.set(technology.id, technology);
        
        // Aplica efeitos da tecnologia
        this.applyTechnologyEffects(technology);
        
        // Limpa pesquisa ativa
        this.activeResearch = null;
        
        console.log(`✅ Pesquisa concluída: ${technology.name}`);
        
        // Dispara eventos
        this.dispatchEvent('researchCompleted', { technology });
        this.dispatchEvent('technologyUnlocked', { technology });
        
        // Processa próxima pesquisa na fila
        this.processResearchQueue();
    }

    /**
     * Cancela pesquisa ativa
     */
    cancelResearch() {
        if (!this.activeResearch) {
            throw new Error('Nenhuma pesquisa ativa');
        }
        
        const research = this.activeResearch;
        
        // Retorna parte dos recursos (50%)
        this.refundResearchCost(research.technology, 0.5);
        
        console.log(`❌ Pesquisa cancelada: ${research.technology.name}`);
        
        // Dispara evento
        this.dispatchEvent('researchCancelled', { technology: research.technology });
        
        // Limpa pesquisa ativa
        this.activeResearch = null;
        
        // Processa próxima pesquisa na fila
        this.processResearchQueue();
    }

    /**
     * Adiciona pesquisa à fila
     */
    addToQueue(queueData) {
        try {
            const { technologyId } = queueData;
            const technology = this.availableTechnologies.get(technologyId);
            
            if (!technology) {
                throw new Error(`Tecnologia ${technologyId} não encontrada`);
            }
            
            if (technology.unlocked) {
                throw new Error('Tecnologia já pesquisada');
            }
            
            if (this.researchQueue.length >= this.config.maxQueueSize) {
                throw new Error('Fila de pesquisa cheia');
            }
            
            if (this.researchQueue.find(item => item.technologyId === technologyId)) {
                throw new Error('Tecnologia já está na fila');
            }
            
            // Adiciona à fila
            this.researchQueue.push({
                technologyId: technologyId,
                technology: technology,
                addedAt: new Date()
            });
            
            console.log(`📋 Adicionado à fila: ${technology.name}`);
            
            // Dispara evento
            this.dispatchEvent('researchQueued', { technology });
            
            return this.researchQueue;
            
        } catch (error) {
            console.error('❌ Erro ao adicionar à fila:', error);
            throw error;
        }
    }

    /**
     * Processa fila de pesquisa
     */
    processResearchQueue() {
        if (this.activeResearch || this.researchQueue.length === 0) {
            return;
        }
        
        const nextResearch = this.researchQueue.shift();
        
        try {
            this.startResearch({ technologyId: nextResearch.technologyId });
        } catch (error) {
            console.error('❌ Erro ao processar fila de pesquisa:', error);
            // Se falhar, tenta o próximo da fila
            this.processResearchQueue();
        }
    }

    /**
     * Métodos auxiliares de pesquisa
     */
    
    calculateResearchProgress() {
        const baseProgress = (this.config.researchUpdateInterval / this.activeResearch.technology.researchTime) * 100;
        const speedMultiplier = this.config.researchSpeedMultiplier;
        const scientistBonus = 1 + (this.researchResources.scientists * 0.1);
        const equipmentBonus = 1 + (this.researchResources.equipment * 0.05);
        
        return baseProgress * speedMultiplier * scientistBonus * equipmentBonus;
    }
    
    checkPrerequisites(technology) {
        return technology.prerequisites.every(prereqId => {
            const prereq = this.availableTechnologies.get(prereqId);
            return prereq && prereq.unlocked;
        });
    }
    
    checkResearchCost(technology) {
        const cost = technology.cost;
        
        return (
            this.researchResources.researchPoints >= (cost.researchPoints || 0) &&
            this.researchResources.dataPoints >= (cost.dataPoints || 0) &&
            this.researchResources.funding >= (cost.funding || 0) &&
            this.researchResources.equipment >= (cost.equipment || 0)
        );
    }
    
    consumeResearchCost(technology) {
        const cost = technology.cost;
        
        this.researchResources.researchPoints -= (cost.researchPoints || 0);
        this.researchResources.dataPoints -= (cost.dataPoints || 0);
        this.researchResources.funding -= (cost.funding || 0);
        this.researchResources.equipment -= (cost.equipment || 0);
        
        // Dispara evento de atualização de recursos
        this.dispatchEvent('researchResourcesUpdated', {
            resources: this.researchResources
        });
    }
    
    refundResearchCost(technology, refundRate = 1.0) {
        const cost = technology.cost;
        
        this.researchResources.researchPoints += Math.floor((cost.researchPoints || 0) * refundRate);
        this.researchResources.dataPoints += Math.floor((cost.dataPoints || 0) * refundRate);
        this.researchResources.funding += Math.floor((cost.funding || 0) * refundRate);
        this.researchResources.equipment += Math.floor((cost.equipment || 0) * refundRate);
        
        // Dispara evento de atualização de recursos
        this.dispatchEvent('researchResourcesUpdated', {
            resources: this.researchResources
        });
    }

    /**
     * Aplica efeitos da tecnologia
     */
    applyTechnologyEffects(technology) {
        // Os efeitos são aplicados através de eventos para outros sistemas
        this.dispatchEvent('technologyEffectsApplied', {
            technology: technology,
            effects: technology.effects
        });
        
        console.log(`⚡ Efeitos aplicados: ${technology.name}`, technology.effects);
    }

    /**
     * Métodos de consulta
     */
    
    getAvailableTechnologies(category = null) {
        let technologies = Array.from(this.availableTechnologies.values());
        
        if (category) {
            technologies = technologies.filter(tech => tech.category === category);
        }
        
        return technologies.map(tech => ({
            ...tech,
            canResearch: this.canResearch(tech),
            prerequisitesMet: this.checkPrerequisites(tech),
            costAffordable: this.checkResearchCost(tech)
        }));
    }
    
    getResearchedTechnologies(category = null) {
        let technologies = Array.from(this.researchedTechnologies.values());
        
        if (category) {
            technologies = technologies.filter(tech => tech.category === category);
        }
        
        return technologies;
    }
    
    canResearch(technology) {
        return (
            !technology.unlocked &&
            this.checkPrerequisites(technology) &&
            this.checkResearchCost(technology) &&
            !this.activeResearch &&
            !this.researchQueue.find(item => item.technologyId === technology.id)
        );
    }
    
    getResearchStatus() {
        return {
            activeResearch: this.activeResearch,
            researchQueue: this.researchQueue,
            resources: this.researchResources,
            totalTechnologies: this.availableTechnologies.size,
            researchedCount: this.researchedTechnologies.size,
            availableCount: this.availableTechnologies.size - this.researchedTechnologies.size
        };
    }
    
    getTechnologyTree() {
        const tree = {};
        
        Object.keys(this.techCategories).forEach(category => {
            tree[category] = {
                ...this.techCategories[category],
                technologies: this.getAvailableTechnologies(category)
            };
        });
        
        return tree;
    }

    /**
     * Gerenciamento de recursos
     */
    
    addResearchPoints(amount) {
        this.researchResources.researchPoints += amount;
        
        console.log(`🔬 +${amount} pontos de pesquisa`);
        
        this.dispatchEvent('researchResourcesUpdated', {
            resources: this.researchResources,
            change: { researchPoints: amount }
        });
    }
    
    addDataPoints(amount) {
        this.researchResources.dataPoints += amount;
        
        console.log(`📊 +${amount} pontos de dados`);
        
        this.dispatchEvent('researchResourcesUpdated', {
            resources: this.researchResources,
            change: { dataPoints: amount }
        });
    }
    
    addFunding(amount) {
        this.researchResources.funding += amount;
        
        console.log(`💰 +$${amount} financiamento`);
        
        this.dispatchEvent('researchResourcesUpdated', {
            resources: this.researchResources,
            change: { funding: amount }
        });
    }
    
    upgradeLab(upgradeData) {
        const { upgradeType, cost } = upgradeData;
        
        if (this.researchResources.funding < cost) {
            throw new Error('Financiamento insuficiente');
        }
        
        this.researchResources.funding -= cost;
        
        switch (upgradeType) {
            case 'scientist':
                this.researchResources.scientists++;
                console.log('👨‍🔬 Cientista contratado');
                break;
            case 'equipment':
                this.researchResources.equipment++;
                console.log('🔬 Equipamento adquirido');
                break;
            case 'speed':
                this.config.researchSpeedMultiplier += 0.1;
                console.log('⚡ Velocidade de pesquisa aumentada');
                break;
        }
        
        this.dispatchEvent('labUpgraded', {
            upgradeType: upgradeType,
            resources: this.researchResources
        });
    }

    /**
     * Eventos
     */
    
    onTechnologyUnlocked(event) {
        console.log('🔓 Evento: Tecnologia desbloqueada', event.detail);
    }
    
    dispatchEvent(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }

    /**
     * Gerenciamento de dados
     */
    
    async loadTechData() {
        try {
            const savedData = localStorage.getItem('techSystemData');
            if (savedData) {
                const data = JSON.parse(savedData);
                
                // Restaura recursos
                if (data.researchResources) {
                    this.researchResources = { ...this.researchResources, ...data.researchResources };
                }
                
                // Restaura configurações
                if (data.config) {
                    this.config = { ...this.config, ...data.config };
                }
                
                // Restaura pesquisa ativa
                if (data.activeResearch) {
                    this.activeResearch = data.activeResearch;
                }
                
                // Restaura fila de pesquisa
                if (data.researchQueue) {
                    this.researchQueue = data.researchQueue;
                }
                
                // Restaura tecnologias pesquisadas
                if (data.researchedTechnologies) {
                    data.researchedTechnologies.forEach(tech => {
                        this.researchedTechnologies.set(tech.id, tech);
                    });
                }
                
                console.log(`💾 Carregados dados de tecnologia: ${this.researchedTechnologies.size} pesquisadas`);
            }
        } catch (error) {
            console.error('❌ Erro ao carregar dados de tecnologia:', error);
        }
    }
    
    saveTechData() {
        try {
            const dataToSave = {
                researchResources: this.researchResources,
                config: this.config,
                activeResearch: this.activeResearch,
                researchQueue: this.researchQueue,
                researchedTechnologies: Array.from(this.researchedTechnologies.values()),
                lastSaved: new Date().toISOString()
            };
            
            localStorage.setItem('techSystemData', JSON.stringify(dataToSave));
            console.log('💾 Dados de tecnologia salvos');
            
        } catch (error) {
            console.error('❌ Erro ao salvar dados de tecnologia:', error);
        }
    }

    /**
     * Limpeza e destruição
     */
    
    destroy() {
        // Salva dados antes de destruir
        this.saveTechData();
        
        // Para atualizações de pesquisa
        if (this.researchUpdateTimer) {
            clearInterval(this.researchUpdateTimer);
        }
        
        // Remove event listeners
        document.removeEventListener('startResearch', this.startResearch);
        document.removeEventListener('cancelResearch', this.cancelResearch);
        document.removeEventListener('addToResearchQueue', this.addToQueue);
        document.removeEventListener('addResearchPoints', this.addResearchPoints);
        document.removeEventListener('upgradeLab', this.upgradeLab);
        
        // Limpa dados
        this.availableTechnologies.clear();
        this.researchedTechnologies.clear();
        this.activeResearch = null;
        this.researchQueue = [];
        this.isInitialized = false;
        
        console.log('🧹 Sistema de Tecnologia destruído');
    }
}

// Exporta para uso global e módulos
if (typeof window !== 'undefined') {
    window.TechSystem = TechSystem;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TechSystem;
}