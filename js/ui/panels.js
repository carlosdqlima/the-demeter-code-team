/**
 * Panels - FarmVerse
 * Gerencia todos os painéis da interface do usuário
 */

class Panels {
    constructor() {
        this.isInitialized = false;
        this.activePanels = new Map();
        this.panelHistory = [];
        this.maxHistorySize = 10;
        
        // Configurações dos painéis
        this.config = {
            animationDuration: 300,
            enableAnimations: true,
            autoClose: true,
            maxOpenPanels: 3,
            defaultPosition: 'center',
            enableDragging: true,
            enableResizing: false
        };
        
        // Tipos de painéis disponíveis
        this.panelTypes = {
            farm: 'Farm',
            market: 'Market',
            research: 'Research',
            inventory: 'Inventory',
            settings: 'Settings',
            weather: 'Weather',
            statistics: 'Statistics',
            achievements: 'Achievements',
            tutorial: 'Tutorial',
            help: 'Help'
        };
        
        // Estado dos painéis
        this.panelStates = new Map();
        
        // Bind methods
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    /**
     * Inicializa o sistema de painéis
     */
    async initialize() {
        try {
            console.log('📋 Inicializando sistema de painéis...');
            
            // Cria container principal
            this.createPanelContainer();
            
            // Configura eventos globais
            this.setupGlobalEvents();
            
            // Carrega configurações salvas
            this.loadPanelSettings();
            
            // Registra painéis padrão
            this.registerDefaultPanels();
            
            this.isInitialized = true;
            console.log('✅ Sistema de painéis inicializado com sucesso');
            
            // Dispara evento de inicialização
            this.dispatchEvent('panelsInitialized', {
                panelTypes: Object.keys(this.panelTypes).length
            });
            
        } catch (error) {
            console.error('❌ Erro ao inicializar sistema de painéis:', error);
            throw error;
        }
    }

    /**
     * Cria container principal dos painéis
     */
    createPanelContainer() {
        const container = document.createElement('div');
        container.id = 'panels-container';
        container.className = 'panels-container';
        
        // Overlay para fechar painéis
        const overlay = document.createElement('div');
        overlay.className = 'panels-overlay';
        overlay.addEventListener('click', () => this.closeAllPanels());
        
        container.appendChild(overlay);
        document.body.appendChild(container);
        
        this.container = container;
        this.overlay = overlay;
        
        console.log('📋 Container de painéis criado');
    }

    /**
     * Configura eventos globais
     */
    setupGlobalEvents() {
        // Teclas de atalho
        document.addEventListener('keydown', this.handleKeyPress);
        
        // Redimensionamento da janela
        window.addEventListener('resize', this.handleResize);
        
        // Eventos do jogo
        document.addEventListener('openPanel', (e) => this.openPanel(e.detail.type, e.detail.data));
        document.addEventListener('closePanel', (e) => this.closePanel(e.detail.id));
        document.addEventListener('togglePanel', (e) => this.togglePanel(e.detail.type, e.detail.data));
        
        console.log('📋 Eventos globais configurados');
    }

    /**
     * Registra painéis padrão
     */
    registerDefaultPanels() {
        // Painel de fazenda
        this.registerPanel('farm', {
            title: 'Manage Farm',
            size: { width: 600, height: 500 },
            resizable: true,
            content: this.createFarmPanelContent
        });
        
        // Painel de mercado
        this.registerPanel('market', {
            title: 'Market',
            size: { width: 700, height: 600 },
            resizable: true,
            content: this.createMarketPanelContent
        });
        
        // Painel de pesquisa
        this.registerPanel('research', {
            title: 'Research Center',
            size: { width: 650, height: 550 },
            resizable: true,
            content: this.createResearchPanelContent
        });
        
        // Painel de inventário
        this.registerPanel('inventory', {
            title: 'Inventory',
            size: { width: 500, height: 400 },
            resizable: false,
            content: this.createInventoryPanelContent
        });
        
        // Painel de configurações
        this.registerPanel('settings', {
            title: 'Settings',
            size: { width: 450, height: 350 },
            resizable: false,
            content: this.createSettingsPanelContent
        });
        
        // Painel de estatísticas
        this.registerPanel('statistics', {
            title: 'Estatísticas',
            size: { width: 600, height: 450 },
            resizable: true,
            content: this.createStatisticsPanelContent
        });
        
        console.log('📋 Painéis padrão registrados');
    }

    /**
     * Registra um novo tipo de painel
     */
    registerPanel(type, config) {
        this.panelTypes[type] = config.title || type;
        this.panelStates.set(type, {
            config: config,
            instances: new Map()
        });
        
        console.log(`📋 Painel registrado: ${type}`);
    }

    /**
     * Abre um painel
     */
    openPanel(type, data = {}) {
        try {
            if (!this.panelStates.has(type)) {
                console.error(`❌ Tipo de painel não registrado: ${type}`);
                return null;
            }
            
            // Verifica limite de painéis abertos
            if (this.activePanels.size >= this.config.maxOpenPanels) {
                this.closeOldestPanel();
            }
            
            const panelConfig = this.panelStates.get(type).config;
            const panelId = this.generatePanelId(type);
            
            // Cria elemento do painel
            const panelElement = this.createPanelElement(panelId, type, panelConfig, data);
            
            // Adiciona ao container
            this.container.appendChild(panelElement);
            
            // Registra painel ativo
            this.activePanels.set(panelId, {
                type: type,
                element: panelElement,
                data: data,
                openedAt: Date.now()
            });
            
            // Adiciona ao histórico
            this.addToHistory(panelId, type);
            
            // Mostra overlay se necessário
            this.updateOverlayVisibility();
            
            // Anima entrada
            if (this.config.enableAnimations) {
                this.animatePanelIn(panelElement);
            }
            
            // Foca no painel
            this.focusPanel(panelId);
            
            console.log(`📋 Painel aberto: ${type} (${panelId})`);
            
            // Dispara evento
            this.dispatchEvent('panelOpened', { id: panelId, type: type, data: data });
            
            return panelId;
            
        } catch (error) {
            console.error('❌ Erro ao abrir painel:', error);
            return null;
        }
    }

    /**
     * Fecha um painel
     */
    closePanel(panelId) {
        try {
            if (!this.activePanels.has(panelId)) {
                console.warn(`⚠️ Painel não encontrado: ${panelId}`);
                return false;
            }
            
            const panel = this.activePanels.get(panelId);
            
            // Anima saída
            if (this.config.enableAnimations) {
                this.animatePanelOut(panel.element, () => {
                    this.removePanelElement(panelId, panel);
                });
            } else {
                this.removePanelElement(panelId, panel);
            }
            
            console.log(`📋 Painel fechado: ${panel.type} (${panelId})`);
            
            // Dispara evento
            this.dispatchEvent('panelClosed', { id: panelId, type: panel.type });
            
            return true;
            
        } catch (error) {
            console.error('❌ Erro ao fechar painel:', error);
            return false;
        }
    }

    /**
     * Alterna um painel (abre se fechado, fecha se aberto)
     */
    togglePanel(type, data = {}) {
        // Verifica se já existe um painel deste tipo aberto
        const existingPanel = Array.from(this.activePanels.entries())
            .find(([id, panel]) => panel.type === type);
        
        if (existingPanel) {
            this.closePanel(existingPanel[0]);
        } else {
            this.openPanel(type, data);
        }
    }

    /**
     * Fecha todos os painéis
     */
    closeAllPanels() {
        const panelIds = Array.from(this.activePanels.keys());
        
        panelIds.forEach(panelId => {
            this.closePanel(panelId);
        });
        
        console.log('📋 Todos os painéis fechados');
    }

    /**
     * Cria elemento do painel
     */
    createPanelElement(panelId, type, config, data) {
        const panel = document.createElement('div');
        panel.className = 'game-panel';
        panel.id = panelId;
        panel.setAttribute('data-panel-type', type);
        
        // Define tamanho
        if (config.size) {
            panel.style.width = `${config.size.width}px`;
            panel.style.height = `${config.size.height}px`;
        }
        
        // Cabeçalho do painel
        const header = this.createPanelHeader(panelId, config.title || type, config);
        panel.appendChild(header);
        
        // Conteúdo do painel
        const content = this.createPanelContentWrapper(panelId, type, config, data);
        panel.appendChild(content);
        
        // Rodapé do painel (se necessário)
        if (config.showFooter) {
            const footer = this.createPanelFooter(panelId, config);
            panel.appendChild(footer);
        }
        
        // Configurações adicionais
        if (config.resizable && this.config.enableResizing) {
            this.makeResizable(panel);
        }
        
        if (this.config.enableDragging) {
            this.makeDraggable(panel, header);
        }
        
        // Posicionamento
        this.positionPanel(panel, config.position || this.config.defaultPosition);
        
        return panel;
    }

    /**
     * Cria cabeçalho do painel
     */
    createPanelHeader(panelId, title, config) {
        const header = document.createElement('div');
        header.className = 'panel-header';
        
        header.innerHTML = `
            <div class="panel-title">
                <span class="panel-icon">${this.getPanelIcon(config.type || 'default')}</span>
                <span class="panel-title-text">${title}</span>
            </div>
            <div class="panel-controls">
                ${config.minimizable ? '<button class="panel-btn panel-minimize" title="Minimizar">−</button>' : ''}
                ${config.maximizable ? '<button class="panel-btn panel-maximize" title="Maximizar">□</button>' : ''}
                <button class="panel-btn panel-close" title="Fechar">×</button>
            </div>
        `;
        
        // Eventos dos controles
        const closeBtn = header.querySelector('.panel-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closePanel(panelId));
        }
        
        const minimizeBtn = header.querySelector('.panel-minimize');
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => this.minimizePanel(panelId));
        }
        
        const maximizeBtn = header.querySelector('.panel-maximize');
        if (maximizeBtn) {
            maximizeBtn.addEventListener('click', () => this.maximizePanel(panelId));
        }
        
        return header;
    }

    /**
     * Cria wrapper do conteúdo do painel
     */
    createPanelContentWrapper(panelId, type, config, data) {
        const wrapper = document.createElement('div');
        wrapper.className = 'panel-content';
        
        // Gera conteúdo usando a função específica
        if (typeof config.content === 'function') {
            const content = config.content.call(this, data, panelId);
            if (typeof content === 'string') {
                wrapper.innerHTML = content;
            } else if (content instanceof HTMLElement) {
                wrapper.appendChild(content);
            }
        } else if (typeof config.content === 'string') {
            wrapper.innerHTML = config.content;
        } else {
            wrapper.innerHTML = `<p>Conteúdo do painel ${type} não definido.</p>`;
        }
        
        return wrapper;
    }

    /**
     * Cria rodapé do painel
     */
    createPanelFooter(panelId, config) {
        const footer = document.createElement('div');
        footer.className = 'panel-footer';
        
        footer.innerHTML = `
            <div class="panel-actions">
                <button class="btn btn-secondary" onclick="panels.closePanel('${panelId}')">Fechar</button>
                ${config.footerButtons ? config.footerButtons.map(btn => 
                    `<button class="btn btn-${btn.type || 'primary'}" onclick="${btn.action}">${btn.text}</button>`
                ).join('') : ''}
            </div>
        `;
        
        return footer;
    }

    /**
     * Conteúdo dos painéis específicos
     */
    
    createFarmPanelContent(data, panelId) {
        return `
            <div class="farm-panel">
                <div class="farm-tabs">
                    <button class="tab-btn active" data-tab="overview">Visão Geral</button>
                    <button class="tab-btn" data-tab="crops">Cultivos</button>
                    <button class="tab-btn" data-tab="equipment">Equipamentos</button>
                    <button class="tab-btn" data-tab="automation">Automação</button>
                </div>
                
                <div class="tab-content active" data-tab="overview">
                    <div class="farm-overview">
                        <div class="farm-stats">
                            <div class="stat-card">
                                <div class="stat-icon">🌾</div>
                                <div class="stat-info">
                                    <div class="stat-value" id="farm-crops-count">0</div>
                                    <div class="stat-label">Cultivos Ativos</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">💧</div>
                                <div class="stat-info">
                                    <div class="stat-value" id="farm-water-level">100%</div>
                                    <div class="stat-label">Nível de Água</div>
                                </div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-icon">⚡</div>
                                <div class="stat-info">
                                    <div class="stat-value" id="farm-energy-level">100%</div>
                                    <div class="stat-label">Energia</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="farm-actions">
                            <button class="action-btn" onclick="farmSystem.plantCrops()">
                                <span class="btn-icon">🌱</span>
                                <span class="btn-text">Plantar Cultivos</span>
                            </button>
                            <button class="action-btn" onclick="farmSystem.harvestCrops()">
                                <span class="btn-icon">🌾</span>
                                <span class="btn-text">Colher Tudo</span>
                            </button>
                            <button class="action-btn" onclick="farmSystem.waterCrops()">
                                <span class="btn-icon">💧</span>
                                <span class="btn-text">Irrigar</span>
                            </button>
                            <button class="action-btn" onclick="farmSystem.fertilizeCrops()">
                                <span class="btn-icon">🧪</span>
                                <span class="btn-text">Fertilizar</span>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="tab-content" data-tab="crops">
                    <div class="crops-list" id="crops-list">
                        <p>Carregando cultivos...</p>
                    </div>
                </div>
                
                <div class="tab-content" data-tab="equipment">
                    <div class="equipment-list" id="equipment-list">
                        <p>Carregando equipamentos...</p>
                    </div>
                </div>
                
                <div class="tab-content" data-tab="automation">
                    <div class="automation-settings" id="automation-settings">
                        <p>Configurações de automação em desenvolvimento...</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    createMarketPanelContent(data, panelId) {
        return `
            <div class="market-panel">
                <div class="market-tabs">
                    <button class="tab-btn active" data-tab="buy">Comprar</button>
                    <button class="tab-btn" data-tab="sell">Vender</button>
                    <button class="tab-btn" data-tab="prices">Preços</button>
                </div>
                
                <div class="tab-content active" data-tab="buy">
                    <div class="market-section">
                        <h3>Sementes Disponíveis</h3>
                        <div class="market-items" id="seeds-market">
                            <p>Carregando sementes...</p>
                        </div>
                    </div>
                    
                    <div class="market-section">
                        <h3>Equipamentos</h3>
                        <div class="market-items" id="equipment-market">
                            <p>Carregando equipamentos...</p>
                        </div>
                    </div>
                </div>
                
                <div class="tab-content" data-tab="sell">
                    <div class="market-section">
                        <h3>Seus Produtos</h3>
                        <div class="market-items" id="player-products">
                            <p>Carregando produtos...</p>
                        </div>
                    </div>
                </div>
                
                <div class="tab-content" data-tab="prices">
                    <div class="market-section">
                        <h3>Tendências de Preços</h3>
                        <div class="price-chart" id="price-chart">
                            <p>Gráfico de preços em desenvolvimento...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    createResearchPanelContent(data, panelId) {
        return `
            <div class="research-panel">
                <div class="research-header">
                    <div class="research-points">
                        <span class="points-icon">🧪</span>
                        <span class="points-amount" id="research-points-display">0</span>
                        <span class="points-label">Pontos de Pesquisa</span>
                    </div>
                </div>
                
                <div class="research-categories">
                    <button class="category-btn active" data-category="agriculture">Agriculture</button>
                    <button class="category-btn" data-category="technology">Technology</button>
                    <button class="category-btn" data-category="sustainability">Sustainability</button>
                    <button class="category-btn" data-category="space">Space</button>
                </div>
                
                <div class="research-content">
                    <div class="research-tree" id="research-tree">
                        <p>Loading research tree...</p>
                    </div>
                </div>
                
                <div class="research-queue">
                    <h4>Research Queue</h4>
                    <div class="queue-list" id="research-queue-list">
                        <p>No research in queue</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    createInventoryPanelContent(data, panelId) {
        return `
            <div class="inventory-panel">
                <div class="inventory-header">
                    <div class="inventory-capacity">
                        <span>Capacity: </span>
                        <span id="inventory-used">0</span>/<span id="inventory-max">100</span>
                    </div>
                    <div class="inventory-filters">
                        <button class="filter-btn active" data-filter="all">All</button>
                        <button class="filter-btn" data-filter="seeds">Seeds</button>
                        <button class="filter-btn" data-filter="crops">Crops</button>
                        <button class="filter-btn" data-filter="equipment">Equipment</button>
                    </div>
                </div>
                
                <div class="inventory-grid" id="inventory-grid">
                    <p>Loading inventory...</p>
                </div>
                
                <div class="inventory-actions">
                    <button class="btn btn-secondary" onclick="this.sortInventory()">Sort</button>
                    <button class="btn btn-primary" onclick="this.sellJunk()">Sell Junk</button>
                </div>
            </div>
        `;
    }
    
    createSettingsPanelContent(data, panelId) {
        return `
            <div class="settings-panel">
                <div class="settings-tabs">
                    <button class="tab-btn active" data-tab="game">Game</button>
                    <button class="tab-btn" data-tab="graphics">Graphics</button>
                    <button class="tab-btn" data-tab="audio">Audio</button>
                    <button class="tab-btn" data-tab="controls">Controls</button>
                </div>
                
                <div class="tab-content active" data-tab="game">
                    <div class="settings-section">
                        <h4>Game Settings</h4>
                        <div class="setting-item">
                            <label>Game Speed:</label>
                            <select id="game-speed">
                                <option value="0.5">0.5x</option>
                                <option value="1" selected>1x</option>
                                <option value="2">2x</option>
                                <option value="4">4x</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label>
                                <input type="checkbox" id="auto-save" checked>
                                Auto Save
                            </label>
                        </div>
                        <div class="setting-item">
                            <label>
                                <input type="checkbox" id="notifications" checked>
                                Notifications
                            </label>
                        </div>
                    </div>
                </div>
                
                <div class="tab-content" data-tab="graphics">
                    <div class="settings-section">
                        <h4>Graphics Settings</h4>
                        <div class="setting-item">
                            <label>
                                <input type="checkbox" id="animations" checked>
                                Animations
                            </label>
                        </div>
                        <div class="setting-item">
                            <label>
                                <input type="checkbox" id="particles" checked>
                                Particle Effects
                            </label>
                        </div>
                    </div>
                </div>
                
                <div class="tab-content" data-tab="audio">
                    <div class="settings-section">
                        <h4>Audio Settings</h4>
                        <div class="setting-item">
                            <label>Master Volume:</label>
                            <input type="range" id="master-volume" min="0" max="100" value="50">
                        </div>
                        <div class="setting-item">
                            <label>Music Volume:</label>
                            <input type="range" id="music-volume" min="0" max="100" value="30">
                        </div>
                        <div class="setting-item">
                            <label>Effects Volume:</label>
                            <input type="range" id="sfx-volume" min="0" max="100" value="70">
                        </div>
                    </div>
                </div>
                
                <div class="tab-content" data-tab="controls">
                    <div class="settings-section">
                        <h4>Controls</h4>
                        <div class="controls-list">
                            <div class="control-item">
                                <span>Open Farm:</span>
                                <kbd>F</kbd>
                            </div>
                            <div class="control-item">
                                <span>Open Market:</span>
                                <kbd>M</kbd>
                            </div>
                            <div class="control-item">
                                <span>Open Research:</span>
                                <kbd>R</kbd>
                            </div>
                            <div class="control-item">
                                <span>Open Inventory:</span>
                                <kbd>I</kbd>
                            </div>
                            <div class="control-item">
                                <span>Pause/Resume:</span>
                                <kbd>Space</kbd>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    createStatisticsPanelContent(data, panelId) {
        return `
            <div class="statistics-panel">
                <div class="stats-overview">
                    <div class="stat-card">
                        <div class="stat-icon">💰</div>
                        <div class="stat-info">
                            <div class="stat-value" id="total-earnings">$0</div>
                            <div class="stat-label">Ganhos Totais</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🌾</div>
                        <div class="stat-info">
                            <div class="stat-value" id="crops-harvested">0</div>
                            <div class="stat-label">Cultivos Colhidos</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🏆</div>
                        <div class="stat-info">
                            <div class="stat-value" id="achievements-unlocked">0</div>
                            <div class="stat-label">Conquistas</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⏱️</div>
                        <div class="stat-info">
                            <div class="stat-value" id="time-played">0h</div>
                            <div class="stat-label">Tempo Jogado</div>
                        </div>
                    </div>
                </div>
                
                <div class="stats-charts">
                    <div class="chart-container">
                        <h4>Produção por Dia</h4>
                        <div class="chart" id="production-chart">
                            <p>Gráfico de produção em desenvolvimento...</p>
                        </div>
                    </div>
                    
                    <div class="chart-container">
                        <h4>Receita por Mês</h4>
                        <div class="chart" id="revenue-chart">
                            <p>Gráfico de receita em desenvolvimento...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Métodos auxiliares
     */
    
    generatePanelId(type) {
        return `panel-${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    getPanelIcon(type) {
        const icons = {
            farm: '🚜',
            market: '🏪',
            research: '🔬',
            inventory: '🎒',
            settings: '⚙️',
            weather: '🌤️',
            statistics: '📊',
            achievements: '🏆',
            tutorial: '📚',
            help: '❓',
            default: '📋'
        };
        return icons[type] || icons.default;
    }
    
    positionPanel(panel, position) {
        const rect = panel.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        let left, top;
        
        switch (position) {
            case 'center':
                left = (windowWidth - rect.width) / 2;
                top = (windowHeight - rect.height) / 2;
                break;
            case 'top-left':
                left = 20;
                top = 20;
                break;
            case 'top-right':
                left = windowWidth - rect.width - 20;
                top = 20;
                break;
            case 'bottom-left':
                left = 20;
                top = windowHeight - rect.height - 20;
                break;
            case 'bottom-right':
                left = windowWidth - rect.width - 20;
                top = windowHeight - rect.height - 20;
                break;
            default:
                left = (windowWidth - rect.width) / 2;
                top = (windowHeight - rect.height) / 2;
        }
        
        // Ajusta para não sair da tela
        left = Math.max(0, Math.min(left, windowWidth - rect.width));
        top = Math.max(0, Math.min(top, windowHeight - rect.height));
        
        panel.style.left = `${left}px`;
        panel.style.top = `${top}px`;
    }
    
    makeDraggable(panel, handle) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        
        handle.style.cursor = 'move';
        
        handle.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(panel.style.left) || 0;
            startTop = parseInt(panel.style.top) || 0;
            
            panel.style.zIndex = this.getHighestZIndex() + 1;
            
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            panel.style.left = `${startLeft + deltaX}px`;
            panel.style.top = `${startTop + deltaY}px`;
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }
    
    makeResizable(panel) {
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'panel-resize-handle';
        panel.appendChild(resizeHandle);
        
        let isResizing = false;
        let startX, startY, startWidth, startHeight;
        
        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = parseInt(document.defaultView.getComputedStyle(panel).width, 10);
            startHeight = parseInt(document.defaultView.getComputedStyle(panel).height, 10);
            
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            
            const width = startWidth + e.clientX - startX;
            const height = startHeight + e.clientY - startY;
            
            panel.style.width = `${Math.max(300, width)}px`;
            panel.style.height = `${Math.max(200, height)}px`;
        });
        
        document.addEventListener('mouseup', () => {
            isResizing = false;
        });
    }
    
    getHighestZIndex() {
        let highest = 1000;
        
        this.activePanels.forEach(panel => {
            const zIndex = parseInt(panel.element.style.zIndex) || 1000;
            if (zIndex > highest) {
                highest = zIndex;
            }
        });
        
        return highest;
    }
    
    focusPanel(panelId) {
        const panel = this.activePanels.get(panelId);
        if (panel) {
            panel.element.style.zIndex = this.getHighestZIndex() + 1;
            panel.element.classList.add('panel-focused');
            
            // Remove foco de outros painéis
            this.activePanels.forEach((otherPanel, otherId) => {
                if (otherId !== panelId) {
                    otherPanel.element.classList.remove('panel-focused');
                }
            });
        }
    }
    
    minimizePanel(panelId) {
        const panel = this.activePanels.get(panelId);
        if (panel) {
            panel.element.classList.toggle('panel-minimized');
        }
    }
    
    maximizePanel(panelId) {
        const panel = this.activePanels.get(panelId);
        if (panel) {
            panel.element.classList.toggle('panel-maximized');
        }
    }
    
    closeOldestPanel() {
        let oldestPanel = null;
        let oldestTime = Date.now();
        
        this.activePanels.forEach((panel, panelId) => {
            if (panel.openedAt < oldestTime) {
                oldestTime = panel.openedAt;
                oldestPanel = panelId;
            }
        });
        
        if (oldestPanel) {
            this.closePanel(oldestPanel);
        }
    }
    
    addToHistory(panelId, type) {
        this.panelHistory.unshift({ id: panelId, type: type, timestamp: Date.now() });
        
        if (this.panelHistory.length > this.maxHistorySize) {
            this.panelHistory = this.panelHistory.slice(0, this.maxHistorySize);
        }
    }
    
    updateOverlayVisibility() {
        if (this.activePanels.size > 0) {
            this.overlay.style.display = 'block';
        } else {
            this.overlay.style.display = 'none';
        }
    }
    
    removePanelElement(panelId, panel) {
        // Remove do DOM
        if (panel.element.parentElement) {
            panel.element.parentElement.removeChild(panel.element);
        }
        
        // Remove do registro
        this.activePanels.delete(panelId);
        
        // Atualiza overlay
        this.updateOverlayVisibility();
    }
    
    animatePanelIn(element) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            element.style.transition = `opacity ${this.config.animationDuration}ms ease, transform ${this.config.animationDuration}ms ease`;
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        }, 10);
    }
    
    animatePanelOut(element, callback) {
        element.style.transition = `opacity ${this.config.animationDuration}ms ease, transform ${this.config.animationDuration}ms ease`;
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        
        setTimeout(callback, this.config.animationDuration);
    }

    /**
     * Eventos
     */
    
    handleKeyPress(event) {
        // Atalhos de teclado
        if (event.ctrlKey || event.metaKey) return;
        
        switch (event.key.toLowerCase()) {
            case 'f':
                event.preventDefault();
                this.togglePanel('farm');
                break;
            case 'm':
                event.preventDefault();
                this.togglePanel('market');
                break;
            case 'r':
                event.preventDefault();
                this.togglePanel('research');
                break;
            case 'i':
                event.preventDefault();
                this.togglePanel('inventory');
                break;
            case 'escape':
                event.preventDefault();
                this.closeAllPanels();
                break;
        }
    }
    
    handleResize() {
        // Reposiciona painéis que saíram da tela
        this.activePanels.forEach(panel => {
            const element = panel.element;
            const rect = element.getBoundingClientRect();
            
            if (rect.right > window.innerWidth) {
                element.style.left = `${window.innerWidth - rect.width - 20}px`;
            }
            
            if (rect.bottom > window.innerHeight) {
                element.style.top = `${window.innerHeight - rect.height - 20}px`;
            }
            
            if (rect.left < 0) {
                element.style.left = '20px';
            }
            
            if (rect.top < 0) {
                element.style.top = '20px';
            }
        });
    }
    
    dispatchEvent(eventName, data = {}) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }

    /**
     * Gerenciamento de dados
     */
    
    loadPanelSettings() {
        try {
            const savedSettings = localStorage.getItem('panelSettings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                this.config = { ...this.config, ...settings };
                
                console.log('💾 Configurações dos painéis carregadas');
            }
        } catch (error) {
            console.error('❌ Erro ao carregar configurações dos painéis:', error);
        }
    }
    
    savePanelSettings() {
        try {
            localStorage.setItem('panelSettings', JSON.stringify(this.config));
            console.log('💾 Configurações dos painéis salvas');
        } catch (error) {
            console.error('❌ Erro ao salvar configurações dos painéis:', error);
        }
    }

    /**
     * Limpeza e destruição
     */
    
    destroy() {
        // Salva configurações
        this.savePanelSettings();
        
        // Fecha todos os painéis
        this.closeAllPanels();
        
        // Remove container
        if (this.container && this.container.parentElement) {
            this.container.parentElement.removeChild(this.container);
        }
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyPress);
        window.removeEventListener('resize', this.handleResize);
        
        // Limpa dados
        this.activePanels.clear();
        this.panelStates.clear();
        this.panelHistory = [];
        this.isInitialized = false;
        
        console.log('🧹 Sistema de painéis destruído');
    }
}

// Exporta para uso global e módulos
if (typeof window !== 'undefined') {
    window.Panels = Panels;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Panels;
}