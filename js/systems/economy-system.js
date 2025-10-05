/**
 * Sistema Econômico - FarmVerse
 * Gerencia economia, mercado, preços e transações financeiras
 */

class EconomySystem {
    constructor() {
        this.isInitialized = false;
        this.marketData = new Map();
        this.transactions = [];
        this.playerWallet = {
            balance: 10000, // Saldo inicial
            currency: 'USD',
            creditLimit: 5000
        };
        
        // Configurações do sistema econômico
        this.config = {
            marketUpdateInterval: 30000, // 30 segundos
            priceVolatility: 0.1, // 10% de volatilidade
            seasonalMultipliers: {
                spring: 1.0,
                summer: 1.2,
                autumn: 0.8,
                winter: 1.1
            },
            demandFactors: {
                population: 1.0,
                weather: 1.0,
                events: 1.0
            },
            taxRate: 0.15, // 15% de imposto
            inflationRate: 0.02 // 2% ao ano
        };
        
        // Dados do mercado
        this.marketStats = {
            totalVolume: 0,
            averagePrice: 0,
            marketTrend: 'stable',
            volatilityIndex: 0.1
        };
        
        // Histórico de preços
        this.priceHistory = new Map();
        
        // Bind methods
        this.updateMarketPrices = this.updateMarketPrices.bind(this);
        this.onTransactionCompleted = this.onTransactionCompleted.bind(this);
    }

    /**
     * Inicializa o sistema econômico
     */
    async initialize() {
        try {
            console.log('💰 Inicializando Sistema Econômico...');
            
            // Carrega dados salvos
            await this.loadEconomyData();
            
            // Inicializa preços do mercado
            this.initializeMarketPrices();
            
            // Configura eventos
            this.setupEventListeners();
            
            // Inicia atualizações automáticas
            this.startMarketUpdates();
            
            this.isInitialized = true;
            console.log('✅ Sistema Econômico inicializado com sucesso');
            
            // Dispara evento de inicialização
            this.dispatchEvent('economySystemInitialized', {
                balance: this.playerWallet.balance,
                marketItems: this.marketData.size
            });
            
        } catch (error) {
            console.error('❌ Erro ao inicializar Sistema Econômico:', error);
            throw error;
        }
    }

    /**
     * Inicializa preços do mercado para todas as culturas
     */
    initializeMarketPrices() {
        // Carrega dados das culturas se disponível
        const cropsData = window.cropsData || {};
        const crops = Object.values(cropsData);
        
        crops.forEach(crop => {
            if (!this.marketData.has(crop.name)) {
                const basePrice = crop.price || this.generateBasePrice(crop);
                
                this.marketData.set(crop.name, {
                    name: crop.name,
                    category: crop.category || 'grain',
                    basePrice: basePrice,
                    currentPrice: basePrice,
                    demand: this.generateDemand(),
                    supply: this.generateSupply(),
                    trend: 'stable',
                    lastUpdate: new Date(),
                    dailyVolume: 0,
                    priceChange: 0,
                    priceChangePercent: 0
                });
                
                // Inicializa histórico de preços
                this.priceHistory.set(crop.name, [{
                    date: new Date(),
                    price: basePrice,
                    volume: 0
                }]);
            }
        });
        
        console.log(`📊 Preços inicializados para ${this.marketData.size} produtos`);
    }

    /**
     * Configura os ouvintes de eventos
     */
    setupEventListeners() {
        // Eventos de transação
        document.addEventListener('sellCrop', (e) => this.sellCrop(e.detail));
        document.addEventListener('buySeed', (e) => this.buySeed(e.detail));
        document.addEventListener('buyEquipment', (e) => this.buyEquipment(e.detail));
        
        // Eventos de mercado
        document.addEventListener('marketAnalysis', (e) => this.getMarketAnalysis(e.detail));
        document.addEventListener('priceAlert', (e) => this.setPriceAlert(e.detail));
    }

    /**
     * Inicia atualizações automáticas do mercado
     */
    startMarketUpdates() {
        this.marketUpdateTimer = setInterval(() => {
            this.updateMarketPrices();
        }, this.config.marketUpdateInterval);
        
        console.log('📈 Atualizações automáticas do mercado iniciadas');
    }

    /**
     * Atualiza preços do mercado
     */
    updateMarketPrices() {
        const now = new Date();
        let totalVolume = 0;
        let totalValue = 0;
        
        this.marketData.forEach((item, cropName) => {
            // Calcula nova demanda e oferta
            const newDemand = this.calculateDemand(cropName);
            const newSupply = this.calculateSupply(cropName);
            
            // Calcula novo preço baseado em oferta e demanda
            const demandSupplyRatio = newDemand / newSupply;
            const priceMultiplier = Math.pow(demandSupplyRatio, 0.3);
            
            // Adiciona volatilidade
            const volatility = (Math.random() - 0.5) * this.config.priceVolatility;
            const seasonalMultiplier = this.getSeasonalMultiplier();
            
            const oldPrice = item.currentPrice;
            const newPrice = Math.max(0.1, 
                item.basePrice * priceMultiplier * seasonalMultiplier * (1 + volatility)
            );
            
            // Atualiza dados do item
            item.currentPrice = Math.round(newPrice * 100) / 100;
            item.demand = newDemand;
            item.supply = newSupply;
            item.priceChange = item.currentPrice - oldPrice;
            item.priceChangePercent = (item.priceChange / oldPrice) * 100;
            item.trend = this.calculateTrend(item.priceChangePercent);
            item.lastUpdate = now;
            
            // Atualiza histórico
            this.updatePriceHistory(cropName, item.currentPrice, item.dailyVolume);
            
            totalVolume += item.dailyVolume;
            totalValue += item.currentPrice * item.dailyVolume;
            
            // Reset volume diário
            item.dailyVolume = 0;
        });
        
        // Atualiza estatísticas do mercado
        this.marketStats.totalVolume = totalVolume;
        this.marketStats.averagePrice = totalVolume > 0 ? totalValue / totalVolume : 0;
        this.marketStats.marketTrend = this.calculateMarketTrend();
        
        // Dispara evento de atualização
        this.dispatchEvent('marketPricesUpdated', {
            timestamp: now,
            totalItems: this.marketData.size,
            totalVolume: totalVolume
        });
        
        console.log('📊 Preços do mercado atualizados');
    }

    /**
     * Vende uma cultura no mercado
     */
    sellCrop(saleData) {
        try {
            const { cropType, quantity, farmId } = saleData;
            
            if (!this.marketData.has(cropType)) {
                throw new Error(`Produto ${cropType} não encontrado no mercado`);
            }
            
            const marketItem = this.marketData.get(cropType);
            const totalValue = quantity * marketItem.currentPrice;
            const tax = totalValue * this.config.taxRate;
            const netValue = totalValue - tax;
            
            // Atualiza saldo do jogador
            this.playerWallet.balance += netValue;
            
            // Registra transação
            const transaction = {
                id: this.generateTransactionId(),
                type: 'sale',
                cropType: cropType,
                quantity: quantity,
                unitPrice: marketItem.currentPrice,
                totalValue: totalValue,
                tax: tax,
                netValue: netValue,
                farmId: farmId,
                timestamp: new Date(),
                status: 'completed'
            };
            
            this.transactions.push(transaction);
            
            // Atualiza volume do mercado
            marketItem.dailyVolume += quantity;
            
            // Afeta oferta (aumenta)
            marketItem.supply += quantity * 0.1;
            
            console.log(`💰 Vendido: ${quantity}x ${cropType} por $${netValue.toFixed(2)}`);
            
            // Dispara eventos
            this.dispatchEvent('cropSold', { transaction });
            this.dispatchEvent('balanceUpdated', { 
                balance: this.playerWallet.balance,
                change: netValue
            });
            
            return transaction;
            
        } catch (error) {
            console.error('❌ Erro ao vender cultura:', error);
            throw error;
        }
    }

    /**
     * Compra sementes
     */
    buySeed(purchaseData) {
        try {
            const { cropType, quantity } = purchaseData;
            
            if (!this.marketData.has(cropType)) {
                throw new Error(`Sementes de ${cropType} não disponíveis`);
            }
            
            const marketItem = this.marketData.get(cropType);
            const seedPrice = marketItem.currentPrice * 0.1; // Sementes custam 10% do preço da cultura
            const totalCost = quantity * seedPrice;
            
            if (this.playerWallet.balance < totalCost) {
                throw new Error('Saldo insuficiente');
            }
            
            // Debita do saldo
            this.playerWallet.balance -= totalCost;
            
            // Registra transação
            const transaction = {
                id: this.generateTransactionId(),
                type: 'purchase',
                item: `${cropType} Seeds`,
                quantity: quantity,
                unitPrice: seedPrice,
                totalCost: totalCost,
                timestamp: new Date(),
                status: 'completed'
            };
            
            this.transactions.push(transaction);
            
            // Afeta demanda (aumenta)
            marketItem.demand += quantity * 0.05;
            
            console.log(`🌱 Comprado: ${quantity}x sementes de ${cropType} por $${totalCost.toFixed(2)}`);
            
            // Dispara eventos
            this.dispatchEvent('seedPurchased', { transaction });
            this.dispatchEvent('balanceUpdated', { 
                balance: this.playerWallet.balance,
                change: -totalCost
            });
            
            return transaction;
            
        } catch (error) {
            console.error('❌ Erro ao comprar sementes:', error);
            throw error;
        }
    }

    /**
     * Compra equipamentos
     */
    buyEquipment(equipmentData) {
        try {
            const { equipmentType, cost } = equipmentData;
            
            if (this.playerWallet.balance < cost) {
                throw new Error('Saldo insuficiente');
            }
            
            // Debita do saldo
            this.playerWallet.balance -= cost;
            
            // Registra transação
            const transaction = {
                id: this.generateTransactionId(),
                type: 'equipment',
                item: equipmentType,
                quantity: 1,
                totalCost: cost,
                timestamp: new Date(),
                status: 'completed'
            };
            
            this.transactions.push(transaction);
            
            console.log(`🚜 Comprado: ${equipmentType} por $${cost.toFixed(2)}`);
            
            // Dispara eventos
            this.dispatchEvent('equipmentPurchased', { transaction });
            this.dispatchEvent('balanceUpdated', { 
                balance: this.playerWallet.balance,
                change: -cost
            });
            
            return transaction;
            
        } catch (error) {
            console.error('❌ Erro ao comprar equipamento:', error);
            throw error;
        }
    }

    /**
     * Métodos auxiliares de cálculo
     */
    
    generateBasePrice(crop) {
        // Gera preço base baseado na categoria da cultura
        const basePrices = {
            grain: 2.5,
            vegetable: 3.0,
            fruit: 4.5,
            cash: 5.0
        };
        
        return basePrices[crop.category] || 3.0;
    }
    
    generateDemand() {
        return Math.random() * 100 + 50; // 50-150
    }
    
    generateSupply() {
        return Math.random() * 100 + 50; // 50-150
    }
    
    calculateDemand(cropName) {
        const baseItem = this.marketData.get(cropName);
        let demand = baseItem.demand;
        
        // Fatores que afetam demanda
        demand *= this.config.demandFactors.population;
        demand *= this.config.demandFactors.weather;
        demand *= this.config.demandFactors.events;
        
        // Adiciona variação aleatória
        demand *= (0.9 + Math.random() * 0.2);
        
        return Math.max(10, demand);
    }
    
    calculateSupply(cropName) {
        const baseItem = this.marketData.get(cropName);
        let supply = baseItem.supply;
        
        // Fatores sazonais
        supply *= this.getSeasonalMultiplier();
        
        // Adiciona variação aleatória
        supply *= (0.9 + Math.random() * 0.2);
        
        return Math.max(10, supply);
    }
    
    getSeasonalMultiplier() {
        // Obtém estação atual (pode vir de outro sistema)
        const currentSeason = window.gameInstance?.gameState?.time?.season || 'spring';
        return this.config.seasonalMultipliers[currentSeason] || 1.0;
    }
    
    calculateTrend(priceChangePercent) {
        if (priceChangePercent > 2) return 'rising';
        if (priceChangePercent < -2) return 'falling';
        return 'stable';
    }
    
    calculateMarketTrend() {
        let risingCount = 0;
        let fallingCount = 0;
        
        this.marketData.forEach(item => {
            if (item.trend === 'rising') risingCount++;
            if (item.trend === 'falling') fallingCount++;
        });
        
        if (risingCount > fallingCount * 1.5) return 'bullish';
        if (fallingCount > risingCount * 1.5) return 'bearish';
        return 'stable';
    }
    
    updatePriceHistory(cropName, price, volume) {
        if (!this.priceHistory.has(cropName)) {
            this.priceHistory.set(cropName, []);
        }
        
        const history = this.priceHistory.get(cropName);
        history.push({
            date: new Date(),
            price: price,
            volume: volume
        });
        
        // Mantém apenas últimos 100 registros
        if (history.length > 100) {
            history.shift();
        }
    }
    
    generateTransactionId() {
        return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Métodos de consulta e análise
     */
    
    getMarketData(cropName = null) {
        if (cropName) {
            return this.marketData.get(cropName);
        }
        return Array.from(this.marketData.values());
    }
    
    getPriceHistory(cropName, days = 30) {
        const history = this.priceHistory.get(cropName) || [];
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        return history.filter(entry => entry.date >= cutoffDate);
    }
    
    getMarketAnalysis(cropName) {
        const item = this.marketData.get(cropName);
        if (!item) return null;
        
        const history = this.getPriceHistory(cropName, 7);
        const avgPrice = history.reduce((sum, entry) => sum + entry.price, 0) / history.length;
        const priceVolatility = this.calculateVolatility(history);
        
        return {
            currentPrice: item.currentPrice,
            averagePrice: avgPrice,
            trend: item.trend,
            volatility: priceVolatility,
            recommendation: this.getTradeRecommendation(item, avgPrice),
            demandSupplyRatio: item.demand / item.supply,
            marketShare: item.dailyVolume / this.marketStats.totalVolume
        };
    }
    
    calculateVolatility(priceHistory) {
        if (priceHistory.length < 2) return 0;
        
        const prices = priceHistory.map(entry => entry.price);
        const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
        const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
        
        return Math.sqrt(variance) / mean;
    }
    
    getTradeRecommendation(item, avgPrice) {
        const currentPrice = item.currentPrice;
        const priceRatio = currentPrice / avgPrice;
        
        if (priceRatio > 1.1 && item.trend === 'rising') return 'strong_sell';
        if (priceRatio > 1.05) return 'sell';
        if (priceRatio < 0.9 && item.trend === 'falling') return 'strong_buy';
        if (priceRatio < 0.95) return 'buy';
        return 'hold';
    }
    
    getPlayerFinances() {
        const recentTransactions = this.transactions.slice(-10);
        const totalIncome = this.transactions
            .filter(t => t.type === 'sale')
            .reduce((sum, t) => sum + t.netValue, 0);
        const totalExpenses = this.transactions
            .filter(t => t.type === 'purchase' || t.type === 'equipment')
            .reduce((sum, t) => sum + t.totalCost, 0);
        
        return {
            balance: this.playerWallet.balance,
            currency: this.playerWallet.currency,
            creditLimit: this.playerWallet.creditLimit,
            totalIncome: totalIncome,
            totalExpenses: totalExpenses,
            netProfit: totalIncome - totalExpenses,
            recentTransactions: recentTransactions,
            transactionCount: this.transactions.length
        };
    }

    /**
     * Gerenciamento de dados
     */
    
    async loadEconomyData() {
        try {
            const savedData = localStorage.getItem('economySystemData');
            if (savedData) {
                const data = JSON.parse(savedData);
                
                // Restaura carteira
                if (data.playerWallet) {
                    this.playerWallet = { ...this.playerWallet, ...data.playerWallet };
                }
                
                // Restaura transações
                if (data.transactions) {
                    this.transactions = data.transactions;
                }
                
                // Restaura dados do mercado
                if (data.marketData) {
                    data.marketData.forEach(item => {
                        this.marketData.set(item.name, item);
                    });
                }
                
                // Restaura histórico de preços
                if (data.priceHistory) {
                    data.priceHistory.forEach(([cropName, history]) => {
                        this.priceHistory.set(cropName, history);
                    });
                }
                
                console.log(`💾 Carregados dados econômicos: $${this.playerWallet.balance}`);
            }
        } catch (error) {
            console.error('❌ Erro ao carregar dados econômicos:', error);
        }
    }
    
    saveEconomyData() {
        try {
            const dataToSave = {
                playerWallet: this.playerWallet,
                transactions: this.transactions,
                marketData: Array.from(this.marketData.values()),
                priceHistory: Array.from(this.priceHistory.entries()),
                marketStats: this.marketStats,
                lastSaved: new Date().toISOString()
            };
            
            localStorage.setItem('economySystemData', JSON.stringify(dataToSave));
            console.log('💾 Dados econômicos salvos');
            
        } catch (error) {
            console.error('❌ Erro ao salvar dados econômicos:', error);
        }
    }

    /**
     * Eventos personalizados
     */
    
    onTransactionCompleted(event) {
        console.log('💰 Evento: Transação concluída', event.detail);
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
        this.saveEconomyData();
        
        // Para atualizações automáticas
        if (this.marketUpdateTimer) {
            clearInterval(this.marketUpdateTimer);
        }
        
        // Remove event listeners
        document.removeEventListener('sellCrop', this.sellCrop);
        document.removeEventListener('buySeed', this.buySeed);
        document.removeEventListener('buyEquipment', this.buyEquipment);
        
        // Limpa dados
        this.marketData.clear();
        this.priceHistory.clear();
        this.transactions = [];
        this.isInitialized = false;
        
        console.log('🧹 Sistema Econômico destruído');
    }
}

// Exporta para uso global e módulos
if (typeof window !== 'undefined') {
    window.EconomySystem = EconomySystem;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = EconomySystem;
}