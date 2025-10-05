/**
 * Sistema de Integração entre Fazenda Visual e Sistema Principal
 * Conecta o sistema visual de fazendas com o sistema de jogo existente
 */

class FarmIntegration {
    constructor() {
        this.visualFarmSystem = null;
        this.farmSystem = null;
        this.currentView = 'world'; // 'world' ou 'farm'
        this.selectedTerritory = null;
        this.isInitialized = false;
        
        this.initializeIntegration();
    }

    /**
     * Inicializa a integração entre os sistemas
     */
    initializeIntegration() {
        // Aguarda o carregamento completo da página
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    /**
     * Configura a integração
     */
    async setup() {
        try {
            // Verifica se o canvas da fazenda existe
            const farmCanvas = document.getElementById('farm-canvas');
            if (!farmCanvas) {
                console.warn('⚠️ Canvas da fazenda não encontrado, aguardando...');
                setTimeout(() => this.setup(), 1000);
                return;
            }
            
            // Inicializa o sistema visual de fazendas
            this.visualFarmSystem = new VisualFarmSystem('farm-canvas');
            
            // Verifica se o sistema visual foi inicializado corretamente
            if (!this.visualFarmSystem.canvas) {
                console.error('❌ Falha ao inicializar sistema visual de fazendas');
                return;
            }
            
            // Inicializa o sistema visual
            await this.visualFarmSystem.initialize();
            
            // Conecta com o sistema de fazendas existente se disponível
            if (window.farmSystem) {
                this.farmSystem = window.farmSystem;
                this.connectSystems();
            }
            
            // Configura event listeners
            this.setupEventListeners();
            
            // Configura controles da interface
            this.setupUIControls();
            
            // Inicializa interface integrada
            this.initializeIntegratedInterface();
            
            this.isInitialized = true;
            console.log('✅ Sistema de integração de fazendas inicializado');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar integração de fazendas:', error);
        }
    }

    /**
     * Conecta os sistemas de fazenda
     */
    connectSystems() {
        if (!this.farmSystem || !this.visualFarmSystem) return;

        // Sincroniza dados existentes
        this.syncFarmData();
        
        // Conecta eventos
        this.farmSystem.on('farmCreated', (farmData) => {
            this.onFarmCreated(farmData);
        });
        
        this.farmSystem.on('cropPlanted', (plotData) => {
            this.onCropPlanted(plotData);
        });
        
        this.farmSystem.on('cropHarvested', (plotData) => {
            this.onCropHarvested(plotData);
        });
    }

    /**
     * Configura event listeners
     */
    setupEventListeners() {
        // Interface integrada - sem alternância de visão

        // Controles de ferramentas
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectTool(e.target.closest('.tool-btn').dataset.tool);
            });
        });

        // Seletor de culturas
        document.querySelectorAll('.crop-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectCrop(e.target.closest('.crop-btn').dataset.crop);
            });
        });

        // Eventos do canvas
        const farmCanvas = document.getElementById('farm-canvas');
        if (farmCanvas) {
            farmCanvas.addEventListener('click', (e) => this.onCanvasClick(e));
            farmCanvas.addEventListener('mousemove', (e) => this.onCanvasMouseMove(e));
            farmCanvas.addEventListener('mouseleave', () => this.onCanvasMouseLeave());
        }
    }

    /**
     * Configura controles da interface
     */
    setupUIControls() {
        // Inicializa com a primeira ferramenta e cultura selecionadas
        this.selectTool('plant');
        this.selectCrop('trigo');
    }

    /**
     * Inicializa interface integrada com dados NASA
     */
    initializeIntegratedInterface() {
        // Interface única que combina mapa mundial e dados de fazenda
        this.currentView = 'integrated';
        
        // Ativa canvas da fazenda por padrão
        const farmCanvas = document.getElementById('farm-canvas');
        if (farmCanvas) {
            farmCanvas.style.display = 'block';
            farmCanvas.style.opacity = '1';
            farmCanvas.style.visibility = 'visible';
            farmCanvas.style.pointerEvents = 'auto';
            farmCanvas.style.zIndex = '2';
            
            // Força redimensionamento do canvas
            if (this.visualFarmSystem) {
                setTimeout(() => {
                    this.visualFarmSystem.resizeCanvas();
                    this.visualFarmSystem.render();
                }, 200);
            }
        }
        
        // Mantém mapa mundial visível com transparência
        const gameCanvas = document.getElementById('game-canvas');
        if (gameCanvas) {
            gameCanvas.style.opacity = '0.7';
            gameCanvas.style.zIndex = '1';
        }
        
        // Garante que o container do canvas esteja configurado corretamente
        const canvasContainer = document.querySelector('.canvas-container');
        if (canvasContainer) {
            canvasContainer.style.position = 'relative';
            canvasContainer.style.width = '100%';
            canvasContainer.style.height = '100%';
            canvasContainer.style.overflow = 'hidden';
        }
        
        console.log('🌍🚜 Interface integrada NASA ativada');
    }

    /**
     * Seleciona uma ferramenta
     */
    selectTool(toolType) {
        // Atualiza interface
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const selectedBtn = document.querySelector(`[data-tool="${toolType}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('active');
        }
        
        // Atualiza sistema visual
        if (this.visualFarmSystem) {
            this.visualFarmSystem.setTool(toolType);
        }
        
        console.log(`🔧 Ferramenta selecionada: ${toolType}`);
    }

    /**
     * Seleciona uma cultura
     */
    selectCrop(cropType) {
        // Atualiza interface
        document.querySelectorAll('.crop-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const selectedBtn = document.querySelector(`[data-crop="${cropType}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('active');
        }
        
        // Atualiza sistema visual
        if (this.visualFarmSystem) {
            this.visualFarmSystem.setCrop(cropType);
        }
        
        console.log(`🌱 Cultura selecionada: ${cropType}`);
    }

    /**
     * Manipula cliques no canvas
     */
    onCanvasClick(event) {
        if (this.currentView !== 'farm' || !this.visualFarmSystem) return;
        
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        this.visualFarmSystem.handleClick(x, y);
    }

    /**
     * Manipula movimento do mouse no canvas
     */
    onCanvasMouseMove(event) {
        if (this.currentView !== 'farm' || !this.visualFarmSystem) return;
        
        const rect = event.target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        this.visualFarmSystem.handleMouseMove(x, y);
    }

    /**
     * Manipula saída do mouse do canvas
     */
    onCanvasMouseLeave() {
        if (this.visualFarmSystem) {
            this.visualFarmSystem.handleMouseLeave();
        }
    }

    /**
     * Carrega fazenda do território selecionado
     */
    loadTerritoryFarm() {
        if (!this.selectedTerritory || !this.visualFarmSystem) return;
        
        // Cria ou carrega fazenda para o território
        const farmData = this.getFarmDataForTerritory(this.selectedTerritory);
        this.visualFarmSystem.loadFarm(farmData);
    }

    /**
     * Obtém dados da fazenda para um território
     */
    getFarmDataForTerritory(territory) {
        // Dados padrão da fazenda
        return {
            id: `farm_${territory.id}`,
            name: `Fazenda ${territory.name}`,
            territory: territory,
            plots: this.generateDefaultPlots(),
            resources: {
                water: 100,
                fertilizer: 50,
                seeds: 200
            }
        };
    }

    /**
     * Gera plots padrão para uma nova fazenda
     */
    generateDefaultPlots() {
        const plots = [];
        const gridSize = 8;
        
        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                plots.push({
                    id: `plot_${x}_${y}`,
                    x: x,
                    y: y,
                    crop: null,
                    soilQuality: Math.random() * 0.3 + 0.7, // 70-100%
                    waterLevel: Math.random() * 0.4 + 0.6,  // 60-100%
                    isUnlocked: x < 4 && y < 4 // Apenas 4x4 inicial desbloqueado
                });
            }
        }
        
        return plots;
    }

    /**
     * Sincroniza dados entre sistemas
     */
    syncFarmData() {
        if (!this.farmSystem) return;
        
        // Sincroniza fazendas existentes
        const farms = this.farmSystem.getAllFarms();
        farms.forEach(farm => {
            this.onFarmCreated(farm);
        });
    }

    /**
     * Manipula criação de fazenda
     */
    onFarmCreated(farmData) {
        console.log('🏗️ Nova fazenda criada:', farmData);
        
        if (this.visualFarmSystem) {
            this.visualFarmSystem.addFarm(farmData);
        }
    }

    /**
     * Manipula plantio de cultura
     */
    onCropPlanted(plotData) {
        console.log('🌱 Cultura plantada:', plotData);
        
        if (this.visualFarmSystem) {
            this.visualFarmSystem.updatePlot(plotData);
        }
    }

    /**
     * Manipula colheita de cultura
     */
    onCropHarvested(plotData) {
        console.log('🌾 Cultura colhida:', plotData);
        
        if (this.visualFarmSystem) {
            this.visualFarmSystem.updatePlot(plotData);
        }
    }

    /**
     * Define território selecionado
     */
    setSelectedTerritory(territory) {
        this.selectedTerritory = territory;
        console.log('📍 Território selecionado:', territory);
        
        // Habilita botão de visualização da fazenda
        const farmViewBtn = document.getElementById('farm-view-btn');
        if (farmViewBtn) {
            farmViewBtn.disabled = false;
            farmViewBtn.style.opacity = '1';
        }
    }

    /**
     * Obtém sistema visual
     */
    getVisualSystem() {
        return this.visualFarmSystem;
    }

    /**
     * Verifica se está inicializado
     */
    isReady() {
        return this.isInitialized && this.visualFarmSystem && this.visualFarmSystem.isInitialized;
    }
}

// Inicializa automaticamente quando o script é carregado
window.farmIntegration = new FarmIntegration();

// Exporta para uso global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FarmIntegration;
}