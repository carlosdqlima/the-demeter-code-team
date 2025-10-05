/**
 * HUD (Heads-Up Display) - NASA Farm Navigators
 * Gerencia a interface do usuário com informações em tempo real
 */

class HUD {
    constructor() {
        this.isInitialized = false;
        this.elements = {};
        this.updateInterval = 1000; // 1 segundo
        this.animations = new Map();
        
        // Configurações do HUD
        this.config = {
            autoHide: false,
            compactMode: false,
            showAnimations: true,
            updateFrequency: 1000,
            notificationDuration: 5000
        };
        
        // Estado dos dados
        this.gameData = {
            player: {
                balance: 0,
                level: 1,
                experience: 0,
                experienceToNext: 100
            },
            farms: {
                total: 0,
                active: 0,
                producing: 0
            },
            weather: {
                condition: 'sunny',
                temperature: 20,
                description: 'Carregando...'
            },
            research: {
                active: null,
                progress: 0,
                points: 0
            },
            notifications: []
        };
        
        // Bind methods
        this.updateHUD = this.updateHUD.bind(this);
        this.onDataUpdated = this.onDataUpdated.bind(this);
    }

    /**
     * Inicializa o HUD
     */
    async initialize() {
        try {
            console.log('🖥️ Inicializando HUD...');
            
            // Cria elementos do HUD
            this.createHUDElements();
            
            // Configura eventos
            this.setupEventListeners();
            
            // Carrega configurações salvas
            this.loadHUDSettings();
            
            // Inicia atualizações automáticas
            this.startHUDUpdates();
            
            this.isInitialized = true;
            console.log('✅ HUD inicializado com sucesso');
            
            // Dispara evento de inicialização
            this.dispatchEvent('hudInitialized', {
                elements: Object.keys(this.elements).length
            });
            
        } catch (error) {
            console.error('❌ Erro ao inicializar HUD:', error);
            throw error;
        }
    }

    /**
     * Cria elementos do HUD
     */
    createHUDElements() {
        // Container principal do HUD
        const hudContainer = document.createElement('div');
        hudContainer.id = 'game-hud';
        hudContainer.className = 'game-hud';
        
        // Barra superior
        const topBar = this.createTopBar();
        hudContainer.appendChild(topBar);
        
        // Painel lateral esquerdo
        const leftPanel = this.createLeftPanel();
        hudContainer.appendChild(leftPanel);
        
        // Painel lateral direito
        const rightPanel = this.createRightPanel();
        hudContainer.appendChild(rightPanel);
        
        // Barra inferior
        const bottomBar = this.createBottomBar();
        hudContainer.appendChild(bottomBar);
        
        // Área de notificações
        const notificationArea = this.createNotificationArea();
        hudContainer.appendChild(notificationArea);
        
        // Adiciona ao body
        document.body.appendChild(hudContainer);
        
        // Armazena referências
        this.elements.container = hudContainer;
        this.elements.topBar = topBar;
        this.elements.leftPanel = leftPanel;
        this.elements.rightPanel = rightPanel;
        this.elements.bottomBar = bottomBar;
        this.elements.notifications = notificationArea;
        
        console.log('🖥️ Elementos do HUD criados');
    }

    /**
     * Cria barra superior
     */
    createTopBar() {
        const topBar = document.createElement('div');
        topBar.className = 'hud-top-bar';
        
        topBar.innerHTML = `
            <div class="hud-section player-info">
                <div class="player-avatar">
                    <img src="data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#4CAF50"/><text x="50" y="60" text-anchor="middle" fill="white" font-size="30">👨‍🌾</text></svg>')}" alt="Avatar">
                </div>
                <div class="player-details">
                    <div class="player-name">Fazendeiro</div>
                    <div class="player-level">Nível <span id="player-level">1</span></div>
                    <div class="experience-bar">
                        <div class="experience-fill" id="experience-fill"></div>
                        <span class="experience-text" id="experience-text">0/100 XP</span>
                    </div>
                </div>
            </div>
            
            <div class="hud-section balance-info">
                <div class="balance-display">
                    <span class="currency-icon">💰</span>
                    <span class="balance-amount" id="balance-amount">$0</span>
                </div>
                <div class="balance-change" id="balance-change"></div>
            </div>
            
            <div class="hud-section time-info">
                <div class="game-time">
                    <span class="time-icon">🕐</span>
                    <span class="time-display" id="time-display">Dia 1</span>
                </div>
                <div class="season-display" id="season-display">Primavera</div>
            </div>
        `;
        
        return topBar;
    }

    /**
     * Cria painel lateral esquerdo
     */
    createLeftPanel() {
        const leftPanel = document.createElement('div');
        leftPanel.className = 'hud-left-panel';
        
        leftPanel.innerHTML = `
            <div class="hud-widget weather-widget">
                <div class="widget-header">
                    <span class="widget-icon">🌤️</span>
                    <span class="widget-title">Clima</span>
                </div>
                <div class="widget-content">
                    <div class="weather-current">
                        <div class="weather-icon" id="weather-icon">☀️</div>
                        <div class="weather-temp" id="weather-temp">20°C</div>
                    </div>
                    <div class="weather-description" id="weather-description">Ensolarado</div>
                    <div class="weather-details">
                        <div class="weather-detail">
                            <span>Umidade:</span>
                            <span id="weather-humidity">60%</span>
                        </div>
                        <div class="weather-detail">
                            <span>Vento:</span>
                            <span id="weather-wind">10 km/h</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="hud-widget farms-widget">
                <div class="widget-header">
                    <span class="widget-icon">🚜</span>
                    <span class="widget-title">Fazendas</span>
                </div>
                <div class="widget-content">
                    <div class="farm-stats">
                        <div class="farm-stat">
                            <span class="stat-label">Total:</span>
                            <span class="stat-value" id="farms-total">0</span>
                        </div>
                        <div class="farm-stat">
                            <span class="stat-label">Ativas:</span>
                            <span class="stat-value" id="farms-active">0</span>
                        </div>
                        <div class="farm-stat">
                            <span class="stat-label">Produzindo:</span>
                            <span class="stat-value" id="farms-producing">0</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return leftPanel;
    }

    /**
     * Cria painel lateral direito
     */
    createRightPanel() {
        const rightPanel = document.createElement('div');
        rightPanel.className = 'hud-right-panel';
        
        rightPanel.innerHTML = `
            <div class="hud-widget research-widget">
                <div class="widget-header">
                    <span class="widget-icon">🔬</span>
                    <span class="widget-title">Pesquisa</span>
                </div>
                <div class="widget-content">
                    <div class="research-current" id="research-current">
                        <div class="research-none">Nenhuma pesquisa ativa</div>
                    </div>
                    <div class="research-points">
                        <span class="points-icon">🧪</span>
                        <span class="points-amount" id="research-points">0</span>
                        <span class="points-label">Pontos</span>
                    </div>
                </div>
            </div>
            
            <div class="hud-widget quick-actions">
                <div class="widget-header">
                    <span class="widget-icon">⚡</span>
                    <span class="widget-title">Ações Rápidas</span>
                </div>
                <div class="widget-content">
                    <button class="quick-action-btn" id="btn-plant-crops">
                        <span class="btn-icon">🌱</span>
                        <span class="btn-text">Plantar</span>
                    </button>
                    <button class="quick-action-btn" id="btn-harvest-crops">
                        <span class="btn-icon">🌾</span>
                        <span class="btn-text">Colher</span>
                    </button>
                    <button class="quick-action-btn" id="btn-water-crops">
                        <span class="btn-icon">💧</span>
                        <span class="btn-text">Irrigar</span>
                    </button>
                    <button class="quick-action-btn" id="btn-market">
                        <span class="btn-icon">🏪</span>
                        <span class="btn-text">Mercado</span>
                    </button>
                </div>
            </div>
            
            <div class="hud-widget farm-care">
                <div class="widget-header">
                    <span class="widget-icon">🚜</span>
                    <span class="widget-title">Cuidados da Fazenda</span>
                </div>
                <div class="widget-content">
                    <button class="quick-action-btn tool-btn" id="btn-irrigation" data-tool="irrigation" draggable="true">
                        <span class="btn-icon">🚿</span>
                        <span class="btn-text">Sistema de Irrigação</span>
                    </button>
                    <button class="quick-action-btn tool-btn" id="btn-fertilize" data-tool="fertilize" draggable="true">
                        <span class="btn-icon">🧪</span>
                        <span class="btn-text">Fertilizar</span>
                    </button>
                    <button class="quick-action-btn tool-btn" id="btn-pesticide" data-tool="pesticide" draggable="true">
                        <span class="btn-icon">🦟</span>
                        <span class="btn-text">Pesticida</span>
                    </button>
                    <button class="quick-action-btn tool-btn" id="btn-organic-fertilizer" data-tool="organic-fertilizer" draggable="true">
                        <span class="btn-icon">🌿</span>
                        <span class="btn-text">Adubo Orgânico</span>
                    </button>
                    <button class="quick-action-btn tool-btn" id="btn-soil-analysis" data-tool="soil-analysis" draggable="true">
                        <span class="btn-icon">🔬</span>
                        <span class="btn-text">Análise do Solo</span>
                    </button>
                    <button class="quick-action-btn tool-btn" id="btn-clean" data-tool="clean" draggable="true">
                        <span class="btn-icon">🧹</span>
                        <span class="btn-text">Limpeza</span>
                    </button>
                    <button class="quick-action-btn tool-btn" id="btn-mulch" data-tool="mulch" draggable="true">
                        <span class="btn-icon">🍂</span>
                        <span class="btn-text">Cobertura</span>
                    </button>
                    <button class="quick-action-btn tool-btn" id="btn-water" data-tool="water" draggable="true">
                        <span class="btn-icon">💧</span>
                        <span class="btn-text">Regar</span>
                    </button>
                    <button class="quick-action-btn tool-btn" id="btn-smart-irrigation" data-tool="smart-irrigation" draggable="true">
                        <span class="btn-icon">🚿</span>
                        <span class="btn-text">Irrigação Inteligente</span>
                    </button>
                    <button class="quick-action-btn tool-btn" id="btn-livestock-management" data-tool="livestock-management" draggable="true">
                        <span class="btn-icon">🐮</span>
                        <span class="btn-text">Manejo de Gado</span>
                    </button>
                    <button class="quick-action-btn tool-btn" id="btn-environmental-monitoring" data-tool="environmental-monitoring" draggable="true">
                        <span class="btn-icon">📊</span>
                        <span class="btn-text">Monitoramento Ambiental</span>
                    </button>
                    <button class="quick-action-btn tool-btn" id="btn-precision-fertilization" data-tool="precision-fertilization" draggable="true">
                        <span class="btn-icon">🎯</span>
                        <span class="btn-text">Fertilização de Precisão</span>
                    </button>
                    <button class="quick-action-btn tool-btn" id="btn-crop-rotation" data-tool="crop-rotation" draggable="true">
                        <span class="btn-icon">🔄</span>
                        <span class="btn-text">Rotação de Culturas</span>
                    </button>
                </div>
            </div>
        `;
        
        return rightPanel;
    }

    /**
     * Cria barra inferior
     */
    createBottomBar() {
        const bottomBar = document.createElement('div');
        bottomBar.className = 'hud-bottom-bar';
        
        bottomBar.innerHTML = `
            <div class="hud-section resources-info">
                <div class="resource-item">
                    <span class="resource-icon">🌾</span>
                    <span class="resource-amount" id="resource-crops">0</span>
                </div>
                <div class="resource-item">
                    <span class="resource-icon">💧</span>
                    <span class="resource-amount" id="resource-water">100%</span>
                </div>
                <div class="resource-item">
                    <span class="resource-icon">⚡</span>
                    <span class="resource-amount" id="resource-energy">100%</span>
                </div>
                <div class="resource-item">
                    <span class="resource-icon">🧪</span>
                    <span class="resource-amount" id="resource-fertilizer">0</span>
                </div>
            </div>
            
            <div class="hud-section main-actions">
                <button class="main-action-btn tool-btn" id="btn-harvest-main" data-tool="harvest" draggable="true" title="Colher">
                    <span class="action-icon">🌾</span>
                </button>
                <button class="main-action-btn tool-btn" id="btn-water-main" data-tool="water" draggable="true" title="Regar">
                    <span class="action-icon">💧</span>
                </button>
                <button class="main-action-btn tool-btn" id="btn-fertilize-main" data-tool="fertilize" draggable="true" title="Fertilizar">
                    <span class="action-icon">⚗️</span>
                </button>
                <button class="main-action-btn tool-btn" id="btn-pesticide-main" data-tool="pesticide" draggable="true" title="Pesticida">
                    <span class="action-icon">🛡️</span>
                </button>
                <button class="main-action-btn tool-btn" id="btn-organic-fertilizer-main" data-tool="organic-fertilizer" draggable="true" title="Adubo Orgânico">
                    <span class="action-icon">🌿</span>
                </button>
            </div>
            
            <div class="hud-section controls-info">
                <button class="hud-control-btn" id="btn-pause" title="Pausar/Continuar">
                    <span class="control-icon">⏸️</span>
                </button>
                <button class="hud-control-btn" id="btn-speed" title="Velocidade do Jogo">
                    <span class="control-icon">⏩</span>
                    <span class="speed-text">1x</span>
                </button>
                <button class="hud-control-btn" id="btn-settings" title="Configurações">
                    <span class="control-icon">⚙️</span>
                </button>
            </div>
        `;
        
        return bottomBar;
    }

    /**
     * Cria área de notificações
     */
    createNotificationArea() {
        const notificationArea = document.createElement('div');
        notificationArea.className = 'hud-notifications';
        notificationArea.id = 'notification-area';
        
        return notificationArea;
    }

    /**
     * Configura os ouvintes de eventos
     */
    setupEventListeners() {
        // Eventos de dados do jogo
        document.addEventListener('balanceUpdated', (e) => this.updateBalance(e.detail));
        document.addEventListener('weatherUpdated', (e) => this.updateWeather(e.detail));
        document.addEventListener('researchProgress', (e) => this.updateResearch(e.detail));
        document.addEventListener('farmStatusChanged', (e) => this.updateFarms(e.detail));
        document.addEventListener('playerLevelUp', (e) => this.updatePlayerLevel(e.detail));
        
        // Eventos de notificação
        document.addEventListener('showNotification', (e) => this.showNotification(e.detail));
        document.addEventListener('gameAlert', (e) => this.showAlert(e.detail));
        
        // Eventos de controle
        this.setupControlEvents();
        
        // Eventos de redimensionamento
        window.addEventListener('resize', () => this.handleResize());
    }

    /**
     * Configura eventos de controle
     */
    setupControlEvents() {
        // Botões de ação rápida
        const plantBtn = document.getElementById('btn-plant-crops');
        if (plantBtn) {
            plantBtn.addEventListener('click', () => this.dispatchEvent('quickAction', { action: 'plant' }));
        }
        
        const harvestBtn = document.getElementById('btn-harvest-crops');
        if (harvestBtn) {
            harvestBtn.addEventListener('click', () => this.dispatchEvent('quickAction', { action: 'harvest' }));
        }
        
        const waterBtn = document.getElementById('btn-water-crops');
        if (waterBtn) {
            waterBtn.addEventListener('click', () => this.dispatchEvent('quickAction', { action: 'water' }));
        }
        
        const marketBtn = document.getElementById('btn-market');
        if (marketBtn) {
            marketBtn.addEventListener('click', () => this.dispatchEvent('quickAction', { action: 'market' }));
        }
        
        // Botões de cuidado da fazenda
        const irrigateBtn = document.getElementById('btn-irrigate');
        if (irrigateBtn) {
            irrigateBtn.addEventListener('click', () => this.dispatchEvent('farmCare', { action: 'irrigate' }));
            this.setupDragAndDrop(irrigateBtn, 'irrigate');
        }
        
        const fertilizeBtn = document.getElementById('btn-fertilize');
        if (fertilizeBtn) {
            fertilizeBtn.addEventListener('click', () => this.dispatchEvent('farmCare', { action: 'fertilize' }));
            this.setupDragAndDrop(fertilizeBtn, 'fertilize');
        }
        
        const pesticideBtn = document.getElementById('btn-pesticide');
        if (pesticideBtn) {
            pesticideBtn.addEventListener('click', () => this.dispatchEvent('farmCare', { action: 'pesticide' }));
            this.setupDragAndDrop(pesticideBtn, 'pesticide');
        }
        
        const organicFertilizerBtn = document.getElementById('btn-organic-fertilizer');
        if (organicFertilizerBtn) {
            organicFertilizerBtn.addEventListener('click', () => this.dispatchEvent('farmCare', { action: 'organic-fertilizer' }));
            this.setupDragAndDrop(organicFertilizerBtn, 'organic-fertilizer');
        }
        
        const soilAnalysisBtn = document.getElementById('btn-soil-analysis');
        if (soilAnalysisBtn) {
            soilAnalysisBtn.addEventListener('click', () => this.dispatchEvent('farmCare', { action: 'soil-analysis' }));
            this.setupDragAndDrop(soilAnalysisBtn, 'soil-analysis');
        }
        
        const cleanBtn = document.getElementById('btn-clean');
        if (cleanBtn) {
            cleanBtn.addEventListener('click', () => this.dispatchEvent('farmCare', { action: 'clean' }));
            this.setupDragAndDrop(cleanBtn, 'clean');
        }

        // Botões de ações principais na barra inferior
        const harvestMainBtn = document.getElementById('btn-harvest-main');
        if (harvestMainBtn) {
            harvestMainBtn.addEventListener('click', () => this.dispatchEvent('farmCare', { action: 'harvest' }));
            this.setupDragAndDrop(harvestMainBtn, 'harvest');
        }
        
        const waterMainBtn = document.getElementById('btn-water-main');
        if (waterMainBtn) {
            waterMainBtn.addEventListener('click', () => this.dispatchEvent('farmCare', { action: 'water' }));
            this.setupDragAndDrop(waterMainBtn, 'water');
        }
        
        const fertilizeMainBtn = document.getElementById('btn-fertilize-main');
        if (fertilizeMainBtn) {
            fertilizeMainBtn.addEventListener('click', () => this.dispatchEvent('farmCare', { action: 'fertilize' }));
            this.setupDragAndDrop(fertilizeMainBtn, 'fertilize');
        }
        
        const pesticideMainBtn = document.getElementById('btn-pesticide-main');
        if (pesticideMainBtn) {
            pesticideMainBtn.addEventListener('click', () => this.dispatchEvent('farmCare', { action: 'pesticide' }));
            this.setupDragAndDrop(pesticideMainBtn, 'pesticide');
        }
        
        const organicFertilizerMainBtn = document.getElementById('btn-organic-fertilizer-main');
        if (organicFertilizerMainBtn) {
            organicFertilizerMainBtn.addEventListener('click', () => this.dispatchEvent('farmCare', { action: 'organic-fertilizer' }));
            this.setupDragAndDrop(organicFertilizerMainBtn, 'organic-fertilizer');
        }
        
        const coverageBtn = document.getElementById('btn-coverage');
        if (coverageBtn) {
            coverageBtn.addEventListener('click', () => this.dispatchEvent('farmCare', { action: 'coverage' }));
            this.setupDragAndDrop(coverageBtn, 'coverage');
        }
        
        const waterCropsBtn = document.getElementById('btn-water-crops');
        if (waterCropsBtn) {
            waterCropsBtn.addEventListener('click', () => this.dispatchEvent('farmCare', { action: 'water-crops' }));
            this.setupDragAndDrop(waterCropsBtn, 'water-crops');
        }
        
        // Controles do jogo
        const pauseBtn = document.getElementById('btn-pause');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.togglePause());
        }
        
        const speedBtn = document.getElementById('btn-speed');
        if (speedBtn) {
            speedBtn.addEventListener('click', () => this.cycleGameSpeed());
        }
        
        const settingsBtn = document.getElementById('btn-settings');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.dispatchEvent('openSettings'));
        }
    }

    /**
     * Inicia atualizações automáticas do HUD
     */
    startHUDUpdates() {
        this.hudUpdateTimer = setInterval(() => {
            this.updateHUD();
        }, this.config.updateFrequency);
        
        console.log('🖥️ Atualizações automáticas do HUD iniciadas');
    }

    /**
     * Método de atualização principal chamado pelo game loop
     */
    update() {
        this.updateHUD();
    }

    /**
     * Atualiza todo o HUD
     */
    updateHUD() {
        this.updateTime();
        this.updateAnimations();
        this.cleanupOldNotifications();
    }

    /**
     * Atualiza informações de saldo
     */
    updateBalance(balanceData) {
        const balanceElement = document.getElementById('balance-amount');
        const changeElement = document.getElementById('balance-change');
        
        if (balanceElement) {
            const newBalance = balanceData.balance || 0;
            balanceElement.textContent = this.formatCurrency(newBalance);
            
            // Anima mudança de saldo
            this.animateElement(balanceElement, 'balance-update');
        }
        
        if (changeElement && balanceData.change) {
            const change = balanceData.change;
            changeElement.textContent = change > 0 ? `+${this.formatCurrency(change)}` : this.formatCurrency(change);
            changeElement.className = `balance-change ${change > 0 ? 'positive' : 'negative'}`;
            
            // Remove após 3 segundos
            setTimeout(() => {
                changeElement.textContent = '';
                changeElement.className = 'balance-change';
            }, 3000);
        }
        
        this.gameData.player.balance = balanceData.balance || 0;
    }

    /**
     * Atualiza informações do clima
     */
    updateWeather(weatherData) {
        const iconElement = document.getElementById('weather-icon');
        const tempElement = document.getElementById('weather-temp');
        const descElement = document.getElementById('weather-description');
        const humidityElement = document.getElementById('weather-humidity');
        const windElement = document.getElementById('weather-wind');
        
        if (weatherData.current) {
            const weather = weatherData.current;
            
            if (iconElement) {
                iconElement.textContent = this.getWeatherIcon(weather.condition);
            }
            
            if (tempElement) {
                tempElement.textContent = `${Math.round(weather.temperature)}°C`;
            }
            
            if (descElement) {
                descElement.textContent = weather.description || 'Carregando...';
            }
            
            if (humidityElement) {
                humidityElement.textContent = `${Math.round(weather.humidity)}%`;
            }
            
            if (windElement) {
                windElement.textContent = `${Math.round(weather.windSpeed)} km/h`;
            }
            
            this.gameData.weather = weather;
        }
    }

    /**
     * Atualiza informações de pesquisa
     */
    updateResearch(researchData) {
        const currentElement = document.getElementById('research-current');
        const pointsElement = document.getElementById('research-points');
        
        if (currentElement) {
            if (researchData.research && researchData.research.technology) {
                const tech = researchData.research.technology;
                const progress = researchData.progress || 0;
                
                currentElement.innerHTML = `
                    <div class="research-active">
                        <div class="research-name">${tech.name}</div>
                        <div class="research-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progress}%"></div>
                            </div>
                            <span class="progress-text">${Math.round(progress)}%</span>
                        </div>
                    </div>
                `;
            } else {
                currentElement.innerHTML = '<div class="research-none">Nenhuma pesquisa ativa</div>';
            }
        }
        
        if (pointsElement && researchData.points !== undefined) {
            pointsElement.textContent = researchData.points;
            this.gameData.research.points = researchData.points;
        }
    }

    /**
     * Atualiza informações das fazendas
     */
    updateFarms(farmData) {
        const totalElement = document.getElementById('farms-total');
        const activeElement = document.getElementById('farms-active');
        const producingElement = document.getElementById('farms-producing');
        
        if (totalElement && farmData.total !== undefined) {
            totalElement.textContent = farmData.total;
            this.gameData.farms.total = farmData.total;
        }
        
        if (activeElement && farmData.active !== undefined) {
            activeElement.textContent = farmData.active;
            this.gameData.farms.active = farmData.active;
        }
        
        if (producingElement && farmData.producing !== undefined) {
            producingElement.textContent = farmData.producing;
            this.gameData.farms.producing = farmData.producing;
        }
    }

    /**
     * Atualiza nível do jogador
     */
    updatePlayerLevel(levelData) {
        const levelElement = document.getElementById('player-level');
        const expFillElement = document.getElementById('experience-fill');
        const expTextElement = document.getElementById('experience-text');
        
        if (levelElement && levelData.level !== undefined) {
            levelElement.textContent = levelData.level;
            this.gameData.player.level = levelData.level;
        }
        
        if (levelData.experience !== undefined && levelData.experienceToNext !== undefined) {
            const expPercent = (levelData.experience / levelData.experienceToNext) * 100;
            
            if (expFillElement) {
                expFillElement.style.width = `${expPercent}%`;
            }
            
            if (expTextElement) {
                expTextElement.textContent = `${levelData.experience}/${levelData.experienceToNext} XP`;
            }
            
            this.gameData.player.experience = levelData.experience;
            this.gameData.player.experienceToNext = levelData.experienceToNext;
        }
    }

    /**
     * Atualiza tempo do jogo
     */
    updateTime() {
        const timeElement = document.getElementById('time-display');
        const seasonElement = document.getElementById('season-display');
        
        // Obtém tempo do jogo (pode vir de outro sistema)
        const gameTime = window.gameInstance?.gameState?.time || { day: 1, season: 'spring' };
        
        if (timeElement) {
            timeElement.textContent = `Dia ${gameTime.day}`;
        }
        
        if (seasonElement) {
            seasonElement.textContent = this.getSeasonName(gameTime.season);
        }
    }

    /**
     * Mostra notificação
     */
    showNotification(notificationData) {
        const { message, type = 'info', duration = this.config.notificationDuration } = notificationData;
        
        const notification = document.createElement('div');
        notification.className = `hud-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-icon">${this.getNotificationIcon(type)}</div>
            <div class="notification-content">
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        const notificationArea = document.getElementById('notification-area');
        if (notificationArea) {
            notificationArea.appendChild(notification);
            
            // Anima entrada
            this.animateElement(notification, 'slide-in');
            
            // Remove automaticamente
            setTimeout(() => {
                if (notification.parentElement) {
                    this.animateElement(notification, 'slide-out');
                    setTimeout(() => notification.remove(), 300);
                }
            }, duration);
        }
        
        console.log(`📢 Notificação: ${message}`);
    }

    /**
     * Mostra alerta
     */
    showAlert(alertData) {
        this.showNotification({
            message: alertData.message,
            type: 'warning',
            duration: alertData.duration || 8000
        });
    }

    /**
     * Métodos auxiliares
     */
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }
    
    getWeatherIcon(condition) {
        const icons = {
            sunny: '☀️',
            cloudy: '☁️',
            rainy: '🌧️',
            stormy: '⛈️',
            drought: '🌵',
            frost: '❄️',
            heatwave: '🔥'
        };
        return icons[condition] || '🌤️';
    }
    
    getSeasonName(season) {
        const names = {
            spring: 'Primavera',
            summer: 'Verão',
            autumn: 'Outono',
            winter: 'Inverno'
        };
        return names[season] || 'Primavera';
    }
    
    getNotificationIcon(type) {
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌',
            achievement: '🏆'
        };
        return icons[type] || 'ℹ️';
    }
    
    animateElement(element, animationType) {
        if (!this.config.showAnimations) return;
        
        element.classList.add(`animate-${animationType}`);
        
        setTimeout(() => {
            element.classList.remove(`animate-${animationType}`);
        }, 500);
    }
    
    togglePause() {
        this.dispatchEvent('togglePause');
        
        const pauseBtn = document.getElementById('btn-pause');
        if (pauseBtn) {
            const icon = pauseBtn.querySelector('.control-icon');
            const isPaused = icon.textContent === '▶️';
            icon.textContent = isPaused ? '⏸️' : '▶️';
        }
    }
    
    cycleGameSpeed() {
        const speeds = ['1x', '2x', '4x'];
        const speedBtn = document.getElementById('btn-speed');
        
        if (speedBtn) {
            const speedText = speedBtn.querySelector('.speed-text');
            const currentIndex = speeds.indexOf(speedText.textContent);
            const nextIndex = (currentIndex + 1) % speeds.length;
            speedText.textContent = speeds[nextIndex];
            
            this.dispatchEvent('changeGameSpeed', { speed: speeds[nextIndex] });
        }
    }
    
    updateAnimations() {
        // Atualiza animações ativas
        this.animations.forEach((animation, element) => {
            if (animation.duration <= 0) {
                this.animations.delete(element);
            } else {
                animation.duration -= this.config.updateFrequency;
            }
        });
    }
    
    cleanupOldNotifications() {
        const notificationArea = document.getElementById('notification-area');
        if (notificationArea) {
            const notifications = notificationArea.querySelectorAll('.hud-notification');
            if (notifications.length > 5) {
                // Remove notificações mais antigas
                for (let i = 0; i < notifications.length - 5; i++) {
                    notifications[i].remove();
                }
            }
        }
    }
    
    handleResize() {
        // Ajusta layout do HUD para diferentes tamanhos de tela
        const container = this.elements.container;
        if (container) {
            const width = window.innerWidth;
            
            if (width < 768) {
                container.classList.add('hud-mobile');
            } else {
                container.classList.remove('hud-mobile');
            }
            
            if (width < 1024) {
                container.classList.add('hud-compact');
            } else {
                container.classList.remove('hud-compact');
            }
        }
    }

    /**
     * Configurações do HUD
     */
    
    setCompactMode(enabled) {
        this.config.compactMode = enabled;
        
        if (this.elements.container) {
            if (enabled) {
                this.elements.container.classList.add('hud-compact');
            } else {
                this.elements.container.classList.remove('hud-compact');
            }
        }
        
        this.saveHUDSettings();
    }
    
    setAutoHide(enabled) {
        this.config.autoHide = enabled;
        this.saveHUDSettings();
    }
    
    setAnimations(enabled) {
        this.config.showAnimations = enabled;
        this.saveHUDSettings();
    }

    /**
     * Eventos
     */
    
    onDataUpdated(event) {
        console.log('🖥️ Evento: Dados do HUD atualizados', event.detail);
    }
    
    dispatchEvent(eventName, data = {}) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }

    /**
     * Gerenciamento de dados
     */
    
    loadHUDSettings() {
        try {
            const savedSettings = localStorage.getItem('hudSettings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                this.config = { ...this.config, ...settings };
                
                console.log('💾 Configurações do HUD carregadas');
            }
        } catch (error) {
            console.error('❌ Erro ao carregar configurações do HUD:', error);
        }
    }
    
    saveHUDSettings() {
        try {
            localStorage.setItem('hudSettings', JSON.stringify(this.config));
            console.log('💾 Configurações do HUD salvas');
        } catch (error) {
            console.error('❌ Erro ao salvar configurações do HUD:', error);
        }
    }

    /**
     * Configura funcionalidade de arrastar e soltar para um botão
     * @param {HTMLElement} button - O elemento do botão
     * @param {string} action - A ação associada ao botão
     */
    setupDragAndDrop(button, action) {
        if (!button) return;
        
        // Torna o botão arrastável
        button.draggable = true;
        button.setAttribute('data-action', action);
        
        // Eventos de arrastar
        button.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', action);
            e.dataTransfer.effectAllowed = 'copy';
            
            // Adiciona classe visual durante o arraste
            button.classList.add('dragging');
            
            // Cria uma imagem de arraste personalizada
            const dragImage = button.cloneNode(true);
            dragImage.style.opacity = '0.8';
            dragImage.style.transform = 'scale(0.9)';
            document.body.appendChild(dragImage);
            e.dataTransfer.setDragImage(dragImage, 20, 20);
            
            // Remove a imagem temporária após um pequeno delay
            setTimeout(() => {
                if (document.body.contains(dragImage)) {
                    document.body.removeChild(dragImage);
                }
            }, 0);
            
            console.log(`🎯 Iniciando arraste da ferramenta: ${action}`);
        });
        
        button.addEventListener('dragend', (e) => {
            // Remove classe visual
            button.classList.remove('dragging');
            console.log(`🎯 Finalizando arraste da ferramenta: ${action}`);
        });
        
        // Adiciona feedback visual ao passar o mouse
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
            button.style.transition = 'transform 0.2s ease';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
    }

    /**
     * Limpeza e destruição
     */
    
    destroy() {
        // Salva configurações
        this.saveHUDSettings();
        
        // Para atualizações automáticas
        if (this.hudUpdateTimer) {
            clearInterval(this.hudUpdateTimer);
        }
        
        // Remove elementos do DOM
        if (this.elements.container && this.elements.container.parentElement) {
            this.elements.container.parentElement.removeChild(this.elements.container);
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        
        // Limpa dados
        this.elements = {};
        this.animations.clear();
        this.isInitialized = false;
        
        console.log('🧹 HUD destruído');
    }
}

// Exporta para uso global e módulos
if (typeof window !== 'undefined') {
    window.HUD = HUD;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = HUD;
}