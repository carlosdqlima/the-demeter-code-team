/**
 * Utilitários e funções auxiliares para o NASA Farm Navigators
 * Contém funções reutilizáveis em todo o projeto
 */

const Utils = {
    
    // ===== UTILITÁRIOS MATEMÁTICOS =====
    
    /**
     * Gera número aleatório entre min e max
     * @param {number} min - Valor mínimo
     * @param {number} max - Valor máximo
     * @returns {number} Número aleatório
     */
    random(min, max) {
        return Math.random() * (max - min) + min;
    },
    
    /**
     * Gera número inteiro aleatório entre min e max
     * @param {number} min - Valor mínimo
     * @param {number} max - Valor máximo
     * @returns {number} Número inteiro aleatório
     */
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    /**
     * Limita um valor entre min e max
     * @param {number} value - Valor a ser limitado
     * @param {number} min - Valor mínimo
     * @param {number} max - Valor máximo
     * @returns {number} Valor limitado
     */
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },
    
    /**
     * Interpola linearmente entre dois valores
     * @param {number} a - Valor inicial
     * @param {number} b - Valor final
     * @param {number} t - Fator de interpolação (0-1)
     * @returns {number} Valor interpolado
     */
    lerp(a, b, t) {
        return a + (b - a) * t;
    },
    
    /**
     * Calcula distância entre dois pontos
     * @param {number} x1 - X do primeiro ponto
     * @param {number} y1 - Y do primeiro ponto
     * @param {number} x2 - X do segundo ponto
     * @param {number} y2 - Y do segundo ponto
     * @returns {number} Distância entre os pontos
     */
    distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    },
    
    // ===== UTILITÁRIOS DE FORMATAÇÃO =====
    
    /**
     * Formata número como moeda
     * @param {number} value - Valor a ser formatado
     * @param {string} currency - Símbolo da moeda
     * @returns {string} Valor formatado
     */
    formatCurrency(value, currency = '$') {
        if (value >= 1000000) {
            return `${currency}${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `${currency}${(value / 1000).toFixed(1)}K`;
        }
        return `${currency}${value.toLocaleString()}`;
    },
    
    /**
     * Formata número com sufixos (K, M, B)
     * @param {number} value - Valor a ser formatado
     * @returns {string} Valor formatado
     */
    formatNumber(value) {
        if (value >= 1000000000) {
            return `${(value / 1000000000).toFixed(1)}B`;
        } else if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}K`;
        }
        return value.toString();
    },
    
    /**
     * Formata porcentagem
     * @param {number} value - Valor decimal (0-1)
     * @param {number} decimals - Número de casas decimais
     * @returns {string} Porcentagem formatada
     */
    formatPercentage(value, decimals = 0) {
        return `${(value * 100).toFixed(decimals)}%`;
    },
    
    /**
     * Formata tempo em formato legível
     * @param {number} milliseconds - Tempo em milissegundos
     * @returns {string} Tempo formatado
     */
    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        }
        return `${seconds}s`;
    },
    
    // ===== UTILITÁRIOS DE TEMPO =====
    
    /**
     * Cria um delay usando Promise
     * @param {number} ms - Tempo em milissegundos
     * @returns {Promise} Promise que resolve após o delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    /**
     * Cria um debounce para função
     * @param {Function} func - Função a ser debounced
     * @param {number} wait - Tempo de espera em ms
     * @returns {Function} Função debounced
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * Cria um throttle para função
     * @param {Function} func - Função a ser throttled
     * @param {number} limit - Limite de tempo em ms
     * @returns {Function} Função throttled
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // ===== UTILITÁRIOS DE ARRAY =====
    
    /**
     * Embaralha array usando algoritmo Fisher-Yates
     * @param {Array} array - Array a ser embaralhado
     * @returns {Array} Array embaralhado
     */
    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },
    
    /**
     * Seleciona elemento aleatório do array
     * @param {Array} array - Array de origem
     * @returns {any} Elemento aleatório
     */
    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    },
    
    /**
     * Remove duplicatas de array
     * @param {Array} array - Array com possíveis duplicatas
     * @returns {Array} Array sem duplicatas
     */
    unique(array) {
        return [...new Set(array)];
    },
    
    // ===== UTILITÁRIOS DE OBJETO =====
    
    /**
     * Clona objeto profundamente
     * @param {Object} obj - Objeto a ser clonado
     * @returns {Object} Objeto clonado
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const cloned = {};
            Object.keys(obj).forEach(key => {
                cloned[key] = this.deepClone(obj[key]);
            });
            return cloned;
        }
    },
    
    /**
     * Mescla objetos profundamente
     * @param {Object} target - Objeto alvo
     * @param {Object} source - Objeto fonte
     * @returns {Object} Objeto mesclado
     */
    deepMerge(target, source) {
        const result = { ...target };
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.deepMerge(result[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
        return result;
    },
    
    // ===== UTILITÁRIOS DE VALIDAÇÃO =====
    
    /**
     * Verifica se valor é número válido
     * @param {any} value - Valor a ser verificado
     * @returns {boolean} True se for número válido
     */
    isValidNumber(value) {
        return typeof value === 'number' && !isNaN(value) && isFinite(value);
    },
    
    /**
     * Verifica se string é email válido
     * @param {string} email - Email a ser verificado
     * @returns {boolean} True se for email válido
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    /**
     * Verifica se coordenadas são válidas
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     * @returns {boolean} True se coordenadas são válidas
     */
    isValidCoordinates(lat, lng) {
        return this.isValidNumber(lat) && this.isValidNumber(lng) &&
               lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
    },
    
    // ===== UTILITÁRIOS DE STORAGE =====
    
    /**
     * Salva dados no localStorage
     * @param {string} key - Chave de armazenamento
     * @param {any} data - Dados a serem salvos
     * @returns {boolean} True se salvou com sucesso
     */
    saveToStorage(key, data) {
        try {
            const serialized = JSON.stringify(data);
            localStorage.setItem(key, serialized);
            return true;
        } catch (error) {
            console.error('Erro ao salvar no storage:', error);
            return false;
        }
    },
    
    /**
     * Carrega dados do localStorage
     * @param {string} key - Chave de armazenamento
     * @param {any} defaultValue - Valor padrão se não encontrar
     * @returns {any} Dados carregados ou valor padrão
     */
    loadFromStorage(key, defaultValue = null) {
        try {
            const serialized = localStorage.getItem(key);
            return serialized ? JSON.parse(serialized) : defaultValue;
        } catch (error) {
            console.error('Erro ao carregar do storage:', error);
            return defaultValue;
        }
    },
    
    /**
     * Remove dados do localStorage
     * @param {string} key - Chave a ser removida
     */
    removeFromStorage(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Erro ao remover do storage:', error);
        }
    },
    
    // ===== UTILITÁRIOS DE URL =====
    
    /**
     * Constrói URL com parâmetros
     * @param {string} baseUrl - URL base
     * @param {Object} params - Parâmetros a serem adicionados
     * @returns {string} URL completa
     */
    buildUrl(baseUrl, params = {}) {
        const url = new URL(baseUrl);
        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined) {
                url.searchParams.append(key, params[key]);
            }
        });
        return url.toString();
    },
    
    /**
     * Extrai parâmetros da URL atual
     * @returns {Object} Objeto com parâmetros da URL
     */
    getUrlParams() {
        const params = {};
        const urlParams = new URLSearchParams(window.location.search);
        for (const [key, value] of urlParams) {
            params[key] = value;
        }
        return params;
    },
    
    // ===== UTILITÁRIOS DE CLIMA =====
    
    /**
     * Converte Celsius para Fahrenheit
     * @param {number} celsius - Temperatura em Celsius
     * @returns {number} Temperatura em Fahrenheit
     */
    celsiusToFahrenheit(celsius) {
        return (celsius * 9/5) + 32;
    },
    
    /**
     * Converte Fahrenheit para Celsius
     * @param {number} fahrenheit - Temperatura em Fahrenheit
     * @returns {number} Temperatura em Celsius
     */
    fahrenheitToCelsius(fahrenheit) {
        return (fahrenheit - 32) * 5/9;
    },
    
    /**
     * Calcula índice de adequação climática para cultura
     * @param {Object} conditions - Condições atuais {temp, humidity, solar}
     * @param {Object} optimal - Condições ótimas {temp: [min,max], humidity: [min,max], solar: [min,max]}
     * @returns {number} Índice de 0 a 1 (1 = ideal)
     */
    calculateClimateIndex(conditions, optimal) {
        const tempScore = this.calculateRangeScore(conditions.temp, optimal.temp);
        const humidityScore = this.calculateRangeScore(conditions.humidity, optimal.humidity);
        const solarScore = this.calculateRangeScore(conditions.solar, optimal.solar);
        
        return (tempScore + humidityScore + solarScore) / 3;
    },
    
    /**
     * Calcula score baseado em faixa ideal
     * @param {number} value - Valor atual
     * @param {Array} range - Faixa ideal [min, max]
     * @returns {number} Score de 0 a 1
     */
    calculateRangeScore(value, range) {
        const [min, max] = range;
        if (value >= min && value <= max) return 1;
        
        const center = (min + max) / 2;
        const tolerance = (max - min) / 2;
        const distance = Math.abs(value - center);
        
        return Math.max(0, 1 - (distance / tolerance));
    },
    
    // ===== UTILITÁRIOS DE NOTIFICAÇÃO =====
    
    /**
     * Mostra notificação no jogo
     * @param {string} message - Mensagem da notificação
     * @param {string} type - Tipo: 'success', 'warning', 'error', 'info'
     * @param {number} duration - Duração em ms
     */
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type} show`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, duration);
    },
    
    /**
     * Retorna ícone para tipo de notificação
     * @param {string} type - Tipo da notificação
     * @returns {string} Nome do ícone
     */
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            warning: 'exclamation-triangle',
            error: 'times-circle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    },
    
    // ===== UTILITÁRIOS DE PERFORMANCE =====
    
    /**
     * Executa função no próximo frame
     * @param {Function} callback - Função a ser executada
     */
    nextFrame(callback) {
        requestAnimationFrame(callback);
    },
    
    /**
     * Mede tempo de execução de função
     * @param {Function} func - Função a ser medida
     * @param {string} label - Label para o log
     * @returns {any} Resultado da função
     */
    measurePerformance(func, label = 'Function') {
        const start = performance.now();
        const result = func();
        const end = performance.now();
        console.log(`${label} executou em ${(end - start).toFixed(2)}ms`);
        return result;
    }
};

// Exporta utilitários globalmente
if (typeof window !== 'undefined') {
    window.Utils = Utils;
}