/**
 * Sistema de Fazenda HTML/CSS/SVG
 * Substitui o sistema baseado em canvas por uma implementação HTML
 * Mantém todas as funcionalidades de visualização e interação
 */
class HtmlFarmSystem {
    constructor(containerId = 'farm-container', gameInstance = null) {
        this.containerId = containerId;
        this.gameInstance = gameInstance;
        this.container = null;
        this.farmGrid = null;
        this.activeFarm = null;
        
        // Configurações
        this.config = {
            gridSize: 40,
            farmWidth: 20,
            farmHeight: 20,
            currentZoom: 1,
            zoomLevels: [0.5, 0.75, 1, 1.25, 1.5, 2],
            animationSpeed: 1
        };
        
        // Estado do mouse e interações
        this.mouse = {
            x: 0,
            y: 0,
            isDown: false,
            button: 0
        };
        
        // Ferramentas e culturas
        this.selectedTool = 'plant';
        this.selectedCrop = 'wheat';
        
        // Partículas
        this.particles = [];
        
        // Bind dos métodos
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
        this.handlePlotClick = this.handlePlotClick.bind(this);
        this.handlePlotHover = this.handlePlotHover.bind(this);
        this.handlePlotLeave = this.handlePlotLeave.bind(this);
        // Binds para drag & drop
        this.handleToolDragStart = this.handleToolDragStart.bind(this);
        this.handleToolDragEnd = this.handleToolDragEnd.bind(this);
        this.handlePlotDragEnter = this.handlePlotDragEnter.bind(this);
        this.handlePlotDragOver = this.handlePlotDragOver.bind(this);
        this.handlePlotDragLeave = this.handlePlotDragLeave.bind(this);
        this.handlePlotDrop = this.handlePlotDrop.bind(this);
    }

    /**
     * Inicializa o sistema HTML da fazenda
     */
    async initialize() {
        try {
            this.container = document.getElementById(this.containerId);
            if (!this.container) {
                throw new Error(`Container ${this.containerId} não encontrado`);
            }
            
            this.setupContainer();
            this.createFarmGrid();
            this.setupEventListeners();
            this.createDefaultFarm();
            this.setupUI();
            
            console.log('Sistema HTML da fazenda inicializado com sucesso');
            return true;
        } catch (error) {
            console.error('Erro ao inicializar sistema HTML da fazenda:', error);
            return false;
        }
    }

    /**
     * Configura o container principal
     */
    setupContainer() {
        this.container.className = 'html-farm-container';
        this.container.innerHTML = '';
        
        // Aplica estilos CSS
        this.container.style.cssText = `
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: linear-gradient(135deg, #87CEEB 0%, #98FB98 100%);
            cursor: crosshair;
            user-select: none;
        `;
    }

    /**
     * Cria o grid da fazenda usando CSS Grid
     */
    createFarmGrid() {
        this.farmGrid = document.createElement('div');
        this.farmGrid.className = 'farm-grid';
        this.farmGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(${this.config.farmWidth}, ${this.config.gridSize}px);
            grid-template-rows: repeat(${this.config.farmHeight}, ${this.config.gridSize}px);
            gap: 1px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(${this.config.currentZoom});
            transform-origin: center;
            transition: transform 0.2s ease;
            background: rgba(139, 69, 19, 0.1);
            border: 2px solid #8B4513;
            border-radius: 8px;
            padding: 4px;
        `;
        
        // Cria as parcelas do grid
        for (let y = 0; y < this.config.farmHeight; y++) {
            for (let x = 0; x < this.config.farmWidth; x++) {
                const plot = this.createPlotElement(x, y);
                this.farmGrid.appendChild(plot);
            }
        }
        
        this.container.appendChild(this.farmGrid);
    }

    /**
     * Cria um elemento de parcela individual
     */
    createPlotElement(x, y) {
        const plot = document.createElement('div');
        plot.className = 'farm-plot';
        plot.dataset.x = x;
        plot.dataset.y = y;
        plot.dataset.soilType = 'soil';
        
        plot.style.cssText = `
            width: ${this.config.gridSize - 2}px;
            height: ${this.config.gridSize - 2}px;
            background: #8B4513;
            border: 1px solid #654321;
            border-radius: 2px;
            position: relative;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        `;
        
        // Adiciona textura do solo
        this.addSoilTexture(plot);
        
        // Event listeners
        plot.addEventListener('click', this.handlePlotClick);
        plot.addEventListener('mouseenter', this.handlePlotHover);
        plot.addEventListener('mouseleave', this.handlePlotLeave);
        
        // Drag & Drop listeners
        plot.addEventListener('dragenter', this.handlePlotDragEnter);
        plot.addEventListener('dragover', this.handlePlotDragOver);
        plot.addEventListener('dragleave', this.handlePlotDragLeave);
        plot.addEventListener('drop', this.handlePlotDrop);
        
        return plot;
    }

    /**
     * Adiciona textura visual ao solo
     */
    addSoilTexture(plot) {
        const texture = document.createElement('div');
        texture.className = 'soil-texture';
        texture.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                radial-gradient(circle at 20% 20%, rgba(139, 69, 19, 0.8) 2px, transparent 2px),
                radial-gradient(circle at 80% 80%, rgba(160, 82, 45, 0.6) 1px, transparent 1px),
                radial-gradient(circle at 40% 70%, rgba(101, 67, 33, 0.4) 1px, transparent 1px);
            background-size: 8px 8px, 6px 6px, 10px 10px;
        `;
        plot.appendChild(texture);
    }

    /**
     * Configura os event listeners
     */
    setupEventListeners() {
        this.container.addEventListener('mousemove', this.handleMouseMove);
        this.container.addEventListener('mousedown', this.handleMouseDown);
        this.container.addEventListener('mouseup', this.handleMouseUp);
        this.container.addEventListener('wheel', this.handleWheel, { passive: false });
        
        // Previne menu de contexto
        this.container.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    /**
     * Cria fazenda padrão
     */
    createDefaultFarm() {
        this.activeFarm = new HtmlFarm('default', 'Fazenda Principal', this.config.farmWidth, this.config.farmHeight);
        
        // Adiciona algumas culturas de exemplo
        this.activeFarm.addPlot(5, 5, 'soil');
        this.activeFarm.addPlot(6, 5, 'soil');
        this.activeFarm.addPlot(7, 5, 'soil');
        
        this.updateFarmDisplay();
    }

    /**
     * Atualiza a exibição visual da fazenda
     */
    updateFarmDisplay() {
        if (!this.activeFarm) return;
        
        const plots = this.farmGrid.querySelectorAll('.farm-plot');
        plots.forEach(plotElement => {
            const x = parseInt(plotElement.dataset.x);
            const y = parseInt(plotElement.dataset.y);
            const plot = this.activeFarm.getPlot(x, y);
            
            this.updatePlotDisplay(plotElement, plot);
        });
    }

    /**
     * Atualiza a exibição de uma parcela específica
     */
    updatePlotDisplay(plotElement, plot) {
        // Remove culturas existentes
        const existingCrop = plotElement.querySelector('.crop-visual');
        if (existingCrop) {
            existingCrop.remove();
        }
        
        // Remove indicadores de status
        const existingIndicators = plotElement.querySelectorAll('.plot-indicator');
        existingIndicators.forEach(indicator => indicator.remove());
        
        // Remove classes de estado anteriores (exceto animações temporárias)
        plotElement.classList.remove('empty', 'has-crop', 'needs-attention', 'optimal', 'dry', 'watered', 'fertilized');
        
        if (plot && plot.crop) {
            plotElement.classList.add('has-crop');
            this.addCropVisual(plotElement, plot.crop);
            this.addPlotIndicators(plotElement, plot);
            this.updatePlotStateClasses(plotElement, plot);
        } else {
            plotElement.classList.add('empty');
        }
        
        // Atualiza cor do solo baseado no nível de água e fertilidade
        if (plot) {
            this.updateSoilColor(plotElement, plot);
        }
    }

    /**
     * Atualiza classes CSS baseadas no estado da parcela
     */
    updatePlotStateClasses(plotElement, plot) {
        // Estado de água
        if (plot.waterLevel < 0.3) {
            plotElement.classList.add('dry');
        } else if (plot.waterLevel > 0.7) {
            plotElement.classList.add('watered');
        }
        
        // Estado de fertilidade
        if (plot.fertilityLevel > 0.6) {
            plotElement.classList.add('fertilized');
        }
        
        // Estado geral da parcela
        const needsWater = plot.waterLevel < 0.3;
        const needsFertilizer = plot.fertilityLevel < 0.3;
        const cropHealth = plot.crop ? plot.crop.health : 100;
        
        if (needsWater || needsFertilizer || cropHealth < 50) {
            plotElement.classList.add('needs-attention');
        } else if (plot.waterLevel > 0.6 && plot.fertilityLevel > 0.6 && cropHealth > 80) {
            plotElement.classList.add('optimal');
        }
    }

    /**
     * Adiciona classes CSS baseadas no estado da cultura
     */
    addCropStateClasses(cropElement, crop) {
        // Estado de saúde
        if (crop.health <= 0) {
            cropElement.classList.add('dead-crop');
        } else if (crop.health < 30) {
            cropElement.classList.add('unhealthy');
        } else if (crop.health > 80) {
            cropElement.classList.add('healthy');
        }
        
        // Estado de crescimento
        if (crop.isReady()) {
            cropElement.classList.add('ready');
        } else if (crop.stage === 'growing' || crop.stage === 'mature') {
            cropElement.classList.add('growing');
        }
        
        // Estado baseado no progresso
        const progress = crop.progress || 0;
        if (progress < 0.25) {
            cropElement.classList.add('stage-0');
        } else if (progress < 0.5) {
            cropElement.classList.add('stage-1');
        } else if (progress < 0.75) {
            cropElement.classList.add('stage-2');
        } else {
            cropElement.classList.add('stage-3');
        }
    }

    /**
     * Adiciona visual da cultura à parcela
     */
    /**
     * Adiciona visualização da cultura com cores específicas, ícones e estados visuais
     */
    addCropVisual(plotElement, crop) {
        const cropElement = document.createElement('div');
        cropElement.className = 'crop-visual';
        cropElement.dataset.cropType = crop.type;
        cropElement.dataset.stage = crop.stage;
        
        // Adiciona classes baseadas no estado da cultura
        this.addCropStateClasses(cropElement, crop);
        
        const size = this.getCropSize(crop);
        const colors = this.getCropColors(crop.type);
        
        // Determina a cor baseada no estágio da cultura
        let backgroundColor;
        let borderColor = 'transparent';
        
        if (crop.health <= 0) {
            // Planta morta - pontos vermelhos
            backgroundColor = colors.dead;
            borderColor = '#FF0000';
            cropElement.classList.add('dead-crop');
        } else if (crop.stage === 'seed') {
            // Semente - cor específica da semente
            backgroundColor = colors.seed;
            cropElement.classList.add('stage-0');
        } else if (crop.isReady()) {
            // Planta madura - cor madura
            backgroundColor = colors.mature;
            cropElement.classList.add('ready', 'stage-3');
        } else {
            // Planta em crescimento - cor primária
            backgroundColor = colors.primary;
            cropElement.classList.add('growing');
            
            // Adiciona classe de estágio específico
            if (crop.stage === 'seedling') {
                cropElement.classList.add('stage-1');
            } else if (crop.stage === 'growing') {
                cropElement.classList.add('stage-2');
            }
        }
        
        cropElement.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${backgroundColor};
            border: 2px solid ${borderColor};
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            transition: all 0.3s ease;
            z-index: 2;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${Math.max(12, size * 0.6)}px;
        `;
        
        // Adiciona ícone para plantas maduras
        if (crop.isReady() && crop.health > 0) {
            const icon = this.getCropIcon(crop.type);
            cropElement.innerHTML = icon;
            cropElement.style.background = 'transparent';
        }
        
        // Adiciona pontos vermelhos para plantas mortas
        if (crop.health <= 0) {
            this.addDeadCropIndicators(cropElement);
        }
        
        // Adiciona detalhes visuais baseados no tipo de cultura
        this.addCropDetails(cropElement, crop);
        
        plotElement.appendChild(cropElement);
        
        // Animação de crescimento
        if (crop.stage === 'seedling') {
            cropElement.style.transform = 'translate(-50%, -50%) scale(0)';
            setTimeout(() => {
                cropElement.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 100);
        }
    }

    /**
     * Adiciona indicadores visuais para plantas mortas
     */
    addDeadCropIndicators(cropElement) {
        // Remove conteúdo existente
        cropElement.innerHTML = '';
        
        // Adiciona múltiplos pontos vermelhos
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #FF0000;
                border-radius: 50%;
                top: ${20 + i * 15}%;
                left: ${30 + i * 20}%;
                animation: deadCropPulse 2s infinite;
                animation-delay: ${i * 0.3}s;
            `;
            cropElement.appendChild(dot);
        }
    }

    /**
     * Adiciona detalhes visuais específicos da cultura
     */
    addCropDetails(cropElement, crop) {
        const colors = this.getCropColors(crop.type);
        
        // Adiciona folhas ou detalhes específicos
        if (crop.stage !== 'seed') {
            const detail = document.createElement('div');
            detail.style.cssText = `
                position: absolute;
                top: -2px;
                left: 50%;
                transform: translateX(-50%);
                width: 6px;
                height: 8px;
                background: ${colors.secondary};
                border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
            `;
            cropElement.appendChild(detail);
        }
        
        // Adiciona indicador de maturidade
        if (crop.isReady()) {
            const readyIndicator = document.createElement('div');
            readyIndicator.className = 'ready-indicator';
            readyIndicator.style.cssText = `
                position: absolute;
                top: -4px;
                right: -4px;
                width: 8px;
                height: 8px;
                background: #FFD700;
                border-radius: 50%;
                animation: pulse 1s infinite;
            `;
            cropElement.appendChild(readyIndicator);
        }
    }

    /**
     * Adiciona indicadores de status da parcela
     */
    addPlotIndicators(plotElement, plot) {
        // Indicador de água
        if (plot.waterLevel > 0.7) {
            const waterIndicator = document.createElement('div');
            waterIndicator.className = 'plot-indicator water-indicator';
            waterIndicator.style.cssText = `
                position: absolute;
                top: 2px;
                left: 2px;
                width: 6px;
                height: 6px;
                background: #4169E1;
                border-radius: 50%;
                opacity: ${plot.waterLevel};
            `;
            plotElement.appendChild(waterIndicator);
        }
        
        // Indicador de fertilidade
        if (plot.fertilityLevel > 0.7) {
            const fertilityIndicator = document.createElement('div');
            fertilityIndicator.className = 'plot-indicator fertility-indicator';
            fertilityIndicator.style.cssText = `
                position: absolute;
                top: 2px;
                right: 2px;
                width: 6px;
                height: 6px;
                background: #32CD32;
                border-radius: 50%;
                opacity: ${plot.fertilityLevel};
            `;
            plotElement.appendChild(fertilityIndicator);
        }
    }

    /**
     * Atualiza cor do solo baseado nos níveis de água e fertilidade
     */
    updateSoilColor(plotElement, plot) {
        const baseColor = [139, 69, 19]; // Marrom do solo
        const waterInfluence = plot.waterLevel * 0.3;
        const fertilityInfluence = plot.fertilityLevel * 0.2;
        
        const r = Math.max(0, baseColor[0] - waterInfluence * 50);
        const g = Math.min(255, baseColor[1] + fertilityInfluence * 100);
        const b = baseColor[2];
        
        plotElement.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    }

    /**
     * Obtém o tamanho da cultura baseado no estágio
     */
    getCropSize(crop) {
        const baseSizes = {
            'seed': 8,
            'seedling': 12,
            'growing': 18,
            'mature': 24,
            'ready': 28
        };
        
        return baseSizes[crop.stage] || 16;
    }

    /**
     * Obtém as cores da cultura baseado no tipo
     */
    /**
     * Obtém as cores específicas para cada tipo de cultura
     * Inclui cores para sementes, plantas e estados especiais
     */
    getCropColors(cropType) {
        const colors = {
            'wheat': { 
                seed: '#FFE4B5', 
                primary: '#DAA520', 
                secondary: '#228B22',
                mature: '#F4A460',
                dead: '#8B0000'
            },
            'corn': { 
                seed: '#FFFF99', 
                primary: '#FFD700', 
                secondary: '#32CD32',
                mature: '#FFA500',
                dead: '#8B0000'
            },
            'soy': { 
                seed: '#98FB98', 
                primary: '#9ACD32', 
                secondary: '#006400',
                mature: '#ADFF2F',
                dead: '#8B0000'
            },
            'rice': { 
                seed: '#F5F5DC', 
                primary: '#F5DEB3', 
                secondary: '#228B22',
                mature: '#FFFACD',
                dead: '#8B0000'
            },
            'cotton': { 
                seed: '#E6E6FA', 
                primary: '#F8F8FF', 
                secondary: '#90EE90',
                mature: '#FFFFFF',
                dead: '#8B0000'
            },
            'tomato': { 
                seed: '#FFB6C1', 
                primary: '#FF6347', 
                secondary: '#228B22',
                mature: '#DC143C',
                dead: '#8B0000'
            },
            'potato': { 
                seed: '#F5DEB3', 
                primary: '#DEB887', 
                secondary: '#228B22',
                mature: '#CD853F',
                dead: '#8B0000'
            },
            'carrot': { 
                seed: '#FFA07A', 
                primary: '#FF8C00', 
                secondary: '#228B22',
                mature: '#FF4500',
                dead: '#8B0000'
            }
        };
        
        return colors[cropType] || { 
            seed: '#F0E68C', 
            primary: '#90EE90', 
            secondary: '#228B22',
            mature: '#32CD32',
            dead: '#8B0000'
        };
    }

    /**
     * Obtém o ícone SVG específico para cada tipo de cultura madura
     */
    getCropIcon(cropType) {
        const icons = {
            'wheat': '🌾',
            'corn': '🌽',
            'soy': '🫘',
            'rice': '🌾',
            'cotton': '🤍',
            'tomato': '🍅',
            'potato': '🥔',
            'carrot': '🥕'
        };
        
        return icons[cropType] || '🌱';
    }

    /**
     * Configura a interface do usuário
     */
    setupUI() {
        // Adiciona estilos CSS para animações
        this.addAnimationStyles();
        
        // Configura toolbar se existir
        this.setupToolbar();
    }

    /**
     * Adiciona estilos CSS para animações
     */
    addAnimationStyles() {
        if (document.getElementById('html-farm-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'html-farm-styles';
        style.textContent = `
            @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.2); }
            }
            
            @keyframes grow {
                from { transform: translate(-50%, -50%) scale(0); }
                to { transform: translate(-50%, -50%) scale(1); }
            }
            
            @keyframes harvest {
                0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
                100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            }
            
            @keyframes deadCropPulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.3; transform: scale(0.8); }
            }
            
            .farm-plot:hover {
                border-color: #FFD700 !important;
                box-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
            }
            
            .farm-plot.selected {
                border-color: #FF4500 !important;
                box-shadow: 0 0 12px rgba(255, 69, 0, 0.7);
            }
            
            .dead-crop {
                filter: grayscale(100%) brightness(0.7);
                animation: deadCropPulse 3s infinite;
            }
            
            .crop-visual.mature {
                animation: pulse 2s infinite;
            }
            
            .crop-visual.seed {
                opacity: 0.8;
                transform: translate(-50%, -50%) scale(0.7);
            }
            
            .particle {
                position: absolute;
                pointer-events: none;
                border-radius: 50%;
                animation: particleFloat 1s ease-out forwards;
            }
            
            @keyframes particleFloat {
                0% { transform: translateY(0) scale(1); opacity: 1; }
                100% { transform: translateY(-20px) scale(0); opacity: 0; }
            }
        `;
        
        document.head.appendChild(style);
    }

    /**
     * Configura os botões da barra de ferramentas e de seleção de culturas.
     *
     * - Para cada botão com atributo data-tool:
     *   - Clique: seleciona a ferramenta correspondente via setTool
     *   - Drag & Drop: habilita arraste (draggable=true) e registra handlers
     *     de dragstart/dragend para permitir aplicar ferramentas ao soltar na parcela.
     * - Para cada botão com atributo data-crop:
     *   - Clique: seleciona o tipo de cultura via setCrop
     */
    setupToolbar() {
        // Procura por elementos de toolbar existentes e conecta eventos
        const toolButtons = document.querySelectorAll('[data-tool]');
        toolButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.setTool(e.target.dataset.tool);
            });
            // Habilita arrastar para ferramentas
            button.setAttribute('draggable', 'true');
            button.addEventListener('dragstart', this.handleToolDragStart);
            button.addEventListener('dragend', this.handleToolDragEnd);
        });
        
        const cropButtons = document.querySelectorAll('[data-crop]');
        cropButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.setCrop(e.target.dataset.crop);
            });
        });
    }

    // Event Handlers

    /**
     * Manipula movimento do mouse
     */
    handleMouseMove(event) {
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = event.clientX - rect.left;
        this.mouse.y = event.clientY - rect.top;
    }

    /**
     * Manipula clique do mouse
     */
    handleMouseDown(event) {
        this.mouse.isDown = true;
        this.mouse.button = event.button;
    }

    /**
     * Manipula soltar do mouse
     */
    handleMouseUp(event) {
        this.mouse.isDown = false;
    }

    /**
     * Manipula scroll do mouse para zoom
     */
    handleWheel(event) {
        event.preventDefault();
        
        const zoomDirection = event.deltaY > 0 ? -1 : 1;
        const currentIndex = this.config.zoomLevels.indexOf(this.config.currentZoom);
        const newIndex = Math.max(0, Math.min(this.config.zoomLevels.length - 1, currentIndex + zoomDirection));
        
        this.config.currentZoom = this.config.zoomLevels[newIndex];
        this.updateZoom();
    }

    /**
     * Atualiza o zoom do grid
     */
    updateZoom() {
        if (this.farmGrid) {
            this.farmGrid.style.transform = `translate(-50%, -50%) scale(${this.config.currentZoom})`;
        }
    }

    /**
     * Manipula clique em uma parcela
     */
    handlePlotClick(event) {
        event.stopPropagation();
        
        const plotElement = event.currentTarget;
        const x = parseInt(plotElement.dataset.x);
        const y = parseInt(plotElement.dataset.y);
        
        // Remove seleção anterior
        this.farmGrid.querySelectorAll('.farm-plot.selected').forEach(plot => {
            plot.classList.remove('selected');
        });
        
        // Adiciona seleção atual
        plotElement.classList.add('selected');
        
        // Executa ação baseada na ferramenta selecionada
        switch (this.selectedTool) {
            case 'plant':
                this.handlePlantAction(x, y, plotElement);
                break;
            case 'harvest':
                this.handleHarvestAction(x, y, plotElement);
                break;
            case 'water':
                this.handleWaterAction(x, y, plotElement);
                break;
            case 'fertilize':
                this.handleFertilizeAction(x, y, plotElement);
                break;
            case 'pesticide':
                this.handlePesticideAction(x, y, plotElement);
                break;
            case 'organic-fertilizer':
                this.handleOrganicFertilizerAction(x, y, plotElement);
                break;
            case 'soil-analysis':
                this.handleSoilAnalysisAction(x, y, plotElement);
                break;
            case 'clean':
                this.handleCleanAction(x, y, plotElement);
                break;
            case 'irrigation':
                this.handleIrrigationAction(x, y, plotElement);
                break;
            case 'mulch':
                this.handleMulchAction(x, y, plotElement);
                break;
            case 'irrigate':
                this.handleIrrigateAction(x, y, plotElement);
                break;
            case 'coverage':
                this.handleCoverageAction(x, y, plotElement);
                break;
            case 'water-crops':
                this.handleWaterCropsAction(x, y, plotElement);
                break;
        }
    }

    /**
     * Manipula hover sobre uma parcela
     */
    handlePlotHover(event) {
        const plotElement = event.currentTarget;
        const x = parseInt(plotElement.dataset.x);
        const y = parseInt(plotElement.dataset.y);
        const plot = this.activeFarm?.getPlot(x, y);
        
        // Mostra informações da parcela
        this.showPlotInfo(x, y, plot, event);
    }

    /**
     * Manipula saída do hover de uma parcela
     */
    handlePlotLeave(event) {
        this.hidePlotInfo();
    }

    // Handlers de Drag & Drop
    /**
     * Inicia o arraste de um botão de ferramenta, configurando o tipo de ferramenta e os dados de transferência.
     * Adiciona a classe visual de estado 'dragging' no botão.
     * @param {DragEvent} event Evento de dragstart do botão de ferramenta
     */
    handleToolDragStart(event) {
        const button = event.currentTarget;
        const tool = button?.dataset?.tool;
        if (!tool) return;
        this.setTool(tool);
        event.dataTransfer.effectAllowed = 'copy';
        event.dataTransfer.setData('text/plain', tool);
        button.classList.add('dragging');
    }

    /**
     * Finaliza o arraste do botão de ferramenta, removendo a classe visual 'dragging'.
     * @param {DragEvent} event Evento de dragend do botão de ferramenta
     */
    handleToolDragEnd(event) {
        const button = event.currentTarget;
        if (button) button.classList.remove('dragging');
    }

    /**
     * Indica que o cursor arrastado entrou na parcela e aplica estilo visual de destaque.
     * @param {DragEvent} event Evento de dragenter na parcela
     */
    handlePlotDragEnter(event) {
        event.preventDefault();
        event.currentTarget.classList.add('drag-over');
    }

    /**
     * Permite o drop sobre a parcela e define o efeito visual de cópia.
     * @param {DragEvent} event Evento de dragover na parcela
     */
    handlePlotDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    }

    /**
     * Remove o estado visual de destaque quando o cursor arrastado sai da parcela.
     * @param {DragEvent} event Evento de dragleave na parcela
     */
    handlePlotDragLeave(event) {
        event.currentTarget.classList.remove('drag-over');
    }

    /**
     * Trata o drop da ferramenta sobre a parcela e executa a ação correspondente
     * (plantar, colher, regar, fertilizar, pesticida, adubo orgânico, análise do solo,
     * limpar, irrigação e cobertura do solo).
     * @param {DragEvent} event Evento de drop na parcela
     */
    handlePlotDrop(event) {
        event.preventDefault();
        const plotElement = event.currentTarget;
        plotElement.classList.remove('drag-over');
        const tool = event.dataTransfer.getData('text/plain') || this.selectedTool;
        const x = parseInt(plotElement.dataset.x);
        const y = parseInt(plotElement.dataset.y);
        if (!tool) return;
        
        switch (tool) {
            case 'plant':
                this.handlePlantAction(x, y, plotElement);
                break;
            case 'harvest':
                this.handleHarvestAction(x, y, plotElement);
                break;
            case 'water':
                this.handleWaterAction(x, y, plotElement);
                break;
            case 'fertilize':
                this.handleFertilizeAction(x, y, plotElement);
                break;
            case 'pesticide':
                this.handlePesticideAction(x, y, plotElement);
                break;
            case 'organic-fertilizer':
                this.handleOrganicFertilizerAction(x, y, plotElement);
                break;
            case 'soil-analysis':
                this.handleSoilAnalysisAction(x, y, plotElement);
                break;
            case 'clean':
                this.handleCleanAction(x, y, plotElement);
                break;
            case 'irrigation':
                this.handleIrrigationAction(x, y, plotElement);
                break;
            case 'mulch':
                this.handleMulchAction(x, y, plotElement);
                break;
        }
    }

    /**
     * Mostra informações da parcela
     */
    showPlotInfo(x, y, plot, event) {
        let tooltip = document.getElementById('plot-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'plot-tooltip';
            tooltip.style.cssText = `
                position: absolute;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px;
                border-radius: 4px;
                font-size: 12px;
                pointer-events: none;
                z-index: 1000;
                white-space: nowrap;
            `;
            document.body.appendChild(tooltip);
        }
        
        let info = `Posição: ${x}, ${y}`;
        if (plot) {
            info += `\nSolo: ${plot.soilType}`;
            info += `\nÁgua: ${Math.round(plot.waterLevel * 100)}%`;
            info += `\nFertilidade: ${Math.round(plot.fertilityLevel * 100)}%`;
            
            if (plot.crop) {
                info += `\nCultura: ${plot.crop.type}`;
                info += `\nEstágio: ${plot.crop.stage}`;
                info += `\nProgresso: ${Math.round(plot.crop.progress * 100)}%`;
            }
        }
        
        tooltip.textContent = info;
        tooltip.style.left = event.pageX + 10 + 'px';
        tooltip.style.top = event.pageY - 10 + 'px';
        tooltip.style.display = 'block';
    }

    /**
     * Esconde informações da parcela
     */
    hidePlotInfo() {
        const tooltip = document.getElementById('plot-tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }

    // Ações da fazenda

    /**
     * Manipula ação de plantar
     */
    handlePlantAction(x, y, plotElement) {
        if (!this.activeFarm.getPlot(x, y)) {
            this.activeFarm.addPlot(x, y, 'soil');
        }
        
        const success = this.activeFarm.plantCrop(x, y, this.selectedCrop);
        if (success) {
            // Adiciona feedback visual imediato
            this.addPlantingFeedback(plotElement);
            this.updatePlotDisplay(plotElement, this.activeFarm.getPlot(x, y));
            this.createPlantParticles(x, y);
            this.showActionFeedback(plotElement, 'Plantado!', '#4CAF50');
        }
    }

    /**
     * Manipula ação de colher
     */
    handleHarvestAction(x, y, plotElement) {
        const success = this.activeFarm.harvestCrop(x, y);
        if (success) {
            // Adiciona feedback visual imediato
            this.addHarvestingFeedback(plotElement);
            this.updatePlotDisplay(plotElement, this.activeFarm.getPlot(x, y));
            this.createHarvestParticles(x, y);
            this.showActionFeedback(plotElement, 'Colhido!', '#FFD700');
        }
    }

    /**
     * Manipula ação de regar
     */
    handleWaterAction(x, y, plotElement) {
        const plot = this.activeFarm.getPlot(x, y);
        if (plot) {
            // Adiciona feedback visual imediato
            this.addWateringFeedback(plotElement);
            plot.water();
            this.updatePlotDisplay(plotElement, plot);
            this.createWaterParticles(x, y);
            this.showActionFeedback(plotElement, 'Regado!', '#4169E1');
        }
    }

    /**
     * Manipula ação de fertilizar
     */
    handleFertilizeAction(x, y, plotElement) {
        const plot = this.activeFarm.getPlot(x, y);
        if (plot) {
            plot.fertilize();
            this.updatePlotDisplay(plotElement, plot);
            this.createFertilizeParticles(x, y);
        }
    }

    /**
     * Manipula ação de aplicar pesticida
     */
    handlePesticideAction(x, y, plotElement) {
        const plot = this.activeFarm.getPlot(x, y);
        if (plot && plot.crop) {
            // Melhora a saúde da planta e reduz pragas
            plot.crop.health = Math.min(100, (plot.crop.health || 80) + 20);
            plot.pestLevel = Math.min(100, (plot.pestLevel || 0) + 30);
            this.updatePlotDisplay(plotElement, plot);
            this.createPesticideParticles(x, y);
            this.showActionFeedback(plotElement, 'Pesticida aplicado!', '#FF6B6B');
        }
    }

    /**
     * Manipula ação de aplicar adubo orgânico
     */
    handleOrganicFertilizerAction(x, y, plotElement) {
        const plot = this.activeFarm.getPlot(x, y);
        if (plot) {
            // Melhora a fertilidade do solo de forma mais duradoura
            plot.fertilityLevel = Math.min(100, plot.fertilityLevel + 25);
            plot.organicMatter = Math.min(100, (plot.organicMatter || 50) + 30);
            this.updatePlotDisplay(plotElement, plot);
            this.createOrganicFertilizerParticles(x, y);
            this.showActionFeedback(plotElement, 'Organic fertilizer applied!', '#8FBC8F');
        }
    }

    /**
     * Manipula ação de análise do solo
     */
    handleSoilAnalysisAction(x, y, plotElement) {
        const plot = this.activeFarm.getPlot(x, y);
        if (plot) {
            // Mostra informações detalhadas do solo
            const analysis = {
                ph: (6.0 + Math.random() * 2).toFixed(1),
                nitrogen: Math.floor(plot.fertilityLevel * 0.8 + Math.random() * 20),
                phosphorus: Math.floor(plot.fertilityLevel * 0.7 + Math.random() * 30),
                potassium: Math.floor(plot.fertilityLevel * 0.9 + Math.random() * 10),
                organicMatter: plot.organicMatter || 50,
                moisture: plot.waterLevel
            };
            
            this.showSoilAnalysisModal(analysis, x, y);
            this.createAnalysisParticles(x, y);
        }
    }

    /**
     * Manipula ação de limpar parcela
     */
    handleCleanAction(x, y, plotElement) {
        const plot = this.activeFarm.getPlot(x, y);
        if (plot) {
            // Remove plantas mortas e detritos
            if (plot.crop && plot.crop.isDead) {
                plot.crop = null;
                plot.debris = 0;
                this.updatePlotDisplay(plotElement, plot);
                this.createCleanParticles(x, y);
                this.showActionFeedback(plotElement, 'Parcela limpa!', '#87CEEB');
            } else if (plot.debris > 0) {
                plot.debris = 0;
                this.updatePlotDisplay(plotElement, plot);
                this.createCleanParticles(x, y);
                this.showActionFeedback(plotElement, 'Detritos removidos!', '#87CEEB');
            }
        }
    }

    /**
     * Manipula ação de sistema de irrigação
     */
    handleIrrigationAction(x, y, plotElement) {
        const plot = this.activeFarm.getPlot(x, y);
        if (plot) {
            // Instala/ativa sistema de irrigação automática
            plot.hasIrrigation = !plot.hasIrrigation;
            if (plot.hasIrrigation) {
                plot.waterLevel = Math.min(100, plot.waterLevel + 40);
                this.showActionFeedback(plotElement, 'Irrigation activated!', '#4169E1');
            } else {
                this.showActionFeedback(plotElement, 'Irrigation deactivated!', '#696969');
            }
            this.updatePlotDisplay(plotElement, plot);
            this.createIrrigationParticles(x, y);
        }
    }

    /**
     * Manipula ação de cobertura do solo (mulch)
     */
    handleMulchAction(x, y, plotElement) {
        const plot = this.activeFarm.getPlot(x, y);
        if (plot) {
            // Adiciona cobertura do solo para conservar umidade
            plot.hasMulch = !plot.hasMulch;
            if (plot.hasMulch) {
                plot.moistureRetention = Math.min(100, (plot.moistureRetention || 50) + 30);
                this.showActionFeedback(plotElement, 'Cobertura aplicada!', '#8B4513');
            } else {
                plot.moistureRetention = Math.max(0, (plot.moistureRetention || 50) - 30);
                this.showActionFeedback(plotElement, 'Cobertura removida!', '#696969');
            }
            this.updatePlotDisplay(plotElement, plot);
            this.createMulchParticles(x, y);
        }
    }

    /**
     * Manipula ação de irrigação avançada
     */
    handleIrrigateAction(x, y, plotElement) {
        const plot = this.activeFarm.getPlot(x, y);
        if (plot) {
            // Sistema de irrigação mais eficiente que a rega simples
            plot.waterLevel = Math.min(100, plot.waterLevel + 50);
            plot.irrigationEfficiency = Math.min(100, (plot.irrigationEfficiency || 70) + 15);
            
            // Melhora a distribuição de água no solo
            if (plot.crop) {
                plot.crop.waterStress = Math.max(0, (plot.crop.waterStress || 0) - 30);
            }
            
            this.updatePlotDisplay(plotElement, plot);
            this.createIrrigateParticles(x, y);
            this.showActionFeedback(plotElement, 'Irrigation applied!', '#1E90FF');
        }
    }

    /**
     * Manipula ação de cobertura do solo (versão alternativa)
     */
    handleCoverageAction(x, y, plotElement) {
        const plot = this.activeFarm.getPlot(x, y);
        if (plot) {
            // Aplica cobertura protetiva para conservar recursos
            plot.hasCoverage = !plot.hasCoverage;
            if (plot.hasCoverage) {
                plot.temperatureStability = Math.min(100, (plot.temperatureStability || 60) + 25);
                plot.moistureRetention = Math.min(100, (plot.moistureRetention || 50) + 20);
                plot.weedSuppression = Math.min(100, (plot.weedSuppression || 40) + 35);
                this.showActionFeedback(plotElement, 'Cobertura protetiva aplicada!', '#228B22');
            } else {
                plot.temperatureStability = Math.max(0, (plot.temperatureStability || 60) - 25);
                plot.moistureRetention = Math.max(0, (plot.moistureRetention || 50) - 20);
                plot.weedSuppression = Math.max(0, (plot.weedSuppression || 40) - 35);
                this.showActionFeedback(plotElement, 'Cobertura removida!', '#696969');
            }
            this.updatePlotDisplay(plotElement, plot);
            this.createCoverageParticles(x, y);
        }
    }

    /**
     * Manipula ação de regar culturas (rega direcionada)
     */
    handleWaterCropsAction(x, y, plotElement) {
        const plot = this.activeFarm.getPlot(x, y);
        if (plot && plot.crop) {
            // Rega direcionada especificamente para as culturas
            plot.waterLevel = Math.min(100, plot.waterLevel + 35);
            plot.crop.hydration = Math.min(100, (plot.crop.hydration || 70) + 40);
            plot.crop.waterStress = Math.max(0, (plot.crop.waterStress || 0) - 25);
            
            // Melhora a saúde da planta se estava com sede
            if (plot.crop.waterStress < 20) {
                plot.crop.health = Math.min(100, (plot.crop.health || 80) + 10);
            }
            
            this.updatePlotDisplay(plotElement, plot);
            this.createWaterCropsParticles(x, y);
            this.showActionFeedback(plotElement, 'Culturas regadas!', '#00CED1');
        } else {
            this.showActionFeedback(plotElement, 'Nenhuma cultura para regar!', '#FF6347');
        }
    }

    // Partículas e efeitos visuais

    /**
     * Cria partículas de plantio
     */
    createPlantParticles(x, y) {
        this.createParticles(x, y, '#32CD32', 5);
    }

    /**
     * Cria partículas de colheita
     */
    createHarvestParticles(x, y) {
        this.createParticles(x, y, '#FFD700', 8);
    }

    /**
     * Cria partículas de água
     */
    createWaterParticles(x, y) {
        this.createParticles(x, y, '#4169E1', 6);
    }

    /**
     * Cria partículas de fertilizante
     */
    createFertilizeParticles(x, y) {
        this.createParticles(x, y, '#8B4513', 4);
    }

    /**
     * Cria partículas de pesticida
     */
    createPesticideParticles(x, y) {
        this.createParticles(x, y, '#FF6B6B', 6);
    }

    /**
     * Cria partículas de adubo orgânico
     */
    createOrganicFertilizerParticles(x, y) {
        this.createParticles(x, y, '#8FBC8F', 5);
    }

    /**
     * Cria partículas de análise
     */
    createAnalysisParticles(x, y) {
        this.createParticles(x, y, '#FFD700', 3);
    }

    /**
     * Cria partículas de limpeza
     */
    createCleanParticles(x, y) {
        this.createParticles(x, y, '#87CEEB', 4);
    }

    /**
     * Cria partículas de irrigação
     */
    createIrrigationParticles(x, y) {
        this.createParticles(x, y, '#4169E1', 8);
    }

    /**
     * Cria partículas de cobertura
     */
    createMulchParticles(x, y) {
        this.createParticles(x, y, '#8B4513', 5);
    }

    /**
     * Cria partículas de irrigação avançada
     */
    createIrrigateParticles(x, y) {
        this.createParticles(x, y, '#1E90FF', 10);
    }

    /**
     * Cria partículas de cobertura protetiva
     */
    createCoverageParticles(x, y) {
        this.createParticles(x, y, '#228B22', 6);
    }

    /**
     * Cria partículas de rega direcionada
     */
    createWaterCropsParticles(x, y) {
        this.createParticles(x, y, '#00CED1', 7);
    }

    /**
     * Cria partículas visuais
     */
    createParticles(gridX, gridY, color, count) {
        const plotElement = this.farmGrid.querySelector(`[data-x="${gridX}"][data-y="${gridY}"]`);
        if (!plotElement) return;
        
        const rect = plotElement.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                left: ${rect.left - containerRect.left + Math.random() * rect.width}px;
                top: ${rect.top - containerRect.top + Math.random() * rect.height}px;
                width: 4px;
                height: 4px;
                background: ${color};
                pointer-events: none;
                z-index: 1000;
            `;
            
            this.container.appendChild(particle);
            
            // Remove partícula após animação
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
    }

    /**
     * Adiciona feedback visual de plantio
     */
    addPlantingFeedback(plotElement) {
        plotElement.classList.add('planting', 'recently-planted');
        
        // Remove classes após animação
        setTimeout(() => {
            plotElement.classList.remove('planting');
        }, 1500);
        
        setTimeout(() => {
            plotElement.classList.remove('recently-planted');
        }, 2000);
    }

    /**
     * Adiciona feedback visual de colheita
     */
    addHarvestingFeedback(plotElement) {
        plotElement.classList.add('harvesting', 'recently-harvested');
        
        // Remove classes após animação
        setTimeout(() => {
            plotElement.classList.remove('harvesting');
        }, 1500);
        
        setTimeout(() => {
            plotElement.classList.remove('recently-harvested');
        }, 2000);
    }

    /**
     * Adiciona feedback visual de irrigação
     */
    addWateringFeedback(plotElement) {
        plotElement.classList.add('watering');
        
        // Remove classe após animação
        setTimeout(() => {
            plotElement.classList.remove('watering');
        }, 1500);
    }

    /**
     * Mostra feedback de ação na parcela
     */
    showActionFeedback(plotElement, message, color) {
        const feedback = document.createElement('div');
        feedback.className = 'action-feedback';
        feedback.textContent = message;
        feedback.style.cssText = `
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            background: ${color};
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
            white-space: nowrap;
            z-index: 1001;
            animation: feedbackFloat 2s ease-out forwards;
            pointer-events: none;
        `;
        
        plotElement.style.position = 'relative';
        plotElement.appendChild(feedback);
        
        // Remove feedback após animação
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 2000);
    }

    /**
     * Mostra modal de análise do solo
     */
    showSoilAnalysisModal(analysis, x, y) {
        // Remove modal existente se houver
        const existingModal = document.querySelector('.soil-analysis-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'soil-analysis-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Análise do Solo - Parcela (${x}, ${y})</h3>
                        <button class="close-btn">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="analysis-grid">
                            <div class="analysis-item">
                                <span class="label">pH:</span>
                                <span class="value">${analysis.ph}</span>
                            </div>
                            <div class="analysis-item">
                                <span class="label">Nitrogênio:</span>
                                <span class="value">${analysis.nitrogen}%</span>
                            </div>
                            <div class="analysis-item">
                                <span class="label">Fósforo:</span>
                                <span class="value">${analysis.phosphorus}%</span>
                            </div>
                            <div class="analysis-item">
                                <span class="label">Potássio:</span>
                                <span class="value">${analysis.potassium}%</span>
                            </div>
                            <div class="analysis-item">
                                <span class="label">Matéria Orgânica:</span>
                                <span class="value">${analysis.organicMatter}%</span>
                            </div>
                            <div class="analysis-item">
                                <span class="label">Umidade:</span>
                                <span class="value">${analysis.moisture}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
        `;

        document.body.appendChild(modal);

        // Adiciona estilos do modal
        this.addSoilAnalysisModalStyles();

        // Event listeners
        const closeBtn = modal.querySelector('.close-btn');
        const overlay = modal.querySelector('.modal-overlay');
        
        closeBtn.addEventListener('click', () => modal.remove());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                modal.remove();
            }
        });
    }

    /**
     * Adiciona estilos para o modal de análise do solo
     */
    addSoilAnalysisModalStyles() {
        if (document.querySelector('#soil-analysis-modal-styles')) return;

        const style = document.createElement('style');
        style.id = 'soil-analysis-modal-styles';
        style.textContent = `
            .soil-analysis-modal .modal-overlay {
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
            }
            
            .soil-analysis-modal .modal-content {
                background: white;
                border-radius: 12px;
                max-width: 400px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            
            .soil-analysis-modal .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #eee;
                background: #f8f9fa;
                border-radius: 12px 12px 0 0;
            }
            
            .soil-analysis-modal .modal-header h3 {
                margin: 0;
                color: #333;
                font-size: 18px;
            }
            
            .soil-analysis-modal .close-btn {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.2s;
            }
            
            .soil-analysis-modal .close-btn:hover {
                background: #f0f0f0;
            }
            
            .soil-analysis-modal .modal-body {
                padding: 20px;
            }
            
            .soil-analysis-modal .analysis-grid {
                display: grid;
                gap: 12px;
            }
            
            .soil-analysis-modal .analysis-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                background: #f8f9fa;
                border-radius: 6px;
                border-left: 4px solid #28a745;
            }
            
            .soil-analysis-modal .analysis-item .label {
                font-weight: bold;
                color: #333;
            }
            
            .soil-analysis-modal .analysis-item .value {
                color: #28a745;
                font-weight: bold;
            }
            
            @keyframes feedbackFloat {
                0% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            }
        `;
        
        document.head.appendChild(style);
    }

    // Métodos públicos

    /**
     * Define a ferramenta selecionada
     */
    setTool(tool) {
        this.selectedTool = tool;
        
        // Atualiza cursor baseado na ferramenta
        const cursors = {
            'plant': 'crosshair',
            'harvest': 'grab',
            'water': 'pointer',
            'fertilize': 'help',
            'pesticide': 'crosshair',
            'organic-fertilizer': 'help',
            'soil-analysis': 'zoom-in',
            'clean': 'grab',
            'irrigation': 'pointer',
            'mulch': 'copy'
        };
        
        this.container.style.cursor = cursors[tool] || 'default';
        
        // Atualiza botões ativos
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeButton = document.querySelector(`[data-tool="${tool}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }

    /**
     * Define a cultura selecionada
     */
    setCrop(cropType) {
        this.selectedCrop = cropType;
    }

    /**
     * Obtém a fazenda ativa
     */
    getActiveFarm() {
        return this.activeFarm;
    }

    /**
     * Define a fazenda ativa
     */
    setActiveFarm(farmId) {
        // Implementar quando houver múltiplas fazendas
        console.log(`Mudando para fazenda: ${farmId}`);
    }

    /**
     * Inicia o loop de atualização
     */
    start() {
        this.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop();
    }

    /**
     * Para o loop de atualização
     */
    stop() {
        this.isRunning = false;
    }

    /**
     * Loop principal do jogo
     */
    gameLoop() {
        if (!this.isRunning) return;
        
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        
        requestAnimationFrame(() => this.gameLoop());
    }

    /**
     * Atualiza o estado do jogo
     */
    update(deltaTime) {
        if (this.activeFarm) {
            this.activeFarm.update(deltaTime);
            
            // Atualiza display apenas se necessário
            if (this.activeFarm.needsDisplayUpdate) {
                this.updateFarmDisplay();
                this.activeFarm.needsDisplayUpdate = false;
            }
        }
    }

    /**
     * Destrói o sistema e limpa recursos
     */
    destroy() {
        this.stop();
        
        if (this.container) {
            this.container.removeEventListener('mousemove', this.handleMouseMove);
            this.container.removeEventListener('mousedown', this.handleMouseDown);
            this.container.removeEventListener('mouseup', this.handleMouseUp);
            this.container.removeEventListener('wheel', this.handleWheel);
            this.container.innerHTML = '';
        }
        
        // Remove tooltip se existir
        const tooltip = document.getElementById('plot-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
        
        // Remove estilos se não há outras instâncias
        const style = document.getElementById('html-farm-styles');
        if (style) {
            style.remove();
        }
    }
}

/**
 * Classe para representar uma fazenda HTML
 */
class HtmlFarm {
    constructor(id, name, width, height) {
        this.id = id;
        this.name = name;
        this.width = width;
        this.height = height;
        this.plots = new Map();
        this.needsDisplayUpdate = false;
    }

    /**
     * Adiciona uma parcela à fazenda
     */
    addPlot(x, y, soilType = 'soil') {
        const key = `${x},${y}`;
        if (!this.plots.has(key)) {
            this.plots.set(key, new HtmlFarmPlot(x, y, soilType));
            this.needsDisplayUpdate = true;
        }
    }

    /**
     * Obtém uma parcela específica
     */
    getPlot(x, y) {
        const key = `${x},${y}`;
        return this.plots.get(key);
    }

    /**
     * Planta uma cultura em uma parcela
     */
    plantCrop(x, y, cropType) {
        const plot = this.getPlot(x, y);
        if (plot && !plot.crop) {
            plot.plantCrop(cropType);
            this.needsDisplayUpdate = true;
            return true;
        }
        return false;
    }

    /**
     * Colhe uma cultura de uma parcela
     */
    harvestCrop(x, y) {
        const plot = this.getPlot(x, y);
        if (plot && plot.crop && plot.crop.isReady()) {
            const cropYield = plot.crop.calculateYield();
            plot.crop = null;
            this.needsDisplayUpdate = true;
            return cropYield;
        }
        return false;
    }

    /**
     * Conta o número de culturas na fazenda
     */
    getCropCount() {
        let count = 0;
        this.plots.forEach(plot => {
            if (plot.crop) count++;
        });
        return count;
    }

    /**
     * Atualiza todas as parcelas da fazenda
     */
    update(deltaTime) {
        let hasChanges = false;
        this.plots.forEach(plot => {
            if (plot.update(deltaTime)) {
                hasChanges = true;
            }
        });
        
        if (hasChanges) {
            this.needsDisplayUpdate = true;
        }
    }
}

/**
 * Classe para representar uma parcela da fazenda HTML
 */
class HtmlFarmPlot {
    constructor(x, y, soilType = 'soil') {
        this.x = x;
        this.y = y;
        this.soilType = soilType;
        this.crop = null;
        this.waterLevel = 0.5;
        this.fertilityLevel = 0.5;
        this.lastWatered = 0;
        this.lastFertilized = 0;
    }

    /**
     * Planta uma cultura na parcela
     */
    plantCrop(cropType) {
        if (!this.crop) {
            this.crop = new HtmlVisualCrop(cropType);
            return true;
        }
        return false;
    }

    /**
     * Rega a parcela
     */
    water() {
        this.waterLevel = Math.min(1, this.waterLevel + 0.3);
        this.lastWatered = Date.now();
    }

    /**
     * Fertiliza a parcela
     */
    fertilize() {
        this.fertilityLevel = Math.min(1, this.fertilityLevel + 0.4);
        this.lastFertilized = Date.now();
    }

    /**
     * Atualiza a parcela
     */
    update(deltaTime) {
        let hasChanges = false;
        
        // Diminui água e fertilidade ao longo do tempo
        const waterDecay = deltaTime * 0.00001;
        const fertilityDecay = deltaTime * 0.000005;
        
        if (this.waterLevel > 0) {
            this.waterLevel = Math.max(0, this.waterLevel - waterDecay);
            hasChanges = true;
        }
        
        if (this.fertilityLevel > 0) {
            this.fertilityLevel = Math.max(0, this.fertilityLevel - fertilityDecay);
            hasChanges = true;
        }
        
        // Atualiza cultura se existir
        if (this.crop) {
            if (this.crop.update(deltaTime, this.waterLevel, this.fertilityLevel)) {
                hasChanges = true;
            }
        }
        
        return hasChanges;
    }
}

/**
 * Classe para representar uma cultura visual HTML
 */
class HtmlVisualCrop {
    constructor(type) {
        this.type = type;
        this.stage = 'seed';
        this.progress = 0;
        this.growthRate = this.getGrowthRate(type);
        this.stages = ['seed', 'seedling', 'growing', 'mature', 'ready'];
        this.stageProgress = 0;
    }

    /**
     * Obtém a taxa de crescimento baseada no tipo de cultura
     */
    getGrowthRate(type) {
        const rates = {
            'wheat': 0.00002,
            'corn': 0.000015,
            'soy': 0.000018,
            'rice': 0.000025,
            'cotton': 0.000012,
            'tomato': 0.00003,
            'potato': 0.000022,
            'carrot': 0.000028
        };
        
        return rates[type] || 0.00002;
    }

    /**
     * Atualiza a cultura
     */
    update(deltaTime, waterLevel, fertilityLevel) {
        if (this.stage === 'ready') return false;
        
        // Calcula taxa de crescimento baseada nas condições
        const waterBonus = waterLevel > 0.3 ? 1 + (waterLevel - 0.3) : 0.5;
        const fertilityBonus = fertilityLevel > 0.3 ? 1 + (fertilityLevel - 0.3) : 0.5;
        const growthMultiplier = waterBonus * fertilityBonus;
        
        const oldStage = this.stage;
        this.progress += this.growthRate * deltaTime * growthMultiplier;
        this.progress = Math.min(1, this.progress);
        
        // Atualiza estágio baseado no progresso
        const stageIndex = Math.floor(this.progress * this.stages.length);
        this.stage = this.stages[Math.min(stageIndex, this.stages.length - 1)];
        
        return oldStage !== this.stage;
    }

    /**
     * Verifica se a cultura está pronta para colheita
     */
    isReady() {
        return this.stage === 'ready';
    }

    /**
     * Calcula o rendimento da colheita
     */
    calculateYield() {
        return Math.floor(this.progress * 10) + 1;
    }
}

// Exporta as classes para uso global
if (typeof window !== 'undefined') {
    window.HtmlFarmSystem = HtmlFarmSystem;
    window.HtmlFarm = HtmlFarm;
    window.HtmlFarmPlot = HtmlFarmPlot;
    window.HtmlVisualCrop = HtmlVisualCrop;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HtmlFarmSystem, HtmlFarm, HtmlFarmPlot, HtmlVisualCrop };
}