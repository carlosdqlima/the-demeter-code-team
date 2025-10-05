/**
 * Sistema de Persistência de Fazendas
 * Gerencia salvamento e carregamento do estado das fazendas
 */

class FarmPersistence {
    constructor() {
        this.storageKey = 'nasa_farm_navigators_farms';
        this.autoSaveInterval = 30000; // 30 segundos
        this.autoSaveTimer = null;
        this.isEnabled = true;
        
        this.initializePersistence();
    }

    /**
     * Inicializa o sistema de persistência
     */
    initializePersistence() {
        try {
            // Verifica se localStorage está disponível
            this.checkLocalStorageSupport();
            
            // Inicia auto-save
            this.startAutoSave();
            
            // Configura eventos de salvamento
            this.setupSaveEvents();
            
            console.log('💾 Sistema de persistência de fazendas inicializado');
            
        } catch (error) {
            console.warn('⚠️ Sistema de persistência desabilitado:', error.message);
            this.isEnabled = false;
        }
    }

    /**
     * Verifica suporte ao localStorage
     */
    checkLocalStorageSupport() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            throw new Error('localStorage não disponível');
        }
    }

    /**
     * Configura eventos de salvamento automático
     */
    setupSaveEvents() {
        // Salva antes de fechar a página
        window.addEventListener('beforeunload', () => {
            this.saveGameState();
        });
        
        // Salva quando a página perde foco
        window.addEventListener('blur', () => {
            this.saveGameState();
        });
        
        // Salva quando a aba fica oculta
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveGameState();
            }
        });
    }

    /**
     * Inicia salvamento automático
     */
    startAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
        }
        
        this.autoSaveTimer = setInterval(() => {
            this.saveGameState();
        }, this.autoSaveInterval);
    }

    /**
     * Para salvamento automático
     */
    stopAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
        }
    }

    /**
     * Salva estado completo do jogo
     */
    saveGameState() {
        if (!this.isEnabled) return false;
        
        try {
            const gameState = this.collectGameState();
            const serializedState = JSON.stringify(gameState);
            
            localStorage.setItem(this.storageKey, serializedState);
            
            // Salva timestamp
            localStorage.setItem(this.storageKey + '_timestamp', Date.now().toString());
            
            console.log('💾 Estado do jogo salvo automaticamente');
            return true;
            
        } catch (error) {
            console.error('❌ Erro ao salvar estado do jogo:', error);
            return false;
        }
    }

    /**
     * Carrega estado do jogo
     */
    loadGameState() {
        if (!this.isEnabled) return null;
        
        try {
            const serializedState = localStorage.getItem(this.storageKey);
            
            if (!serializedState) {
                console.log('📂 Nenhum estado salvo encontrado');
                return null;
            }
            
            const gameState = JSON.parse(serializedState);
            const timestamp = localStorage.getItem(this.storageKey + '_timestamp');
            
            // Valida estrutura do estado
            if (!this.validateGameState(gameState)) {
                console.warn('⚠️ Estado salvo inválido, ignorando');
                return null;
            }
            
            console.log('📂 Estado do jogo carregado:', {
                farms: gameState.farms?.length || 0,
                savedAt: timestamp ? new Date(parseInt(timestamp)).toLocaleString() : 'Desconhecido'
            });
            
            return gameState;
            
        } catch (error) {
            console.error('❌ Erro ao carregar estado do jogo:', error);
            return null;
        }
    }

    /**
     * Coleta estado atual do jogo
     */
    collectGameState() {
        const state = {
            version: '1.0.0',
            timestamp: Date.now(),
            farms: [],
            territories: {},
            player: {
                resources: {},
                achievements: [],
                settings: {}
            }
        };

        // Coleta dados das fazendas visuais
        if (window.farmIntegration?.visualFarmSystem) {
            const visualSystem = window.farmIntegration.visualFarmSystem;
            const farmsData = visualSystem.farms instanceof Map ? 
                Array.from(visualSystem.farms.values()) : 
                (Array.isArray(visualSystem.farms) ? visualSystem.farms : []);
            state.farms = this.serializeFarms(farmsData);
        }

        // Coleta dados dos territórios
        if (window.farmIntegration?.selectedTerritory) {
            state.selectedTerritory = window.farmIntegration.selectedTerritory;
        }

        // Coleta dados do sistema principal
        if (window.farmSystem) {
            state.farmSystemData = this.serializeFarmSystem(window.farmSystem);
        }

        return state;
    }

    /**
     * Serializa fazendas para salvamento
     */
    serializeFarms(farms) {
        if (!Array.isArray(farms)) {
            console.warn('⚠️ serializeFarms: farms não é um array:', farms);
            return [];
        }
        
        return farms.map(farm => {
            if (!farm || typeof farm !== 'object') {
                console.warn('⚠️ Farm inválida:', farm);
                return null;
            }
            
            return {
                id: farm.id,
                name: farm.name,
                territory: farm.territory,
                plots: Array.isArray(farm.plots) ? farm.plots.map(plot => ({
                id: plot.id,
                x: plot.x,
                y: plot.y,
                crop: plot.crop ? {
                    type: plot.crop.type,
                    plantedAt: plot.crop.plantedAt,
                    growthStage: plot.crop.growthStage,
                    health: plot.crop.health,
                    waterLevel: plot.crop.waterLevel
                } : null,
                soilQuality: plot.soilQuality,
                waterLevel: plot.waterLevel,
                isUnlocked: plot.isUnlocked,
                lastWatered: plot.lastWatered,
                lastFertilized: plot.lastFertilized
            })) : [],
                resources: farm.resources,
                statistics: farm.statistics,
                upgrades: farm.upgrades || []
            };
        }).filter(farm => farm !== null);
    }

    /**
     * Serializa sistema principal de fazendas
     */
    serializeFarmSystem(farmSystem) {
        let farmsData = {};
        
        if (farmSystem.farms) {
            if (farmSystem.farms instanceof Map) {
                // Converte Map para objeto
                farmsData = Object.fromEntries(farmSystem.farms);
            } else if (Array.isArray(farmSystem.farms)) {
                // Converte array para objeto usando ID como chave
                farmsData = farmSystem.farms.reduce((acc, farm) => {
                    if (farm && farm.id) {
                        acc[farm.id] = farm;
                    }
                    return acc;
                }, {});
            } else if (typeof farmSystem.farms === 'object') {
                farmsData = farmSystem.farms;
            }
        }
        
        return {
            farms: farmsData,
            activeFarm: farmSystem.activeFarm,
            farmCounter: farmSystem.farmCounter,
            farmStats: farmSystem.farmStats
        };
    }

    /**
     * Valida estrutura do estado salvo
     */
    validateGameState(state) {
        if (!state || typeof state !== 'object') return false;
        if (!state.version || !state.timestamp) return false;
        if (!Array.isArray(state.farms)) return false;
        
        return true;
    }

    /**
     * Restaura estado do jogo
     */
    restoreGameState(gameState) {
        if (!gameState || !this.validateGameState(gameState)) {
            console.warn('⚠️ Estado inválido, não é possível restaurar');
            return false;
        }

        try {
            // Restaura fazendas visuais
            if (gameState.farms && window.farmIntegration?.visualFarmSystem) {
                this.restoreFarms(gameState.farms);
            }

            // Restaura território selecionado
            if (gameState.selectedTerritory && window.farmIntegration) {
                window.farmIntegration.setSelectedTerritory(gameState.selectedTerritory);
            }

            // Restaura sistema principal
            if (gameState.farmSystemData && window.farmSystem) {
                this.restoreFarmSystem(gameState.farmSystemData);
            }

            console.log('✅ Estado do jogo restaurado com sucesso');
            return true;

        } catch (error) {
            console.error('❌ Erro ao restaurar estado do jogo:', error);
            return false;
        }
    }

    /**
     * Restaura fazendas visuais
     */
    restoreFarms(farmsData) {
        const visualSystem = window.farmIntegration.visualFarmSystem;
        
        farmsData.forEach(farmData => {
            // Cria fazenda visual
            const farm = visualSystem.createFarm(farmData.id, farmData.name, farmData.territory);
            
            // Restaura plots
            farmData.plots.forEach(plotData => {
                const plot = farm.getPlot(plotData.x, plotData.y);
                if (plot) {
                    plot.soilQuality = plotData.soilQuality;
                    plot.waterLevel = plotData.waterLevel;
                    plot.isUnlocked = plotData.isUnlocked;
                    plot.lastWatered = plotData.lastWatered;
                    plot.lastFertilized = plotData.lastFertilized;
                    
                    // Restaura cultura se existir
                    if (plotData.crop) {
                        const cropData = plotData.crop;
                        plot.plantCrop(cropData.type);
                        
                        if (plot.crop) {
                            plot.crop.plantedAt = cropData.plantedAt;
                            plot.crop.growthStage = cropData.growthStage;
                            plot.crop.health = cropData.health;
                            plot.crop.waterLevel = cropData.waterLevel;
                        }
                    }
                }
            });
            
            // Restaura recursos
            if (farmData.resources) {
                farm.resources = { ...farmData.resources };
            }
            
            // Restaura estatísticas
            if (farmData.statistics) {
                farm.statistics = { ...farmData.statistics };
            }
        });
    }

    /**
     * Restaura sistema principal de fazendas
     */
    restoreFarmSystem(farmSystemData) {
        const farmSystem = window.farmSystem;
        
        if (farmSystemData.farms) {
            farmSystem.farms = farmSystemData.farms;
        }
        
        if (farmSystemData.activeFarm) {
            farmSystem.activeFarm = farmSystemData.activeFarm;
        }
        
        if (farmSystemData.farmCounter) {
            farmSystem.farmCounter = farmSystemData.farmCounter;
        }
        
        if (farmSystemData.farmStats) {
            farmSystem.farmStats = farmSystemData.farmStats;
        }
    }

    /**
     * Limpa dados salvos
     */
    clearSavedData() {
        if (!this.isEnabled) return false;
        
        try {
            localStorage.removeItem(this.storageKey);
            localStorage.removeItem(this.storageKey + '_timestamp');
            
            console.log('🗑️ Dados salvos limpos');
            return true;
            
        } catch (error) {
            console.error('❌ Erro ao limpar dados salvos:', error);
            return false;
        }
    }

    /**
     * Obtém informações sobre dados salvos
     */
    getSaveInfo() {
        if (!this.isEnabled) return null;
        
        try {
            const timestamp = localStorage.getItem(this.storageKey + '_timestamp');
            const data = localStorage.getItem(this.storageKey);
            
            if (!data || !timestamp) return null;
            
            const gameState = JSON.parse(data);
            
            return {
                timestamp: parseInt(timestamp),
                date: new Date(parseInt(timestamp)),
                farms: gameState.farms?.length || 0,
                version: gameState.version || 'Desconhecida',
                size: new Blob([data]).size
            };
            
        } catch (error) {
            console.error('❌ Erro ao obter informações de salvamento:', error);
            return null;
        }
    }

    /**
     * Exporta dados para arquivo
     */
    exportToFile() {
        const gameState = this.collectGameState();
        const dataStr = JSON.stringify(gameState, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `nasa_farm_save_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        console.log('📤 Dados exportados para arquivo');
    }

    /**
     * Importa dados de arquivo
     */
    importFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const gameState = JSON.parse(e.target.result);
                    
                    if (this.validateGameState(gameState)) {
                        this.restoreGameState(gameState);
                        this.saveGameState(); // Salva no localStorage
                        resolve(gameState);
                        console.log('📥 Dados importados com sucesso');
                    } else {
                        reject(new Error('Arquivo de salvamento inválido'));
                    }
                    
                } catch (error) {
                    reject(new Error('Erro ao ler arquivo: ' + error.message));
                }
            };
            
            reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
            reader.readAsText(file);
        });
    }
}

// Inicializa automaticamente
window.farmPersistence = new FarmPersistence();

// Exporta para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FarmPersistence;
}