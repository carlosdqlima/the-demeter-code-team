/**
 * Sistema Visual de Fazendas - FarmVerse
 * Sistema completo de fazendas com representação visual usando Canvas
 * Similar ao Top Crop com funcionalidades avançadas
 */

class VisualFarmSystem {
    constructor(canvasId = 'farm-canvas', gameInstance = null) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`❌ Canvas com ID '${canvasId}' não encontrado`);
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        this.gameInstance = gameInstance;
        
        // Configurações do sistema
        this.config = {
            gridSize: 24,           // Tamanho de cada célula da fazenda (reduzido para melhor visualização)
            farmWidth: 20,          // Largura da fazenda em células
            farmHeight: 15,         // Altura da fazenda em células
            animationSpeed: 60,     // FPS para animações
            zoomLevels: [0.3, 0.5, 0.75, 1.0, 1.25, 1.5],
            currentZoom: 0.3        // Zoom inicial mínimo para visualização adequada
        };
        
        // Estado do sistema
        this.farms = new Map();
        this.activeFarm = null;
        this.selectedTool = 'plant';
        this.selectedCrop = 'trigo';
        this.isRunning = false;
        this.lastUpdate = 0;
        
        // Controles de interação
        this.mouse = {
            x: 0, y: 0,
            isDown: false,
            button: 0
        };
        
        this.camera = {
            x: 0, y: 0,
            targetX: 0, targetY: 0
        };
        
        // Recursos visuais
        this.sprites = new Map();
        this.animations = new Map();
        this.particles = [];
        
        // Bind de métodos
        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleWheel = this.handleWheel.bind(this);
        
        this.initialize();
    }

    /**
     * Inicializa o sistema visual de fazendas
     */
    async initialize() {
        console.log('🎨 Inicializando Sistema Visual de Fazendas...');
        
        // Configura o canvas
        this.setupCanvas();
        
        // Carrega recursos visuais
        await this.loadAssets();
        
        // Configura eventos de entrada
        this.setupEventListeners();
        
        // Cria fazenda inicial
        this.createDefaultFarm();
        
        // Inicia o loop de renderização
        this.start();
        
        console.log('✅ Sistema Visual de Fazendas inicializado');
    }

    /**
     * Configura o canvas e suas propriedades
     */
    setupCanvas() {
        // Garante que o canvas esteja visível e ativo
        this.canvas.style.display = 'block';
        this.canvas.style.visibility = 'visible';
        this.canvas.style.opacity = '1';
        this.canvas.style.pointerEvents = 'auto';
        
        // Ajusta o tamanho do canvas
        this.resizeCanvas();
        
        // Força um redimensionamento após um pequeno delay para garantir que o container esteja pronto
        setTimeout(() => {
            this.resizeCanvas();
            this.centerCameraOnFarm(); // Centraliza a câmera após redimensionamento
            this.render(); // Força uma renderização inicial
        }, 100);
        
        // Configura propriedades de renderização
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Listener para redimensionamento
        window.addEventListener('resize', () => {
            setTimeout(() => this.resizeCanvas(), 50);
        });
        
        // Listener para mudanças de zoom
        window.addEventListener('wheel', (e) => {
            if (e.ctrlKey) {
                setTimeout(() => this.resizeCanvas(), 100);
            }
        });
        
        console.log('🎨 Canvas configurado e ativado');
    }

    /**
     * Redimensiona o canvas para ocupar o container
     */
    resizeCanvas() {
        const container = this.canvas.parentElement;
        if (!container) {
            console.warn('⚠️ Container do canvas não encontrado');
            return;
        }
        
        // Obtém as dimensões reais do container, independente do zoom
        const rect = container.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(container);
        
        // Calcula as dimensões considerando padding e border
        const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
        const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
        const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
        const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
        
        const borderLeft = parseFloat(computedStyle.borderLeftWidth) || 0;
        const borderRight = parseFloat(computedStyle.borderRightWidth) || 0;
        const borderTop = parseFloat(computedStyle.borderTopWidth) || 0;
        const borderBottom = parseFloat(computedStyle.borderBottomWidth) || 0;
        
        // Dimensões efetivas do canvas
        const effectiveWidth = rect.width - paddingLeft - paddingRight - borderLeft - borderRight;
        const effectiveHeight = rect.height - paddingTop - paddingBottom - borderTop - borderBottom;
        
        // Define as dimensões do canvas
        this.canvas.width = Math.max(effectiveWidth, 100); // Mínimo de 100px
        this.canvas.height = Math.max(effectiveHeight, 100); // Mínimo de 100px
        
        // Ajusta o estilo CSS para garantir que o canvas ocupe todo o espaço
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.display = 'block';
        
        console.log(`🎨 Canvas redimensionado: ${this.canvas.width}x${this.canvas.height}`);
    }

    /**
     * Carrega assets visuais (sprites, texturas, etc.)
     */
    async loadAssets() {
        // Cria sprites procedurais para as culturas
        await this.createCropSprites();
        
        // Cria texturas para o terreno
        this.createTerrainTextures();
        
        // Cria sprites para ferramentas e UI
        this.createUISprites();
    }

    /**
     * Cria sprites procedurais para as diferentes culturas
     */
    async createCropSprites() {
        const cropTypes = Object.keys(window.cropsData || {});
        
        for (const cropType of cropTypes) {
            const cropData = window.cropsData[cropType];
            
            // Cria sprites para cada estágio de crescimento
            const stages = ['planted', 'growing', 'mature', 'ready'];
            const cropSprites = {};
            
            for (let i = 0; i < stages.length; i++) {
                const stage = stages[i];
                cropSprites[stage] = this.generateCropSprite(cropType, stage, i / (stages.length - 1));
            }
            
            this.sprites.set(cropType, cropSprites);
        }
    }

    /**
     * Gera sprite procedural para uma cultura em determinado estágio
     */
    generateCropSprite(cropType, stage, progress) {
        const canvas = document.createElement('canvas');
        canvas.width = this.config.gridSize;
        canvas.height = this.config.gridSize;
        const ctx = canvas.getContext('2d');
        
        const cropData = window.cropsData[cropType];
        const colors = this.getCropColors(cropType);
        
        // Desenha baseado no tipo de cultura e estágio
        switch (cropData.category) {
            case 'grãos':
                this.drawGrainCrop(ctx, colors, stage, progress);
                break;
            case 'leguminosas':
                this.drawLegumeCrop(ctx, colors, stage, progress);
                break;
            case 'oleaginosas':
                this.drawOilseedCrop(ctx, colors, stage, progress);
                break;
            case 'frutas':
                this.drawFruitCrop(ctx, colors, stage, progress);
                break;
            default:
                this.drawGenericCrop(ctx, colors, stage, progress);
        }
        
        return canvas;
    }

    /**
     * Retorna cores específicas para cada tipo de cultura
     */
    getCropColors(cropType) {
        const colorMap = {
            'trigo': { stem: '#8B7355', leaf: '#9ACD32', fruit: '#DAA520' },
            'milho': { stem: '#228B22', leaf: '#32CD32', fruit: '#FFD700' },
            'soja': { stem: '#556B2F', leaf: '#6B8E23', fruit: '#8FBC8F' },
            'arroz': { stem: '#9ACD32', leaf: '#ADFF2F', fruit: '#F5DEB3' },
            'algodão': { stem: '#8FBC8F', leaf: '#90EE90', fruit: '#FFFAFA' },
            'cana-de-açúcar': { stem: '#32CD32', leaf: '#228B22', fruit: '#DDA0DD' },
            'girassol': { stem: '#228B22', leaf: '#32CD32', fruit: '#FFD700' },
            'cevada': { stem: '#8B7355', leaf: '#9ACD32', fruit: '#DEB887' },
            'uva': { stem: '#8B4513', leaf: '#228B22', fruit: '#800080' }
        };
        
        return colorMap[cropType] || { stem: '#228B22', leaf: '#32CD32', fruit: '#FFD700' };
    }

    /**
     * Desenha cultura de grãos (trigo, milho, arroz, etc.)
     */
    drawGrainCrop(ctx, colors, stage, progress) {
        const size = this.config.gridSize;
        const centerX = size / 2;
        const centerY = size / 2;
        
        if (stage === 'planted') {
            // Semente no solo
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(centerX - 2, centerY + 8, 4, 2);
        } else {
            // Caule
            const stemHeight = 8 + (progress * 12);
            ctx.fillStyle = colors.stem;
            ctx.fillRect(centerX - 1, centerY + 8 - stemHeight, 2, stemHeight);
            
            // Folhas
            if (progress > 0.3) {
                ctx.fillStyle = colors.leaf;
                const leafSize = 2 + (progress * 3);
                ctx.fillRect(centerX - leafSize, centerY + 2 - stemHeight/2, leafSize, 2);
                ctx.fillRect(centerX + 1, centerY + 2 - stemHeight/2, leafSize, 2);
            }
            
            // Fruto/grão
            if (stage === 'ready') {
                ctx.fillStyle = colors.fruit;
                ctx.fillRect(centerX - 3, centerY - stemHeight - 4, 6, 4);
            }
        }
    }

    /**
     * Desenha cultura de leguminosas (soja)
     */
    drawLegumeCrop(ctx, colors, stage, progress) {
        const size = this.config.gridSize;
        const centerX = size / 2;
        const centerY = size / 2;
        
        if (stage === 'planted') {
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(centerX - 2, centerY + 8, 4, 2);
        } else {
            // Caule principal
            const stemHeight = 6 + (progress * 10);
            ctx.fillStyle = colors.stem;
            ctx.fillRect(centerX - 1, centerY + 8 - stemHeight, 2, stemHeight);
            
            // Folhas trifoliadas
            if (progress > 0.2) {
                ctx.fillStyle = colors.leaf;
                const leafY = centerY + 4 - stemHeight * 0.7;
                
                // Folha central
                ctx.fillRect(centerX - 2, leafY - 2, 4, 3);
                // Folhas laterais
                ctx.fillRect(centerX - 4, leafY, 2, 2);
                ctx.fillRect(centerX + 2, leafY, 2, 2);
            }
            
            // Vagens
            if (stage === 'ready') {
                ctx.fillStyle = colors.fruit;
                ctx.fillRect(centerX - 1, centerY - 2, 2, 6);
                ctx.fillRect(centerX + 2, centerY, 2, 4);
            }
        }
    }

    /**
     * Desenha cultura oleaginosa (girassol)
     */
    drawOilseedCrop(ctx, colors, stage, progress) {
        const size = this.config.gridSize;
        const centerX = size / 2;
        const centerY = size / 2;
        
        if (stage === 'planted') {
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(centerX - 2, centerY + 8, 4, 2);
        } else {
            // Caule grosso
            const stemHeight = 10 + (progress * 14);
            ctx.fillStyle = colors.stem;
            ctx.fillRect(centerX - 2, centerY + 8 - stemHeight, 4, stemHeight);
            
            // Folhas grandes
            if (progress > 0.3) {
                ctx.fillStyle = colors.leaf;
                const leafSize = 3 + (progress * 2);
                ctx.fillRect(centerX - leafSize, centerY + 2 - stemHeight/2, leafSize, 3);
                ctx.fillRect(centerX + 2, centerY + 2 - stemHeight/2, leafSize, 3);
            }
            
            // Flor/cabeça do girassol
            if (stage === 'ready') {
                ctx.fillStyle = colors.fruit;
                ctx.beginPath();
                ctx.arc(centerX, centerY - stemHeight - 2, 6, 0, Math.PI * 2);
                ctx.fill();
                
                // Centro da flor
                ctx.fillStyle = '#8B4513';
                ctx.beginPath();
                ctx.arc(centerX, centerY - stemHeight - 2, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    /**
     * Desenha cultura de frutas (uva)
     */
    drawFruitCrop(ctx, colors, stage, progress) {
        const size = this.config.gridSize;
        const centerX = size / 2;
        const centerY = size / 2;
        
        if (stage === 'planted') {
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(centerX - 2, centerY + 8, 4, 2);
        } else {
            // Tronco/caule
            const stemHeight = 8 + (progress * 12);
            ctx.fillStyle = colors.stem;
            ctx.fillRect(centerX - 2, centerY + 8 - stemHeight, 4, stemHeight);
            
            // Galhos
            if (progress > 0.4) {
                ctx.fillStyle = colors.stem;
                ctx.fillRect(centerX - 6, centerY + 2 - stemHeight/2, 4, 2);
                ctx.fillRect(centerX + 2, centerY + 2 - stemHeight/2, 4, 2);
            }
            
            // Folhas
            if (progress > 0.3) {
                ctx.fillStyle = colors.leaf;
                ctx.fillRect(centerX - 4, centerY - stemHeight/2, 3, 4);
                ctx.fillRect(centerX + 1, centerY - stemHeight/2, 3, 4);
            }
            
            // Cachos de uva
            if (stage === 'ready') {
                ctx.fillStyle = colors.fruit;
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 2; j++) {
                        ctx.beginPath();
                        ctx.arc(centerX - 2 + j * 4, centerY - 4 + i * 2, 1, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
        }
    }

    /**
     * Desenha cultura genérica
     */
    drawGenericCrop(ctx, colors, stage, progress) {
        this.drawGrainCrop(ctx, colors, stage, progress);
    }

    /**
     * Cria texturas para diferentes tipos de terreno
     */
    createTerrainTextures() {
        const terrainTypes = ['soil', 'irrigated', 'fertilized', 'empty'];
        
        for (const type of terrainTypes) {
            const canvas = document.createElement('canvas');
            canvas.width = this.config.gridSize;
            canvas.height = this.config.gridSize;
            const ctx = canvas.getContext('2d');
            
            this.drawTerrainTexture(ctx, type);
            this.sprites.set(`terrain_${type}`, canvas);
        }
    }

    /**
     * Desenha textura de terreno
     */
    drawTerrainTexture(ctx, type) {
        const size = this.config.gridSize;
        
        switch (type) {
            case 'soil':
                // Solo arado
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(0, 0, size, size);
                
                // Linhas de arado
                ctx.strokeStyle = '#654321';
                ctx.lineWidth = 1;
                for (let i = 0; i < size; i += 4) {
                    ctx.beginPath();
                    ctx.moveTo(0, i);
                    ctx.lineTo(size, i);
                    ctx.stroke();
                }
                break;
                
            case 'irrigated':
                // Solo irrigado
                ctx.fillStyle = '#5D4037';
                ctx.fillRect(0, 0, size, size);
                
                // Pontos de umidade
                ctx.fillStyle = '#1976D2';
                for (let i = 0; i < 8; i++) {
                    const x = Math.random() * size;
                    const y = Math.random() * size;
                    ctx.fillRect(x, y, 2, 2);
                }
                break;
                
            case 'fertilized':
                // Solo fertilizado
                ctx.fillStyle = '#3E2723';
                ctx.fillRect(0, 0, size, size);
                
                // Partículas de fertilizante
                ctx.fillStyle = '#FFC107';
                for (let i = 0; i < 6; i++) {
                    const x = Math.random() * size;
                    const y = Math.random() * size;
                    ctx.fillRect(x, y, 1, 1);
                }
                break;
                
            case 'empty':
                // Terra vazia
                ctx.fillStyle = '#A1887F';
                ctx.fillRect(0, 0, size, size);
                
                // Textura de grama
                ctx.fillStyle = '#4CAF50';
                for (let i = 0; i < 12; i++) {
                    const x = Math.random() * size;
                    const y = Math.random() * size;
                    ctx.fillRect(x, y, 1, 3);
                }
                break;
        }
        
        // Borda da célula
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(0, 0, size, size);
    }

    /**
     * Cria sprites para UI e ferramentas
     */
    createUISprites() {
        // Cursor de plantio
        const plantCursor = document.createElement('canvas');
        plantCursor.width = this.config.gridSize;
        plantCursor.height = this.config.gridSize;
        const plantCtx = plantCursor.getContext('2d');
        
        plantCtx.strokeStyle = '#4CAF50';
        plantCtx.lineWidth = 2;
        plantCtx.strokeRect(2, 2, this.config.gridSize - 4, this.config.gridSize - 4);
        plantCtx.fillStyle = 'rgba(76, 175, 80, 0.3)';
        plantCtx.fillRect(2, 2, this.config.gridSize - 4, this.config.gridSize - 4);
        
        this.sprites.set('cursor_plant', plantCursor);
        
        // Cursor de colheita
        const harvestCursor = document.createElement('canvas');
        harvestCursor.width = this.config.gridSize;
        harvestCursor.height = this.config.gridSize;
        const harvestCtx = harvestCursor.getContext('2d');
        
        harvestCtx.strokeStyle = '#FF9800';
        harvestCtx.lineWidth = 2;
        harvestCtx.strokeRect(2, 2, this.config.gridSize - 4, this.config.gridSize - 4);
        harvestCtx.fillStyle = 'rgba(255, 152, 0, 0.3)';
        harvestCtx.fillRect(2, 2, this.config.gridSize - 4, this.config.gridSize - 4);
        
        this.sprites.set('cursor_harvest', harvestCursor);
    }

    /**
     * Configura event listeners para interação
     */
    setupEventListeners() {
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
        this.canvas.addEventListener('wheel', this.handleWheel);
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    /**
     * Cria fazenda padrão para demonstração
     */
    createDefaultFarm() {
        const farm = new VisualFarm('farm_1', 'Fazenda Principal', this.config.farmWidth, this.config.farmHeight);
        this.farms.set('farm_1', farm);
        this.activeFarm = farm;
        
        // Adiciona alguns plots de exemplo
        for (let x = 2; x < 8; x++) {
            for (let y = 2; y < 6; y++) {
                farm.addPlot(x, y, 'soil');
            }
        }
        
        // Planta algumas culturas de exemplo
        farm.plantCrop(3, 3, 'trigo');
        farm.plantCrop(4, 3, 'milho');
        farm.plantCrop(5, 3, 'soja');
        
        // Centraliza a câmera na fazenda
        this.centerCameraOnFarm();
    }

    /**
     * Centraliza a câmera na fazenda ativa
     */
    centerCameraOnFarm() {
        if (!this.activeFarm || !this.canvas) return;
        
        // Calcula o centro da fazenda em pixels
        const farmCenterX = (this.activeFarm.width * this.config.gridSize) / 2;
        const farmCenterY = (this.activeFarm.height * this.config.gridSize) / 2;
        
        // Calcula o centro do canvas
        const canvasCenterX = this.canvas.width / 2;
        const canvasCenterY = this.canvas.height / 2;
        
        // Posiciona a câmera para centralizar a fazenda
        this.camera.x = farmCenterX - canvasCenterX / this.config.currentZoom;
        this.camera.y = farmCenterY - canvasCenterY / this.config.currentZoom;
        this.camera.targetX = this.camera.x;
        this.camera.targetY = this.camera.y;
        
        console.log('📷 Câmera centralizada na fazenda');
    }

    /**
     * Inicia o loop de renderização
     */
    start() {
        this.isRunning = true;
        this.lastUpdate = performance.now();
        this.gameLoop();
    }

    /**
     * Para o loop de renderização
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
        const deltaTime = currentTime - this.lastUpdate;
        
        this.update(deltaTime);
        this.render();
        
        this.lastUpdate = currentTime;
        requestAnimationFrame(() => this.gameLoop());
    }

    /**
     * Atualiza lógica do jogo
     */
    update(deltaTime) {
        // Atualiza câmera
        this.updateCamera(deltaTime);
        
        // Atualiza fazendas
        if (this.activeFarm) {
            this.activeFarm.update(deltaTime);
        }
        
        // Atualiza partículas
        this.updateParticles(deltaTime);
    }

    /**
     * Atualiza posição da câmera
     */
    updateCamera(deltaTime) {
        const lerpFactor = Math.min(deltaTime / 100, 1);
        
        this.camera.x += (this.camera.targetX - this.camera.x) * lerpFactor;
        this.camera.y += (this.camera.targetY - this.camera.y) * lerpFactor;
    }

    /**
     * Atualiza sistema de partículas
     */
    updateParticles(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update(deltaTime);
            
            if (particle.isDead()) {
                this.particles.splice(i, 1);
            }
        }
    }

    /**
     * Renderiza o jogo
     */
    render() {
        // Limpa o canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Salva estado do contexto
        this.ctx.save();
        
        // Aplica transformações da câmera
        this.ctx.translate(-this.camera.x, -this.camera.y);
        this.ctx.scale(this.config.currentZoom, this.config.currentZoom);
        
        // Renderiza fazenda ativa
        if (this.activeFarm) {
            this.renderFarm(this.activeFarm);
        }
        
        // Renderiza partículas
        this.renderParticles();
        
        // Restaura estado do contexto
        this.ctx.restore();
        
        // Renderiza UI
        this.renderUI();
    }

    /**
     * Renderiza uma fazenda
     */
    renderFarm(farm) {
        const gridSize = this.config.gridSize;
        
        // Renderiza grid de fundo
        this.renderGrid(farm);
        
        // Renderiza plots
        for (const [key, plot] of farm.plots) {
            const x = plot.x * gridSize;
            const y = plot.y * gridSize;
            
            // Renderiza terreno
            const terrainSprite = this.sprites.get(`terrain_${plot.soilType}`);
            if (terrainSprite) {
                this.ctx.drawImage(terrainSprite, x, y);
            }
            
            // Renderiza cultura se existir
            if (plot.crop) {
                this.renderCrop(plot.crop, x, y);
            }
        }
        
        // Renderiza cursor se mouse estiver sobre a fazenda
        this.renderCursor();
    }

    /**
     * Renderiza grid de fundo da fazenda
     */
    renderGrid(farm) {
        const gridSize = this.config.gridSize;
        const width = farm.width * gridSize;
        const height = farm.height * gridSize;
        
        // Fundo da fazenda
        this.ctx.fillStyle = '#E8F5E8';
        this.ctx.fillRect(0, 0, width, height);
        
        // Linhas do grid
        this.ctx.strokeStyle = '#C8E6C9';
        this.ctx.lineWidth = 1;
        
        // Linhas verticais
        for (let x = 0; x <= farm.width; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * gridSize, 0);
            this.ctx.lineTo(x * gridSize, height);
            this.ctx.stroke();
        }
        
        // Linhas horizontais
        for (let y = 0; y <= farm.height; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * gridSize);
            this.ctx.lineTo(width, y * gridSize);
            this.ctx.stroke();
        }
    }

    /**
     * Renderiza uma cultura
     */
    renderCrop(crop, x, y) {
        const cropSprites = this.sprites.get(crop.type);
        if (!cropSprites) return;
        
        const sprite = cropSprites[crop.stage];
        if (sprite) {
            this.ctx.drawImage(sprite, x, y);
        }
        
        // Renderiza barra de progresso se a cultura estiver crescendo
        if (crop.stage !== 'ready' && crop.stage !== 'planted') {
            this.renderGrowthProgress(crop, x, y);
        }
    }

    /**
     * Renderiza barra de progresso do crescimento
     */
    renderGrowthProgress(crop, x, y) {
        const barWidth = this.config.gridSize - 4;
        const barHeight = 3;
        const barX = x + 2;
        const barY = y + this.config.gridSize - 6;
        
        // Fundo da barra
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Progresso
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.fillRect(barX, barY, barWidth * crop.growthProgress, barHeight);
    }

    /**
     * Renderiza cursor de interação
     */
    renderCursor() {
        const gridPos = this.getGridPosition(this.mouse.x, this.mouse.y);
        if (!gridPos) return;
        
        const x = gridPos.x * this.config.gridSize;
        const y = gridPos.y * this.config.gridSize;
        
        const cursorSprite = this.sprites.get(`cursor_${this.selectedTool}`);
        if (cursorSprite) {
            this.ctx.drawImage(cursorSprite, x, y);
        }
    }

    /**
     * Renderiza sistema de partículas
     */
    renderParticles() {
        for (const particle of this.particles) {
            particle.render(this.ctx);
        }
    }

    /**
     * Renderiza interface do usuário
     */
    renderUI() {
        // Informações da fazenda
        this.renderFarmInfo();
        
        // Barra de ferramentas
        this.renderToolbar();
        
        // Informações do mouse
        this.renderMouseInfo();
    }

    /**
     * Renderiza informações da fazenda
     */
    renderFarmInfo() {
        if (!this.activeFarm) return;
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(10, 10, 200, 80);
        
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        
        this.ctx.fillText(`Fazenda: ${this.activeFarm.name}`, 20, 30);
        this.ctx.fillText(`Plots: ${this.activeFarm.plots.size}`, 20, 50);
        this.ctx.fillText(`Culturas: ${this.activeFarm.getCropCount()}`, 20, 70);
    }

    /**
     * Renderiza barra de ferramentas
     */
    renderToolbar() {
        const tools = ['plant', 'harvest', 'water', 'fertilize'];
        const toolWidth = 60;
        const toolHeight = 40;
        const startX = this.canvas.width - (tools.length * toolWidth + 20);
        const startY = 10;
        
        for (let i = 0; i < tools.length; i++) {
            const tool = tools[i];
            const x = startX + i * toolWidth;
            const y = startY;
            
            // Fundo da ferramenta
            this.ctx.fillStyle = this.selectedTool === tool ? '#4CAF50' : 'rgba(0, 0, 0, 0.8)';
            this.ctx.fillRect(x, y, toolWidth - 5, toolHeight);
            
            // Texto da ferramenta
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(tool.toUpperCase(), x + toolWidth/2 - 2.5, y + toolHeight/2);
        }
    }

    /**
     * Renderiza informações do mouse
     */
    renderMouseInfo() {
        const gridPos = this.getGridPosition(this.mouse.x, this.mouse.y);
        if (!gridPos || !this.activeFarm) return;
        
        const plot = this.activeFarm.getPlot(gridPos.x, gridPos.y);
        if (!plot) return;
        
        // Painel de informações
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this.ctx.fillRect(this.mouse.x + 10, this.mouse.y - 60, 150, 50);
        
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'left';
        
        this.ctx.fillText(`Posição: ${gridPos.x}, ${gridPos.y}`, this.mouse.x + 15, this.mouse.y - 45);
        this.ctx.fillText(`Solo: ${plot.soilType}`, this.mouse.x + 15, this.mouse.y - 30);
        
        if (plot.crop) {
            this.ctx.fillText(`Cultura: ${plot.crop.type}`, this.mouse.x + 15, this.mouse.y - 15);
        }
    }

    /**
     * Manipula movimento do mouse
     */
    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = event.clientX - rect.left;
        this.mouse.y = event.clientY - rect.top;
    }

    /**
     * Manipula clique do mouse
     */
    handleMouseDown(event) {
        this.mouse.isDown = true;
        this.mouse.button = event.button;
        
        const gridPos = this.getGridPosition(this.mouse.x, this.mouse.y);
        if (!gridPos || !this.activeFarm) return;
        
        // Executa ação baseada na ferramenta selecionada
        switch (this.selectedTool) {
            case 'plant':
                this.handlePlantAction(gridPos.x, gridPos.y);
                break;
            case 'harvest':
                this.handleHarvestAction(gridPos.x, gridPos.y);
                break;
            case 'water':
                this.handleWaterAction(gridPos.x, gridPos.y);
                break;
            case 'fertilize':
                this.handleFertilizeAction(gridPos.x, gridPos.y);
                break;
        }
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
    }

    /**
     * Converte posição do mouse para coordenadas do grid
     */
    getGridPosition(mouseX, mouseY) {
        if (!this.activeFarm) return null;
        
        // Ajusta para câmera e zoom
        const worldX = (mouseX + this.camera.x) / this.config.currentZoom;
        const worldY = (mouseY + this.camera.y) / this.config.currentZoom;
        
        const gridX = Math.floor(worldX / this.config.gridSize);
        const gridY = Math.floor(worldY / this.config.gridSize);
        
        // Verifica se está dentro dos limites da fazenda
        if (gridX >= 0 && gridX < this.activeFarm.width && gridY >= 0 && gridY < this.activeFarm.height) {
            return { x: gridX, y: gridY };
        }
        
        return null;
    }

    /**
     * Manipula ação de plantar
     */
    handlePlantAction(x, y) {
        if (!this.activeFarm.getPlot(x, y)) {
            // Cria novo plot se não existir
            this.activeFarm.addPlot(x, y, 'soil');
        }
        
        const success = this.activeFarm.plantCrop(x, y, this.selectedCrop);
        if (success) {
            this.createPlantParticles(x, y);
        }
    }

    /**
     * Manipula ação de colher
     */
    handleHarvestAction(x, y) {
        const success = this.activeFarm.harvestCrop(x, y);
        if (success) {
            this.createHarvestParticles(x, y);
        }
    }

    /**
     * Manipula ação de regar
     */
    handleWaterAction(x, y) {
        const plot = this.activeFarm.getPlot(x, y);
        if (plot) {
            plot.water();
            this.createWaterParticles(x, y);
        }
    }

    /**
     * Manipula ação de fertilizar
     */
    handleFertilizeAction(x, y) {
        const plot = this.activeFarm.getPlot(x, y);
        if (plot) {
            plot.fertilize();
            this.createFertilizeParticles(x, y);
        }
    }

    /**
     * Cria partículas de plantio
     */
    createPlantParticles(x, y) {
        const worldX = x * this.config.gridSize + this.config.gridSize / 2;
        const worldY = y * this.config.gridSize + this.config.gridSize / 2;
        
        for (let i = 0; i < 5; i++) {
            this.particles.push(new Particle(worldX, worldY, '#4CAF50', 1000));
        }
    }

    /**
     * Cria partículas de colheita
     */
    createHarvestParticles(x, y) {
        const worldX = x * this.config.gridSize + this.config.gridSize / 2;
        const worldY = y * this.config.gridSize + this.config.gridSize / 2;
        
        for (let i = 0; i < 8; i++) {
            this.particles.push(new Particle(worldX, worldY, '#FFD700', 1500));
        }
    }

    /**
     * Cria partículas de água
     */
    createWaterParticles(x, y) {
        const worldX = x * this.config.gridSize + this.config.gridSize / 2;
        const worldY = y * this.config.gridSize + this.config.gridSize / 2;
        
        for (let i = 0; i < 6; i++) {
            this.particles.push(new Particle(worldX, worldY, '#2196F3', 800));
        }
    }

    /**
     * Cria partículas de fertilizante
     */
    createFertilizeParticles(x, y) {
        const worldX = x * this.config.gridSize + this.config.gridSize / 2;
        const worldY = y * this.config.gridSize + this.config.gridSize / 2;
        
        for (let i = 0; i < 4; i++) {
            this.particles.push(new Particle(worldX, worldY, '#FFC107', 1200));
        }
    }

    /**
     * Define ferramenta ativa
     */
    setTool(tool) {
        this.selectedTool = tool;
    }

    /**
     * Define cultura selecionada
     */
    setCrop(cropType) {
        this.selectedCrop = cropType;
    }

    /**
     * Obtém fazenda ativa
     */
    getActiveFarm() {
        return this.activeFarm;
    }

    /**
     * Define fazenda ativa
     */
    setActiveFarm(farmId) {
        const farm = this.farms.get(farmId);
        if (farm) {
            this.activeFarm = farm;
        }
    }

    /**
     * Destrói o sistema e limpa recursos
     */
    destroy() {
        this.stop();
        
        // Remove event listeners
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('mousedown', this.handleMouseDown);
        this.canvas.removeEventListener('mouseup', this.handleMouseUp);
        this.canvas.removeEventListener('wheel', this.handleWheel);
        
        // Limpa recursos
        this.sprites.clear();
        this.animations.clear();
        this.particles = [];
        this.farms.clear();
    }
}

/**
 * Classe para representar uma fazenda visual
 */
class VisualFarm {
    constructor(id, name, width, height) {
        this.id = id;
        this.name = name;
        this.width = width;
        this.height = height;
        this.plots = new Map();
        this.lastUpdate = 0;
    }

    /**
     * Adiciona um plot à fazenda
     */
    addPlot(x, y, soilType = 'soil') {
        const key = `${x},${y}`;
        const plot = new FarmPlot(x, y, soilType);
        this.plots.set(key, plot);
        return plot;
    }

    /**
     * Obtém um plot específico
     */
    getPlot(x, y) {
        const key = `${x},${y}`;
        return this.plots.get(key);
    }

    /**
     * Planta uma cultura em uma posição
     */
    plantCrop(x, y, cropType) {
        const plot = this.getPlot(x, y);
        if (!plot || plot.crop) return false;
        
        plot.plantCrop(cropType);
        return true;
    }

    /**
     * Colhe uma cultura de uma posição
     */
    harvestCrop(x, y) {
        const plot = this.getPlot(x, y);
        if (!plot || !plot.crop || plot.crop.stage !== 'ready') return false;
        
        const crop = plot.crop;
        plot.crop = null;
        return crop;
    }

    /**
     * Conta o número de culturas na fazenda
     */
    getCropCount() {
        let count = 0;
        for (const plot of this.plots.values()) {
            if (plot.crop) count++;
        }
        return count;
    }

    /**
     * Atualiza a fazenda
     */
    update(deltaTime) {
        this.lastUpdate += deltaTime;
        
        // Atualiza plots a cada segundo
        if (this.lastUpdate >= 1000) {
            for (const plot of this.plots.values()) {
                plot.update(this.lastUpdate);
            }
            this.lastUpdate = 0;
        }
    }
}

/**
 * Classe para representar um plot de fazenda
 */
class FarmPlot {
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
     * Planta uma cultura no plot
     */
    plantCrop(cropType) {
        if (this.crop) return false;
        
        this.crop = new VisualCrop(cropType);
        return true;
    }

    /**
     * Rega o plot
     */
    water() {
        this.waterLevel = Math.min(1.0, this.waterLevel + 0.3);
        this.lastWatered = Date.now();
        
        if (this.soilType !== 'irrigated') {
            this.soilType = 'irrigated';
        }
    }

    /**
     * Fertiliza o plot
     */
    fertilize() {
        this.fertilityLevel = Math.min(1.0, this.fertilityLevel + 0.4);
        this.lastFertilized = Date.now();
        
        if (this.soilType !== 'fertilized') {
            this.soilType = 'fertilized';
        }
    }

    /**
     * Atualiza o plot
     */
    update(deltaTime) {
        // Diminui água e fertilidade com o tempo
        this.waterLevel = Math.max(0, this.waterLevel - 0.001 * deltaTime);
        this.fertilityLevel = Math.max(0, this.fertilityLevel - 0.0005 * deltaTime);
        
        // Atualiza tipo de solo baseado nos níveis
        if (this.waterLevel < 0.3 && this.fertilityLevel < 0.3) {
            this.soilType = 'soil';
        }
        
        // Atualiza cultura se existir
        if (this.crop) {
            this.crop.update(deltaTime, this.waterLevel, this.fertilityLevel);
        }
    }
}

/**
 * Classe para representar uma cultura visual
 */
class VisualCrop {
    constructor(type) {
        this.type = type;
        this.stage = 'planted';
        this.growthProgress = 0;
        this.plantedTime = Date.now();
        this.health = 1.0;
        
        // Obtém dados da cultura
        this.data = window.cropsData[type] || {};
        this.growthTime = this.data.growthTime || 100; // dias
    }

    /**
     * Atualiza a cultura
     */
    update(deltaTime, waterLevel, fertilityLevel) {
        // Calcula fatores de crescimento
        const waterFactor = Math.max(0.1, waterLevel);
        const fertilityFactor = Math.max(0.1, fertilityLevel);
        const growthFactor = (waterFactor + fertilityFactor) / 2;
        
        // Atualiza progresso de crescimento
        const growthRate = 1 / (this.growthTime * 24 * 60 * 60 * 1000); // Por milissegundo
        this.growthProgress += growthRate * deltaTime * growthFactor;
        this.growthProgress = Math.min(1.0, this.growthProgress);
        
        // Atualiza estágio baseado no progresso
        if (this.growthProgress >= 1.0) {
            this.stage = 'ready';
        } else if (this.growthProgress >= 0.75) {
            this.stage = 'mature';
        } else if (this.growthProgress >= 0.25) {
            this.stage = 'growing';
        }
        
        // Atualiza saúde baseada nas condições
        const healthFactor = (waterLevel + fertilityLevel) / 2;
        this.health = Math.max(0.1, Math.min(1.0, this.health + (healthFactor - 0.5) * 0.001 * deltaTime));
    }

    /**
     * Verifica se a cultura está pronta para colheita
     */
    isReady() {
        return this.stage === 'ready';
    }

    /**
     * Calcula rendimento da colheita
     */
    calculateYield() {
        const baseYield = this.data.yield?.base || 1;
        const healthMultiplier = this.health;
        return baseYield * healthMultiplier;
    }
}

/**
 * Classe para sistema de partículas
 */
class Particle {
    constructor(x, y, color, lifetime = 1000) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.color = color;
        this.lifetime = lifetime;
        this.age = 0;
        
        // Propriedades de movimento
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2 - 1;
        this.gravity = 0.001;
        this.size = 2 + Math.random() * 3;
    }

    /**
     * Atualiza a partícula
     */
    update(deltaTime) {
        this.age += deltaTime;
        
        // Atualiza posição
        this.x += this.vx * deltaTime * 0.1;
        this.y += this.vy * deltaTime * 0.1;
        this.vy += this.gravity * deltaTime;
        
        // Reduz tamanho com o tempo
        const ageRatio = this.age / this.lifetime;
        this.size = (2 + Math.random() * 3) * (1 - ageRatio);
    }

    /**
     * Renderiza a partícula
     */
    render(ctx) {
        const ageRatio = this.age / this.lifetime;
        const alpha = 1 - ageRatio;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    /**
     * Verifica se a partícula está morta
     */
    isDead() {
        return this.age >= this.lifetime;
    }
}

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.VisualFarmSystem = VisualFarmSystem;
    window.VisualFarm = VisualFarm;
    window.FarmPlot = FarmPlot;
    window.VisualCrop = VisualCrop;
    window.Particle = Particle;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VisualFarmSystem, VisualFarm, FarmPlot, VisualCrop, Particle };
}