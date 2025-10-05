/**
 * Game - NASA Farm Navigators
 * Sistema principal do jogo que coordena todos os subsistemas
 */

class Game {
    constructor() {
        this.isInitialized = false;
        this.isRunning = false;
        this.isPaused = false;
        
        // Sistemas do jogo
        this.systems = {
            map: null,
            farm: null,
            economy: null,
            weather: null,
            tech: null,
            hud: null,
            panels: null,
            modals: null
        };
        
        // Estado do jogo
        this.gameState = {
            version: '1.0.0',
            startTime: null,
            playTime: 0,
            lastSave: null,
            gameSpeed: 1,
            difficulty: 'normal',
            settings: {
                autoSave: true,
                autoSaveInterval: 300000, // 5 minutos
                soundEnabled: true,
                musicEnabled: true,
                notifications: true,
                animations: true
            }
        };
        
        // Timers e intervalos
        this.timers = {
            gameLoop: null,
            autoSave: null,
            weatherUpdate: null,
            farmUpdate: null
        };
        
        // Estatísticas do jogo
        this.stats = {
            totalFarms: 0,
            totalHarvests: 0,
            totalRevenue: 0,
            totalExpenses: 0,
            researchCompleted: 0,
            achievementsUnlocked: 0,
            playTimeMinutes: 0
        };
        
        // Bind methods
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        this.handleBeforeUnload = this.handleBeforeUnload.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    /**
     * Inicializa o jogo
     */
    async initialize() {
        try {
            console.log('🚀 Inicializando NASA Farm Navigators...');
            
            // Mostra tela de carregamento
            this.showLoadingScreen();
            
            // Carrega dados salvos
            await this.loadGameData();
            
            // Inicializa sistemas na ordem correta
            await this.initializeSystems();
            
            // Configura eventos globais
            this.setupGlobalEvents();
            
            // Inicia loops do jogo
            this.startGameLoops();
            
            // Remove tela de carregamento
            this.hideLoadingScreen();
            
            this.isInitialized = true;
            this.isRunning = true;
            this.gameState.startTime = Date.now();
            
            console.log('✅ NASA Farm Navigators inicializado com sucesso!');
            
            // Dispara evento de inicialização
            this.dispatchEvent('gameInitialized', {
                version: this.gameState.version,
                systems: Object.keys(this.systems).length
            });
            
            // Show welcome message
            if (this.systems.modals) {
                this.systems.modals.success(
                    'Welcome to NASA Farm Navigators! Explore the world and build sustainable farms.',
                    'Game Started'
                );
            }
            
        } catch (error) {
            console.error('❌ Erro ao inicializar jogo:', error);
            this.handleInitializationError(error);
            throw error;
        }
    }

    /**
     * Inicializa todos os sistemas
     */
    async initializeSystems() {
        console.log('🔧 Inicializando sistemas...');
        
        try {
            // 1. Sistema de modais (primeiro para mostrar erros)
            if (typeof Modals !== 'undefined') {
                this.systems.modals = new Modals();
                await this.systems.modals.initialize();
            }
            
            // 2. Sistema de painéis
            if (typeof Panels !== 'undefined') {
                this.systems.panels = new Panels();
                await this.systems.panels.initialize();
            }
            
            // 3. Sistema HUD
            if (typeof HUD !== 'undefined') {
                this.systems.hud = new HUD();
                await this.systems.hud.initialize();
            }
            
            // 4. Sistema de mapa
            if (typeof MapSystem !== 'undefined') {
                this.systems.map = new MapSystem();
                await this.systems.map.initialize();
            }
            
            // 5. Sistema climático
            if (typeof WeatherSystem !== 'undefined') {
                this.systems.weather = new WeatherSystem();
                await this.systems.weather.initialize();
            }
            
            // 6. Sistema de fazendas
            if (typeof FarmSystem !== 'undefined') {
                this.systems.farm = new FarmSystem();
                await this.systems.farm.initialize();
            }
            
            // 7. Sistema econômico
            if (typeof EconomySystem !== 'undefined') {
                this.systems.economy = new EconomySystem();
                await this.systems.economy.initialize();
            }
            
            // 8. Sistema de tecnologia
            if (typeof TechSystem !== 'undefined') {
                this.systems.tech = new TechSystem();
                await this.systems.tech.initialize();
            }
            
            console.log('✅ Todos os sistemas inicializados');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar sistemas:', error);
            throw error;
        }
    }

    /**
     * Configura eventos globais
     */
    setupGlobalEvents() {
        // Visibilidade da página
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        
        // Antes de fechar
        window.addEventListener('beforeunload', this.handleBeforeUnload);
        
        // Teclas globais
        document.addEventListener('keydown', this.handleKeyPress);
        
        // Eventos dos sistemas
        document.addEventListener('farmCreated', (e) => this.onFarmCreated(e.detail));
        document.addEventListener('harvestCompleted', (e) => this.onHarvestCompleted(e.detail));
        document.addEventListener('researchCompleted', (e) => this.onResearchCompleted(e.detail));
        document.addEventListener('weatherChanged', (e) => this.onWeatherChanged(e.detail));
        document.addEventListener('economyUpdate', (e) => this.onEconomyUpdate(e.detail));
        
        console.log('🎮 Eventos globais configurados');
    }

    /**
     * Inicia loops do jogo
     */
    startGameLoops() {
        // Loop principal do jogo (60 FPS)
        this.timers.gameLoop = setInterval(() => {
            if (this.isRunning && !this.isPaused) {
                this.gameLoop();
            }
        }, 1000 / 60);
        
        // Auto-save
        if (this.gameState.settings.autoSave) {
            this.timers.autoSave = setInterval(() => {
                this.saveGame();
            }, this.gameState.settings.autoSaveInterval);
        }
        
        // Atualização do clima (a cada 30 segundos)
        this.timers.weatherUpdate = setInterval(() => {
            if (this.systems.weather && this.isRunning && !this.isPaused) {
                this.systems.weather.updateWeather();
            }
        }, 30000);
        
        // Atualização das fazendas (a cada 5 segundos)
        this.timers.farmUpdate = setInterval(() => {
            if (this.systems.farm && this.isRunning && !this.isPaused) {
                this.systems.farm.updateFarms();
            }
        }, 5000);
        
        console.log('⏰ Loops do jogo iniciados');
    }

    /**
     * Loop principal do jogo
     */
    gameLoop() {
        const now = Date.now();
        const deltaTime = now - (this.lastFrameTime || now);
        this.lastFrameTime = now;
        
        // Atualiza tempo de jogo
        this.gameState.playTime += deltaTime * this.gameState.gameSpeed;
        this.stats.playTimeMinutes = Math.floor(this.gameState.playTime / 60000);
        
        // Atualiza sistemas que precisam de update contínuo
        if (this.systems.hud && typeof this.systems.hud.update === 'function') {
            this.systems.hud.update(deltaTime);
        }
        
        if (this.systems.map && typeof this.systems.map.update === 'function') {
            this.systems.map.update(deltaTime);
        }
        
        // Atualiza estatísticas
        this.updateStats();
    }

    /**
     * Pausa/despausa o jogo
     */
    togglePause() {
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            console.log('⏸️ Jogo pausado');
            this.dispatchEvent('gamePaused');
        } else {
            console.log('▶️ Jogo despausado');
            this.dispatchEvent('gameResumed');
        }
        
        // Atualiza HUD
        if (this.systems.hud) {
            this.systems.hud.updatePauseState(this.isPaused);
        }
    }

    /**
     * Altera velocidade do jogo
     */
    setGameSpeed(speed) {
        this.gameState.gameSpeed = Math.max(0.1, Math.min(5, speed));
        
        console.log(`⚡ Velocidade do jogo: ${this.gameState.gameSpeed}x`);
        
        this.dispatchEvent('gameSpeedChanged', { speed: this.gameState.gameSpeed });
        
        // Atualiza HUD
        if (this.systems.hud) {
            this.systems.hud.updateGameSpeed(this.gameState.gameSpeed);
        }
    }

    /**
     * Salva o jogo
     */
    saveGame() {
        try {
            const saveData = {
                version: this.gameState.version,
                timestamp: Date.now(),
                gameState: this.gameState,
                stats: this.stats,
                systems: {}
            };
            
            // Coleta dados dos sistemas
            Object.keys(this.systems).forEach(systemName => {
                const system = this.systems[systemName];
                if (system && typeof system.getSaveData === 'function') {
                    saveData.systems[systemName] = system.getSaveData();
                }
            });
            
            // Salva no localStorage
            localStorage.setItem('nasaFarmNavigators_save', JSON.stringify(saveData));
            
            this.gameState.lastSave = Date.now();
            
            console.log('💾 Jogo salvo com sucesso');
            
            this.dispatchEvent('gameSaved', { timestamp: this.gameState.lastSave });
            
            // Notifica usuário
            if (this.systems.hud) {
                this.systems.hud.showNotification('Jogo salvo automaticamente', 'success');
            }
            
        } catch (error) {
            console.error('❌ Erro ao salvar jogo:', error);
            
            if (this.systems.modals) {
                this.systems.modals.error(
                    'Não foi possível salvar o jogo. Verifique o espaço de armazenamento.',
                    error.message
                );
            }
        }
    }

    /**
     * Carrega dados do jogo
     */
    async loadGameData() {
        try {
            const savedData = localStorage.getItem('nasaFarmNavigators_save');
            
            if (savedData) {
                const data = JSON.parse(savedData);
                
                // Verifica compatibilidade de versão
                if (data.version !== this.gameState.version) {
                    console.warn('⚠️ Versão do save diferente da atual');
                    // Aqui poderia ter migração de dados
                }
                
                // Carrega estado do jogo
                this.gameState = { ...this.gameState, ...data.gameState };
                this.stats = { ...this.stats, ...data.stats };
                
                // Armazena dados dos sistemas para carregar depois
                this.savedSystemsData = data.systems || {};
                
                console.log('💾 Dados do jogo carregados');
                
            } else {
                console.log('🆕 Novo jogo iniciado');
                this.initializeNewGame();
            }
            
        } catch (error) {
            console.error('❌ Erro ao carregar dados do jogo:', error);
            this.initializeNewGame();
        }
    }

    /**
     * Inicializa novo jogo
     */
    initializeNewGame() {
        this.gameState.startTime = Date.now();
        this.gameState.lastSave = null;
        
        // Reseta estatísticas
        Object.keys(this.stats).forEach(key => {
            this.stats[key] = 0;
        });
        
        console.log('🆕 Novo jogo inicializado');
    }

    /**
     * Carrega dados nos sistemas após inicialização
     */
    loadSystemsData() {
        if (this.savedSystemsData) {
            Object.keys(this.savedSystemsData).forEach(systemName => {
                const system = this.systems[systemName];
                const data = this.savedSystemsData[systemName];
                
                if (system && typeof system.loadSaveData === 'function' && data) {
                    system.loadSaveData(data);
                }
            });
            
            console.log('💾 Dados dos sistemas carregados');
        }
    }

    /**
     * Atualiza estatísticas
     */
    updateStats() {
        try {
            // Atualiza estatísticas baseadas nos sistemas
            if (this.systems.farm && this.systems.farm.farms) {
                this.stats.totalFarms = this.systems.farm.farms.size || 0;
            }
            
            if (this.systems.economy && 
                this.systems.economy.playerData && 
                typeof this.systems.economy.playerData === 'object') {
                this.stats.totalRevenue = this.systems.economy.playerData.totalRevenue || 0;
                this.stats.totalExpenses = this.systems.economy.playerData.totalExpenses || 0;
            }
            
            if (this.systems.tech && this.systems.tech.researchedTechnologies) {
                this.stats.researchCompleted = this.systems.tech.researchedTechnologies.size || 0;
            }
        } catch (error) {
            console.warn('⚠️ Erro ao atualizar estatísticas:', error);
        }
    }

    /**
     * Eventos dos sistemas
     */
    
    onFarmCreated(data) {
        this.stats.totalFarms++;
        console.log(`🚜 Nova fazenda criada: ${data.name}`);
    }
    
    onHarvestCompleted(data) {
        this.stats.totalHarvests++;
        console.log(`🌾 Colheita realizada: ${data.crop} (${data.quantity})`);
    }
    
    onResearchCompleted(data) {
        this.stats.researchCompleted++;
        console.log(`🔬 Pesquisa concluída: ${data.technology}`);
    }
    
    onWeatherChanged(data) {
        console.log(`🌤️ Clima alterado: ${data.condition}`);
    }
    
    onEconomyUpdate(data) {
        console.log(`💰 Economia atualizada: ${data.type}`);
    }

    /**
     * Handlers de eventos
     */
    
    handleVisibilityChange() {
        if (document.hidden) {
            // Página ficou oculta - pausa o jogo
            if (this.isRunning && !this.isPaused) {
                this.togglePause();
                this.wasPausedByVisibility = true;
            }
        } else {
            // Página ficou visível - despausa se foi pausado automaticamente
            if (this.wasPausedByVisibility && this.isPaused) {
                this.togglePause();
                this.wasPausedByVisibility = false;
            }
        }
    }
    
    handleBeforeUnload(event) {
        // Salva o jogo antes de fechar
        this.saveGame();
        
        // Mostra aviso se há progresso não salvo
        if (this.gameState.lastSave && (Date.now() - this.gameState.lastSave) > 60000) {
            event.preventDefault();
            event.returnValue = 'Você tem progresso não salvo. Tem certeza que deseja sair?';
            return event.returnValue;
        }
    }
    
    handleKeyPress(event) {
        // Atalhos globais
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case 's':
                    event.preventDefault();
                    this.saveGame();
                    break;
                case 'p':
                    event.preventDefault();
                    this.togglePause();
                    break;
            }
        }
        
        // Teclas especiais
        switch (event.key) {
            case 'Escape':
                if (this.systems.panels) {
                    this.systems.panels.closeAllPanels();
                }
                break;
            case 'F1':
                event.preventDefault();
                this.showHelp();
                break;
        }
    }

    /**
     * Métodos de interface
     */
    
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }
    
    showHelp() {
        if (this.systems.modals) {
            this.systems.modals.showModal({
                type: 'custom',
                title: 'Ajuda - NASA Farm Navigators',
                size: { width: 600, height: 500 },
                content: `
                    <div class="help-content">
                        <h3>🎮 Controles</h3>
                        <ul>
                            <li><strong>Ctrl+S:</strong> Salvar jogo</li>
                            <li><strong>Ctrl+P:</strong> Pausar/Despausar</li>
                            <li><strong>ESC:</strong> Fechar painéis</li>
                            <li><strong>F1:</strong> Mostrar ajuda</li>
                        </ul>
                        
                        <h3>🚜 Como Jogar</h3>
                        <ul>
                            <li>Clique no mapa para criar fazendas</li>
                            <li>Plante culturas adequadas ao clima</li>
                            <li>Pesquise tecnologias para melhorar a produção</li>
                            <li>Gerencie recursos e economia</li>
                            <li>Monitore o clima e adapte suas estratégias</li>
                        </ul>
                        
                        <h3>🌍 Objetivo</h3>
                        <p>Construa fazendas sustentáveis ao redor do mundo, utilizando tecnologias da NASA para maximizar a produção e minimizar o impacto ambiental.</p>
                    </div>
                `,
                buttons: [
                    { text: 'Fechar', type: 'primary', action: 'ok' }
                ]
            });
        }
    }
    
    handleInitializationError(error) {
        // Mostra erro na tela
        const errorDiv = document.createElement('div');
        errorDiv.className = 'initialization-error';
        errorDiv.innerHTML = `
            <div class="error-content">
                <h2>❌ Erro de Inicialização</h2>
                <p>Não foi possível inicializar o jogo:</p>
                <pre>${error.message}</pre>
                <button onclick="location.reload()">Tentar Novamente</button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        this.hideLoadingScreen();
    }

    /**
     * Métodos utilitários
     */
    
    dispatchEvent(eventName, data = {}) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }
    
    getGameInfo() {
        return {
            version: this.gameState.version,
            isRunning: this.isRunning,
            isPaused: this.isPaused,
            gameSpeed: this.gameState.gameSpeed,
            playTime: this.gameState.playTime,
            stats: this.stats,
            systems: Object.keys(this.systems).filter(key => this.systems[key] !== null)
        };
    }

    /**
     * Limpeza e destruição
     */
    
    destroy() {
        // Salva o jogo
        this.saveGame();
        
        // Para todos os timers
        Object.values(this.timers).forEach(timer => {
            if (timer) clearInterval(timer);
        });
        
        // Destrói sistemas
        Object.values(this.systems).forEach(system => {
            if (system && typeof system.destroy === 'function') {
                system.destroy();
            }
        });
        
        // Remove event listeners
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
        document.removeEventListener('keydown', this.handleKeyPress);
        
        this.isInitialized = false;
        this.isRunning = false;
        
        console.log('🧹 Jogo destruído');
    }
}

// Classe Game disponível para uso manual
// A inicialização é feita pelo main.js para evitar conflitos

// Exporta para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Game;
}