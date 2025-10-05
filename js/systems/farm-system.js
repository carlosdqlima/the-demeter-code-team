/**
 * Sistema de Fazendas - NASA Farm Navigators
 * Gerencia criação, plantio, colheita e manutenção de fazendas
 */

class FarmSystem {
    constructor() {
        this.farms = new Map();
        this.activeFarm = null;
        this.farmCounter = 0;
        this.isInitialized = false;
        
        // Configurações do sistema
        this.config = {
            maxFarmsPerRegion: 5,
            farmSizeOptions: [
                { name: 'Pequena', size: 100, cost: 1000, multiplier: 1 },
                { name: 'Média', size: 250, cost: 2500, multiplier: 1.2 },
                { name: 'Grande', size: 500, cost: 5000, multiplier: 1.5 }
            ],
            growthStages: ['planted', 'growing', 'mature', 'ready'],
            irrigationCost: 50,
            fertilizationCost: 100
        };
        
        // Estado das fazendas
        this.farmStats = {
            totalFarms: 0,
            totalYield: 0,
            totalRevenue: 0,
            activeCrops: 0
        };
        
        // Bind methods
        this.onFarmCreated = this.onFarmCreated.bind(this);
        this.onCropPlanted = this.onCropPlanted.bind(this);
        this.onCropHarvested = this.onCropHarvested.bind(this);
    }

    /**
     * Inicializa o sistema de fazendas
     */
    async initialize() {
        try {
            console.log('🚜 Inicializando Sistema de Fazendas...');
            
            // Carrega dados salvos
            await this.loadFarmData();
            
            // Configura eventos
            this.setupEventListeners();
            
            this.isInitialized = true;
            console.log('✅ Sistema de Fazendas inicializado com sucesso');
            
            // Dispara evento de inicialização
            this.dispatchEvent('farmSystemInitialized', {
                totalFarms: this.farmStats.totalFarms
            });
            
        } catch (error) {
            console.error('❌ Erro ao inicializar Sistema de Fazendas:', error);
            throw error;
        }
    }

    /**
     * Configura os ouvintes de eventos
     */
    setupEventListeners() {
        // Eventos de fazenda
        document.addEventListener('createFarm', this.onFarmCreated);
        document.addEventListener('plantCrop', this.onCropPlanted);
        document.addEventListener('harvestCrop', this.onCropHarvested);
        
        // Eventos de manutenção
        document.addEventListener('irrigateFarm', (e) => this.irrigateFarm(e.detail.farmId));
        document.addEventListener('fertilizeFarm', (e) => this.fertilizeFarm(e.detail.farmId));
    }

    /**
     * Cria uma nova fazenda
     */
    createFarm(regionId, farmData) {
        try {
            const farmId = `farm_${this.farmCounter++}`;
            
            // Valida dados da fazenda
            if (!this.validateFarmData(farmData)) {
                throw new Error('Dados da fazenda inválidos');
            }
            
            // Verifica limite de fazendas na região
            const regionFarms = this.getFarmsByRegion(regionId);
            if (regionFarms.length >= this.config.maxFarmsPerRegion) {
                throw new Error('Limite de fazendas na região atingido');
            }
            
            // Cria objeto da fazenda
            const farm = {
                id: farmId,
                regionId: regionId,
                name: farmData.name || `Fazenda ${this.farmCounter}`,
                size: farmData.size || this.config.farmSizeOptions[0],
                location: farmData.location,
                crops: new Map(),
                infrastructure: {
                    irrigation: farmData.irrigation || false,
                    fertilization: farmData.fertilization || false,
                    storage: farmData.storage || 100
                },
                stats: {
                    totalYield: 0,
                    totalRevenue: 0,
                    seasonsActive: 0,
                    efficiency: 100
                },
                createdAt: new Date(),
                lastUpdated: new Date()
            };
            
            // Adiciona ao mapa de fazendas
            this.farms.set(farmId, farm);
            this.farmStats.totalFarms++;
            
            console.log(`🚜 Fazenda criada: ${farm.name} (${farmId})`);
            
            // Dispara evento
            this.dispatchEvent('farmCreated', { farm });
            
            return farm;
            
        } catch (error) {
            console.error('❌ Erro ao criar fazenda:', error);
            throw error;
        }
    }

    /**
     * Planta uma cultura em uma fazenda
     */
    plantCrop(farmId, cropType, quantity) {
        try {
            const farm = this.farms.get(farmId);
            if (!farm) {
                throw new Error('Fazenda não encontrada');
            }
            
            // Verifica se há espaço disponível
            const usedSpace = this.getUsedFarmSpace(farmId);
            const requiredSpace = quantity * 10; // 10 unidades por planta
            
            if (usedSpace + requiredSpace > farm.size.size) {
                throw new Error('Espaço insuficiente na fazenda');
            }
            
            // Cria objeto da cultura
            const cropId = `crop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const crop = {
                id: cropId,
                type: cropType,
                quantity: quantity,
                stage: 'planted',
                plantedAt: new Date(),
                expectedHarvest: this.calculateHarvestDate(cropType),
                health: 100,
                yield: 0,
                waterLevel: 100,
                fertilized: false
            };
            
            // Adiciona à fazenda
            farm.crops.set(cropId, crop);
            farm.lastUpdated = new Date();
            this.farmStats.activeCrops += quantity;
            
            console.log(`🌱 Plantado: ${quantity}x ${cropType} na fazenda ${farm.name}`);
            
            // Dispara evento
            this.dispatchEvent('cropPlanted', { farm, crop });
            
            return crop;
            
        } catch (error) {
            console.error('❌ Erro ao plantar cultura:', error);
            throw error;
        }
    }

    /**
     * Colhe uma cultura
     */
    harvestCrop(farmId, cropId) {
        try {
            const farm = this.farms.get(farmId);
            if (!farm) {
                throw new Error('Fazenda não encontrada');
            }
            
            const crop = farm.crops.get(cropId);
            if (!crop) {
                throw new Error('Cultura não encontrada');
            }
            
            if (crop.stage !== 'ready') {
                throw new Error('Cultura não está pronta para colheita');
            }
            
            // Calcula rendimento
            const baseYield = crop.quantity * this.getCropYieldMultiplier(crop.type);
            const healthMultiplier = crop.health / 100;
            const farmMultiplier = farm.size.multiplier;
            
            const finalYield = Math.floor(baseYield * healthMultiplier * farmMultiplier);
            
            // Atualiza estatísticas
            farm.stats.totalYield += finalYield;
            this.farmStats.totalYield += finalYield;
            this.farmStats.activeCrops -= crop.quantity;
            
            // Remove cultura da fazenda
            farm.crops.delete(cropId);
            farm.lastUpdated = new Date();
            
            console.log(`🌾 Colhido: ${finalYield} unidades de ${crop.type}`);
            
            // Dispara evento
            this.dispatchEvent('cropHarvested', { 
                farm, 
                crop, 
                yield: finalYield 
            });
            
            return {
                cropType: crop.type,
                quantity: crop.quantity,
                yield: finalYield,
                quality: crop.health
            };
            
        } catch (error) {
            console.error('❌ Erro ao colher cultura:', error);
            throw error;
        }
    }

    /**
     * Irriga uma fazenda
     */
    irrigateFarm(farmId) {
        try {
            const farm = this.farms.get(farmId);
            if (!farm) {
                throw new Error('Fazenda não encontrada');
            }
            
            // Aplica irrigação a todas as culturas
            farm.crops.forEach(crop => {
                crop.waterLevel = Math.min(100, crop.waterLevel + 30);
                crop.health = Math.min(100, crop.health + 5);
            });
            
            farm.lastUpdated = new Date();
            
            console.log(`💧 Fazenda ${farm.name} irrigada`);
            
            // Dispara evento
            this.dispatchEvent('farmIrrigated', { farm });
            
            return true;
            
        } catch (error) {
            console.error('❌ Erro ao irrigar fazenda:', error);
            throw error;
        }
    }

    /**
     * Fertiliza uma fazenda
     */
    fertilizeFarm(farmId) {
        try {
            const farm = this.farms.get(farmId);
            if (!farm) {
                throw new Error('Fazenda não encontrada');
            }
            
            // Aplica fertilização a todas as culturas
            farm.crops.forEach(crop => {
                if (!crop.fertilized) {
                    crop.fertilized = true;
                    crop.health = Math.min(100, crop.health + 15);
                }
            });
            
            farm.lastUpdated = new Date();
            
            console.log(`🌿 Fazenda ${farm.name} fertilizada`);
            
            // Dispara evento
            this.dispatchEvent('farmFertilized', { farm });
            
            return true;
            
        } catch (error) {
            console.error('❌ Erro ao fertilizar fazenda:', error);
            throw error;
        }
    }

    /**
     * Atualiza o crescimento das culturas
     */
    updateCropGrowth() {
        const now = new Date();
        
        this.farms.forEach(farm => {
            let farmUpdated = false;
            
            farm.crops.forEach(crop => {
                const timeSincePlanted = now - crop.plantedAt;
                const growthProgress = timeSincePlanted / (crop.expectedHarvest - crop.plantedAt);
                
                // Atualiza estágio de crescimento
                const newStage = this.calculateGrowthStage(growthProgress);
                if (newStage !== crop.stage) {
                    crop.stage = newStage;
                    farmUpdated = true;
                }
                
                // Reduz nível de água ao longo do tempo
                crop.waterLevel = Math.max(0, crop.waterLevel - 1);
                
                // Afeta saúde baseado no nível de água
                if (crop.waterLevel < 30) {
                    crop.health = Math.max(0, crop.health - 2);
                } else if (crop.waterLevel > 70) {
                    crop.health = Math.min(100, crop.health + 1);
                }
            });
            
            if (farmUpdated) {
                farm.lastUpdated = now;
            }
        });
    }

    /**
     * Atualiza todas as fazendas (chamado pelo game loop)
     */
    updateFarms() {
        if (!this.isInitialized) return;
        
        try {
            // Atualiza crescimento das culturas
            this.updateCropGrowth();
            
            // Atualiza estatísticas das fazendas
            this.updateFarmStats();
            
            // Salva dados periodicamente
            this.saveFarmData();
            
        } catch (error) {
            console.error('❌ Erro ao atualizar fazendas:', error);
        }
    }

    /**
     * Atualiza estatísticas das fazendas
     */
    updateFarmStats() {
        this.farmStats.totalFarms = this.farms.size;
        this.farmStats.activeCrops = 0;
        this.farmStats.totalYield = 0;
        
        this.farms.forEach(farm => {
            this.farmStats.activeCrops += farm.crops.length;
            farm.crops.forEach(crop => {
                if (crop.stage === 'ready') {
                    this.farmStats.totalYield += crop.expectedYield;
                }
            });
        });
    }

    /**
     * Métodos auxiliares
     */
    
    validateFarmData(farmData) {
        return farmData && 
               farmData.location && 
               farmData.location.lat && 
               farmData.location.lng;
    }
    
    getFarmsByRegion(regionId) {
        return Array.from(this.farms.values()).filter(farm => farm.regionId === regionId);
    }
    
    getUsedFarmSpace(farmId) {
        const farm = this.farms.get(farmId);
        if (!farm) return 0;
        
        let usedSpace = 0;
        farm.crops.forEach(crop => {
            usedSpace += crop.quantity * 10;
        });
        return usedSpace;
    }
    
    calculateHarvestDate(cropType) {
        const cropData = window.cropsData?.find(c => c.name === cropType);
        const growthDays = cropData?.growthTime || 30;
        
        const harvestDate = new Date();
        harvestDate.setDate(harvestDate.getDate() + growthDays);
        return harvestDate;
    }
    
    getCropYieldMultiplier(cropType) {
        const cropData = window.cropsData?.find(c => c.name === cropType);
        return cropData?.yield || 1;
    }
    
    calculateGrowthStage(progress) {
        if (progress < 0.25) return 'planted';
        if (progress < 0.75) return 'growing';
        if (progress < 1.0) return 'mature';
        return 'ready';
    }

    /**
     * Gerenciamento de dados
     */
    
    async loadFarmData() {
        try {
            const savedData = localStorage.getItem('farmSystemData');
            if (savedData) {
                const data = JSON.parse(savedData);
                
                // Restaura fazendas
                if (data.farms) {
                    data.farms.forEach(farmData => {
                        const farm = { ...farmData };
                        farm.crops = new Map(farmData.crops || []);
                        this.farms.set(farm.id, farm);
                    });
                }
                
                // Restaura estatísticas
                if (data.farmStats) {
                    this.farmStats = { ...this.farmStats, ...data.farmStats };
                }
                
                this.farmCounter = data.farmCounter || 0;
                
                console.log(`📊 Carregados dados de ${this.farms.size} fazendas`);
            }
        } catch (error) {
            console.error('❌ Erro ao carregar dados das fazendas:', error);
        }
    }
    
    saveFarmData() {
        try {
            const farmsArray = Array.from(this.farms.values()).map(farm => ({
                ...farm,
                crops: Array.from(farm.crops.entries())
            }));
            
            const dataToSave = {
                farms: farmsArray,
                farmStats: this.farmStats,
                farmCounter: this.farmCounter,
                lastSaved: new Date().toISOString()
            };
            
            localStorage.setItem('farmSystemData', JSON.stringify(dataToSave));
            console.log('💾 Dados das fazendas salvos');
            
        } catch (error) {
            console.error('❌ Erro ao salvar dados das fazendas:', error);
        }
    }

    /**
     * Métodos de consulta
     */
    
    getFarm(farmId) {
        return this.farms.get(farmId);
    }
    
    getAllFarms() {
        return Array.from(this.farms.values());
    }
    
    getFarmStats() {
        return { ...this.farmStats };
    }
    
    getActiveCrops() {
        const activeCrops = [];
        this.farms.forEach(farm => {
            farm.crops.forEach(crop => {
                activeCrops.push({
                    ...crop,
                    farmId: farm.id,
                    farmName: farm.name
                });
            });
        });
        return activeCrops;
    }

    /**
     * Eventos personalizados
     */
    
    onFarmCreated(event) {
        console.log('🎉 Evento: Fazenda criada', event.detail);
    }
    
    onCropPlanted(event) {
        console.log('🌱 Evento: Cultura plantada', event.detail);
    }
    
    onCropHarvested(event) {
        console.log('🌾 Evento: Cultura colhida', event.detail);
    }
    
    dispatchEvent(eventName, data) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }

    /**
     * Limpeza e destruição
     */
    
    destroy() {
        // Salva dados antes de destruir
        this.saveFarmData();
        
        // Remove event listeners
        document.removeEventListener('createFarm', this.onFarmCreated);
        document.removeEventListener('plantCrop', this.onCropPlanted);
        document.removeEventListener('harvestCrop', this.onCropHarvested);
        
        // Limpa dados
        this.farms.clear();
        this.activeFarm = null;
        this.isInitialized = false;
        
        console.log('🧹 Sistema de Fazendas destruído');
    }
}

// Exporta para uso global e módulos
if (typeof window !== 'undefined') {
    window.FarmSystem = FarmSystem;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FarmSystem;
}