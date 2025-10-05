/**
 * NASA Farm Navigators - Arquivo Principal
 * Inicializa e coordena todos os sistemas do jogo
 */

class GameInstance {
    constructor() {
        this.isInitialized = false;
        this.isLoading = true;
        this.loadingProgress = 0;
        
        // Sistemas do jogo
        this.mapSystem = null;
        this.nasaApi = null;
        this.farmSystem = null;
        this.weatherSystem = null;
        this.economySystem = null;
        this.techSystem = null;
        this.uiManager = null;
        
        // Estado do jogo
        this.gameState = {
            player: {
                money: getConfig('gameplay.startingMoney'),
                sustainabilityScore: 85,
                totalYield: 0,
                level: 1,
                experience: 0
            },
            time: {
                gameDate: new Date(),
                season: 'spring',
                day: 1,
                year: 1
            },
            settings: {
                soundEnabled: true,
                musicEnabled: true,
                autoSave: true,
                difficulty: 'normal'
            }
        };
        
        // Bind methods
        this.onWindowResize = this.onWindowResize.bind(this);
        this.onVisibilityChange = this.onVisibilityChange.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
        
        // Inicia inicialização
        this.initialize();
    }
    
    /**
     * Inicializa o jogo
     */
    async initialize() {
        try {
            console.log('🚀 Iniciando NASA Farm Navigators...');
            
            // Valida configurações
            if (!validateConfig()) {
                throw new Error('Configurações inválidas');
            }
            
            // Mostra tela de loading
            this.showLoadingScreen();
            
            // Inicializa sistemas em ordem
            await this.initializeSystems();
            
            // Configura event listeners
            this.setupEventListeners();
            
            // Carrega dados salvos
            await this.loadGameData();
            
            // Inicia game loop
            this.startGameLoop();
            
            // Esconde tela de loading
            await this.hideLoadingScreen();
            
            this.isInitialized = true;
            this.isLoading = false;
            
            console.log('✅ NASA Farm Navigators inicializado com sucesso!');
            
            // Mostra notificação de boas-vindas
            Utils.showNotification('Bem-vindo ao NASA Farm Navigators!', 'success');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar o jogo:', error);
            this.showErrorScreen(error);
        }
    }
    
    /**
     * Inicializa todos os sistemas do jogo
     */
    async initializeSystems() {
        const systems = [
            { name: 'NASA API', init: () => this.initializeNASAApi() },
            { name: 'Modal de Informações', init: () => this.initializeRegionModal() },
            { name: 'Mapa Mundial', init: () => this.initializeMapSystem() },
            { name: 'Sistema de Fazendas', init: () => this.initializeFarmSystem() },
            { name: 'Sistema Climático', init: () => this.initializeWeatherSystem() },
            { name: 'Sistema Econômico', init: () => this.initializeEconomySystem() },
            { name: 'Sistema de Tecnologia', init: () => this.initializeTechSystem() },
            { name: 'Interface do Usuário', init: () => this.initializeUIManager() }
        ];
        
        for (let i = 0; i < systems.length; i++) {
            const system = systems[i];
            
            try {
                this.updateLoadingProgress((i / systems.length) * 100, `Inicializando ${system.name}...`);
                await system.init();
                console.log(`✅ ${system.name} inicializado`);
                
            } catch (error) {
                console.error(`❌ Erro ao inicializar ${system.name}:`, error);
                throw new Error(`Falha na inicialização: ${system.name}`);
            }
        }
        
        this.updateLoadingProgress(100, 'Finalizando...');
    }
    
    /**
     * Inicializa serviço da NASA API
     */
    async initializeNASAApi() {
        this.nasaApi = new NASAApiService();
        
        if (typeof NASADataIntegration !== 'undefined') {
            this.nasaDataSystem = new NASADataIntegration();
            await this.nasaDataSystem.initialize();
            console.log('✅ Sistema de dados NASA inicializado');
        } else {
            console.warn('⚠️ Sistema de dados NASA não encontrado');
        }
        
        await Utils.delay(500); // Simula tempo de inicialização
    }
    
    /**
     * Inicializa o modal de informações da região
     */
    async initializeRegionModal() {
        try {
            // Inicializa o modal de informações da região
            window.regionInfoModal = new RegionInfoModal();
            console.log('Modal de informações da região inicializado');
        } catch (error) {
            console.error('Erro ao inicializar modal de informações:', error);
            throw error;
        }
    }
    
    /**
     * Inicializa sistema de mapa
     */
    async initializeMapSystem() {
        this.mapSystem = new MapSystem();
        await this.mapSystem.initialize();
    }
    
    /**
     * Inicializa sistema de fazendas
     */
    async initializeFarmSystem() {
        try {
            // Inicializa o novo sistema HTML da fazenda
            this.farmSystem = new HtmlFarmSystem('farm-container', this);
            const success = await this.farmSystem.initialize();
            
            if (!success) {
                throw new Error('Falha ao inicializar sistema de fazenda HTML');
            }
            
            console.log('✅ Sistema de fazenda HTML inicializado');
            this.updateLoadingProgress(60, 'Sistema de fazenda carregado...');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar sistema de fazenda:', error);
            // Fallback para sistema básico
            this.farmSystem = {
                farms: [],
                selectedFarm: null,
                initialize: () => Promise.resolve(),
                update: () => {},
                createFarm: (lat, lng) => console.log(`Fazenda criada em ${lat}, ${lng}`)
            };
        }
        
        await Utils.delay(300);
    }
    
    /**
     * Inicializa sistema climático
     */
    async initializeWeatherSystem() {
        // Placeholder - será implementado
        this.weatherSystem = {
            currentWeather: null,
            forecast: [],
            initialize: () => Promise.resolve(),
            update: () => {},
            getWeatherForLocation: (lat, lng) => this.nasaApi.getMockClimateData(lat, lng)
        };
        await Utils.delay(200);
    }
    
    /**
     * Inicializa sistema econômico
     */
    async initializeEconomySystem() {
        // Placeholder - será implementado
        this.economySystem = {
            marketPrices: new Map(),
            initialize: () => Promise.resolve(),
            update: () => {},
            updateMarketPrices: () => {}
        };
        await Utils.delay(250);
    }
    
    /**
     * Inicializa sistema de tecnologia
     */
    async initializeTechSystem() {
        // Placeholder - será implementado
        this.techSystem = {
            technologies: new Map(),
            initialize: () => Promise.resolve(),
            update: () => {},
            researchTechnology: (techId) => console.log(`Pesquisando ${techId}`)
        };
        await Utils.delay(200);
    }
    
    /**
     * Inicializa gerenciador de UI
     */
    async initializeUIManager() {
        // Placeholder - será implementado
        this.uiManager = {
            initialize: () => Promise.resolve(),
            update: () => {},
            updatePlayerStats: () => this.updatePlayerStatsUI(),
            showPanel: (panelId) => console.log(`Mostrando painel ${panelId}`)
        };
        await Utils.delay(150);
    }
    
    /**
     * Configura event listeners globais
     */
    setupEventListeners() {
        // Eventos de janela
        window.addEventListener('resize', this.onWindowResize);
        window.addEventListener('beforeunload', this.onBeforeUnload.bind(this));
        
        // Eventos de visibilidade
        document.addEventListener('visibilitychange', this.onVisibilityChange);
        
        // Eventos customizados do jogo
        document.addEventListener('regionConfirmed', this.onRegionConfirmed.bind(this));
        window.addEventListener('farmCreated', this.onFarmCreated.bind(this));
        
        // Eventos de UI
        this.setupUIEventListeners();
        
        console.log('Event listeners configurados');
    }
    
    /**
     * Configura event listeners da UI
     */
    setupUIEventListeners() {
        // Botões do header
        const settingsBtn = document.getElementById('settings-btn');
        const helpBtn = document.getElementById('help-btn');
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.showSettingsModal());
        }
        
        if (helpBtn) {
            helpBtn.addEventListener('click', () => this.showHelpModal());
        }
        
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }
        
        // Botões de ação da fazenda
        const plantBtn = document.getElementById('plant-crops-btn');
        const harvestBtn = document.getElementById('harvest-btn');
        const irrigateBtn = document.getElementById('irrigate-btn');
        const fertilizeBtn = document.getElementById('fertilize-btn');
        
        if (plantBtn) {
            plantBtn.addEventListener('click', () => this.plantCrops());
        }
        
        if (harvestBtn) {
            harvestBtn.addEventListener('click', () => this.harvestCrops());
        }
        
        if (irrigateBtn) {
            irrigateBtn.addEventListener('click', () => this.irrigateFarms());
        }
        
        if (fertilizeBtn) {
            fertilizeBtn.addEventListener('click', () => this.fertilizeFarms());
        }

        // Botão de trocar região
        const changeRegionBtn = document.getElementById('change-region-btn');
        if (changeRegionBtn) {
            changeRegionBtn.addEventListener('click', () => {
                if (this.mapSystem) {
                    this.mapSystem.returnToWorldMap();
                }
            });
        }
    }
    
    /**
     * Carrega dados salvos do jogo
     */
    async loadGameData() {
        try {
            const savedData = Utils.loadFromStorage(getConfig('save.storageKey'));
            
            if (savedData) {
                this.gameState = Utils.deepMerge(this.gameState, savedData);
                console.log('Dados do jogo carregados');
            } else {
                console.log('Novo jogo iniciado');
            }
            
        } catch (error) {
            console.error('Erro ao carregar dados do jogo:', error);
            Utils.showNotification('Erro ao carregar dados salvos', 'warning');
        }
    }
    
    /**
     * Salva dados do jogo
     */
    saveGameData() {
        try {
            Utils.saveToStorage(getConfig('save.storageKey'), this.gameState);
            console.log('Dados do jogo salvos');
            
        } catch (error) {
            console.error('Erro ao salvar dados do jogo:', error);
            Utils.showNotification('Erro ao salvar dados', 'error');
        }
    }
    
    /**
     * Inicia o game loop principal
     */
    startGameLoop() {
        console.log('Iniciando game loop...');
        
        // Auto-save periódico
        if (getConfig('save.autoSave')) {
            setInterval(() => {
                this.saveGameData();
            }, getConfig('ui.autoSaveInterval'));
        }
        
        // Game loop principal
        this.gameLoop();
    }
    
    /**
     * Game loop principal
     */
    gameLoop() {
        if (!this.isInitialized) return;
        
        try {
            // Atualiza sistemas
            if (this.farmSystem) this.farmSystem.update();
            if (this.weatherSystem) this.weatherSystem.update();
            if (this.economySystem) this.economySystem.update();
            if (this.techSystem) this.techSystem.update();
            if (this.uiManager) this.uiManager.update();
            
            // Atualiza tempo do jogo
            this.updateGameTime();
            
            // Atualiza UI
            this.updateUI();
            
        } catch (error) {
            console.error('Erro no game loop:', error);
        }
        
        // Agenda próxima execução
        requestAnimationFrame(this.gameLoop);
    }
    
    /**
     * Atualiza tempo do jogo
     */
    updateGameTime() {
        // Implementação simplificada - em produção seria mais complexa
        const now = Date.now();
        if (!this.lastTimeUpdate) this.lastTimeUpdate = now;
        
        const deltaTime = now - this.lastTimeUpdate;
        const timeScale = getConfig('gameplay.timeScale');
        
        // Atualiza dia do jogo a cada 5 segundos (acelerado)
        if (deltaTime > 5000 / timeScale) {
            this.gameState.time.day++;
            
            if (this.gameState.time.day > 90) { // 90 dias por estação
                this.gameState.time.day = 1;
                this.advanceSeason();
            }
            
            this.lastTimeUpdate = now;
            this.updateTimeUI();
        }
    }
    
    /**
     * Avança para próxima estação
     */
    advanceSeason() {
        const seasons = ['spring', 'summer', 'autumn', 'winter'];
        const currentIndex = seasons.indexOf(this.gameState.time.season);
        const nextIndex = (currentIndex + 1) % seasons.length;
        
        this.gameState.time.season = seasons[nextIndex];
        
        if (nextIndex === 0) { // Volta para primavera = novo ano
            this.gameState.time.year++;
            Utils.showNotification(`Ano ${this.gameState.time.year} começou!`, 'info');
        }
        
        Utils.showNotification(`${this.getSeasonName(this.gameState.time.season)} chegou!`, 'info');
    }
    
    /**
     * Obtém nome da estação em português
     * @param {string} season - Nome da estação em inglês
     * @returns {string} Nome da estação em português
     */
    getSeasonName(season) {
        const names = {
            spring: 'Primavera',
            summer: 'Verão',
            autumn: 'Outono',
            winter: 'Inverno'
        };
        return names[season] || season;
    }
    
    /**
     * Atualiza UI geral
     */
    updateUI() {
        this.updatePlayerStatsUI();
        this.updateTimeUI();
        this.updateWeatherUI();
    }
    
    /**
     * Atualiza estatísticas do jogador na UI
     */
    updatePlayerStatsUI() {
        const moneyEl = document.getElementById('player-money');
        const sustainabilityEl = document.getElementById('sustainability-score');
        const yieldEl = document.getElementById('total-yield');
        
        if (moneyEl) {
            moneyEl.textContent = Utils.formatCurrency(this.gameState.player.money);
        }
        
        if (sustainabilityEl) {
            sustainabilityEl.textContent = `${this.gameState.player.sustainabilityScore}%`;
        }
        
        if (yieldEl) {
            yieldEl.textContent = `${Utils.formatNumber(this.gameState.player.totalYield)}t`;
        }
    }
    
    /**
     * Atualiza tempo na UI
     */
    updateTimeUI() {
        const gameDateEl = document.getElementById('game-date');
        if (gameDateEl) {
            const seasonName = this.getSeasonName(this.gameState.time.season);
            gameDateEl.textContent = `${seasonName}, Ano ${this.gameState.time.year}`;
        }
    }
    
    /**
     * Atualiza clima na UI
     */
    updateWeatherUI() {
        const weatherEl = document.getElementById('current-weather');
        if (weatherEl && this.weatherSystem.currentWeather) {
            const weather = this.weatherSystem.currentWeather;
            weatherEl.textContent = `${weather.condition}, ${weather.temperature}°C`;
        }
    }
    
    /**
     * Mostra tela de loading
     */
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const gameContainer = document.getElementById('game-container');
        
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
            loadingScreen.style.opacity = '1';
        }
        if (gameContainer) {
            gameContainer.style.display = 'none';
        }
    }
    
    /**
     * Esconde tela de loading
     */
    async hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const gameContainer = document.getElementById('game-container');
        
        // Animação de saída
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            await Utils.delay(500);
            loadingScreen.style.display = 'none';
        }
        
        // Mostra jogo
        if (gameContainer) {
            gameContainer.style.display = 'block';
            gameContainer.style.opacity = '0';
            gameContainer.style.transition = 'opacity 0.5s ease-in';
            
            await Utils.delay(100);
            gameContainer.style.opacity = '1';
        }
    }
    
    /**
     * Atualiza progresso do loading
     * @param {number} progress - Progresso (0-100)
     * @param {string} text - Texto de status
     */
    updateLoadingProgress(progress, text) {
        const progressBar = document.getElementById('loading-progress');
        const loadingText = document.getElementById('loading-text');
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        if (loadingText) {
            loadingText.textContent = text;
        }
        
        this.loadingProgress = progress;
    }
    
    /**
     * Mostra tela de erro
     * @param {Error} error - Erro ocorrido
     */
    showErrorScreen(error) {
        const errorScreen = document.createElement('div');
        errorScreen.className = 'error-screen';
        errorScreen.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>Erro ao Carregar o Jogo</h2>
                <p>${error.message}</p>
                <button onclick="location.reload()" class="btn-retry">
                    Tentar Novamente
                </button>
            </div>
        `;
        
        document.body.appendChild(errorScreen);
    }
    
    // ===== EVENT HANDLERS =====
    
    /**
     * Manipula redimensionamento da janela
     */
    onWindowResize() {
        if (this.mapSystem && this.mapSystem.map) {
            this.mapSystem.map.invalidateSize();
        }
    }
    
    /**
     * Manipula mudança de visibilidade da página
     */
    onVisibilityChange() {
        if (document.hidden) {
            // Pausa o jogo quando a aba não está visível
            console.log('Jogo pausado (aba não visível)');
        } else {
            // Resume o jogo
            console.log('Jogo resumido');
        }
    }
    
    /**
     * Manipula evento antes de fechar a página
     * @param {BeforeUnloadEvent} e - Evento
     */
    onBeforeUnload(e) {
        if (getConfig('save.autoSave')) {
            this.saveGameData();
        }
        
        // Avisa sobre dados não salvos
        if (this.hasUnsavedChanges()) {
            e.preventDefault();
            e.returnValue = 'Você tem alterações não salvas. Deseja realmente sair?';
        }
    }
    
    /**
     * Manipula confirmação de seleção de região
     * @param {CustomEvent} e - Evento customizado
     */
    onRegionConfirmed(e) {
        const { region } = e.detail;
        console.log('Evento regionConfirmed recebido:', region);

        if (!region) {
            console.error('Dados da região não encontrados no evento.');
            return;
        }

        this.gameState.currentRegion = region;
        console.log(`Região selecionada: ${region.name}`);

        // Atualiza dados climáticos da região
        if (this.weatherSystem && region.center) {
            this.weatherSystem.currentWeather = this.weatherSystem.getWeatherForLocation(
                region.center[0],
                region.center[1]
            );
        }

        // Direciona para a fazenda
        this.transitionToFarm(region);
    }

    /**
     * Faz a transição para a tela da fazenda
     * @param {Object} region - Dados da região selecionada
     */
    transitionToFarm(region) {
        console.log(`Iniciando transição para fazenda na região: ${region.name}`);
        
        // Aqui será implementada a lógica de transição para a fazenda
        // Por enquanto, apenas simula a transição
        
        // Dispara evento de fazenda criada
        const event = new CustomEvent('farmCreated', {
            detail: { 
                region: region,
                lat: region.center ? region.center[0] : 0,
                lng: region.center ? region.center[1] : 0
            }
        });
        window.dispatchEvent(event);
    }
    
    /**
     * Manipula criação de fazenda
     * @param {CustomEvent} e - Evento customizado
     */
    onFarmCreated(e) {
        const { region, lat, lng } = e.detail;
        console.log(`Nova fazenda criada em: ${lat}, ${lng}`);
        
        if (this.farmSystem && this.farmSystem.start) {
            // Inicia o sistema de fazenda HTML
            this.farmSystem.start();
            
            // Esconde o mapa e mostra a interface da fazenda
            this.showFarmInterface();
            
            // Atualiza informações da região
            this.updateRegionInfo(region);
        }
    }
    
    /**
     * Mostra a interface da fazenda
     */
    showFarmInterface() {
        // Esconde o mapa
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.style.display = 'none';
        }
        
        // Mostra o container da fazenda
        const farmContainer = document.getElementById('farm-container');
        if (farmContainer) {
            farmContainer.style.display = 'block';
        }
        
        // Mostra controles da fazenda
        const farmControls = document.querySelector('.farm-controls');
        if (farmControls) {
            farmControls.style.display = 'flex';
        }
        
        // Atualiza botões de navegação
        this.updateNavigationButtons(true);
    }
    
    /**
     * Atualiza informações da região
     */
    updateRegionInfo(region) {
        const regionInfo = document.querySelector('.region-info');
        if (regionInfo && region) {
            regionInfo.innerHTML = `
                <h3>${region.name}</h3>
                <p><strong>Clima:</strong> ${region.climate || 'Temperado'}</p>
                <p><strong>Solo:</strong> ${region.soilType || 'Fértil'}</p>
                <p><strong>Especialidade:</strong> ${region.specialty || 'Grãos'}</p>
            `;
        }
    }
    
    /**
     * Atualiza botões de navegação
     */
    updateNavigationButtons(inFarm = false) {
        const backToMapBtn = document.getElementById('back-to-map');
        if (backToMapBtn) {
            backToMapBtn.style.display = inFarm ? 'block' : 'none';
            backToMapBtn.onclick = () => this.showMapInterface();
        }
    }
    
    /**
     * Mostra a interface do mapa
     */
    showMapInterface() {
        // Para o sistema de fazenda
        if (this.farmSystem && this.farmSystem.stop) {
            this.farmSystem.stop();
        }
        
        // Mostra o mapa
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.style.display = 'block';
        }
        
        // Esconde o container da fazenda
        const farmContainer = document.getElementById('farm-container');
        if (farmContainer) {
            farmContainer.style.display = 'none';
        }
        
        // Esconde controles da fazenda
        const farmControls = document.querySelector('.farm-controls');
        if (farmControls) {
            farmControls.style.display = 'none';
        }
        
        // Atualiza botões de navegação
        this.updateNavigationButtons(false);
    }
    
    // ===== AÇÕES DO JOGADOR =====
    
    /**
     * Planta culturas
     */
    plantCrops() {
        console.log('Plantando culturas...');
        Utils.showNotification('Culturas plantadas!', 'success');
    }
    
    /**
     * Colhe culturas
     */
    harvestCrops() {
        console.log('Colhendo culturas...');
        Utils.showNotification('Culturas colhidas!', 'success');
    }
    
    /**
     * Irriga fazendas
     */
    irrigateFarms() {
        console.log('Irrigando fazendas...');
        Utils.showNotification('Fazendas irrigadas!', 'success');
    }
    
    /**
     * Fertiliza fazendas
     */
    fertilizeFarms() {
        console.log('Fertilizando fazendas...');
        Utils.showNotification('Fazendas fertilizadas!', 'success');
    }
    
    /**
     * Mostra modal de configurações
     */
    showSettingsModal() {
        console.log('Abrindo configurações...');
        // Implementar modal de configurações
    }
    
    /**
     * Mostra modal de ajuda
     */
    showHelpModal() {
        console.log('Abrindo ajuda...');
        // Implementar modal de ajuda
    }
    
    /**
     * Alterna tela cheia
     */
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
    
    /**
     * Verifica se há alterações não salvas
     * @returns {boolean} True se há alterações não salvas
     */
    hasUnsavedChanges() {
        // Implementar lógica de verificação
        return false;
    }
    
    /**
     * Limpa recursos do jogo
     */
    destroy() {
        // Limpa event listeners
        window.removeEventListener('resize', this.onWindowResize);
        window.removeEventListener('beforeunload', this.onBeforeUnload);
        document.removeEventListener('visibilitychange', this.onVisibilityChange);
        
        // Limpa sistemas
        if (this.mapSystem) this.mapSystem.destroy();
        
        console.log('Recursos do jogo limpos');
    }
}

// ===== INICIALIZAÇÃO =====

// Aguarda DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, inicializando jogo...');
    
    // Cria instância global do jogo
    window.gameInstance = new GameInstance();
});

// Exporta classe globalmente
if (typeof window !== 'undefined') {
    window.GameInstance = GameInstance;
}