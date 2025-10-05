/**
 * Modals - FarmVerse
 * Gerencia todas as janelas modais do jogo
 */

class Modals {
    constructor() {
        this.isInitialized = false;
        this.activeModals = new Map();
        this.modalQueue = [];
        this.modalHistory = [];
        
        // Configurações dos modais
        this.config = {
            animationDuration: 300,
            enableAnimations: true,
            closeOnOverlayClick: true,
            closeOnEscape: true,
            maxOpenModals: 3,
            queueModals: true,
            defaultSize: { width: 500, height: 400 }
        };
        
        // Tipos de modais disponíveis
        this.modalTypes = {
            confirm: 'Confirmação',
            alert: 'Alerta',
            prompt: 'Entrada',
            info: 'Informação',
            warning: 'Aviso',
            error: 'Erro',
            success: 'Sucesso',
            loading: 'Carregando',
            custom: 'Personalizado'
        };
        
        // Templates de modais
        this.modalTemplates = new Map();
        
        // Bind methods
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleOverlayClick = this.handleOverlayClick.bind(this);
    }

    /**
     * Inicializa o sistema de modais
     */
    async initialize() {
        try {
            console.log('🪟 Inicializando sistema de modais...');
            
            // Cria container principal
            this.createModalContainer();
            
            // Configura eventos globais
            this.setupGlobalEvents();
            
            // Carrega configurações salvas
            this.loadModalSettings();
            
            // Registra templates padrão
            this.registerDefaultTemplates();
            
            this.isInitialized = true;
            console.log('✅ Sistema de modais inicializado com sucesso');
            
            // Dispara evento de inicialização
            this.dispatchEvent('modalsInitialized', {
                templates: this.modalTemplates.size
            });
            
        } catch (error) {
            console.error('❌ Erro ao inicializar sistema de modais:', error);
            throw error;
        }
    }

    /**
     * Cria container principal dos modais
     */
    createModalContainer() {
        const container = document.createElement('div');
        container.id = 'modals-container';
        container.className = 'modals-container';
        
        document.body.appendChild(container);
        this.container = container;
        
        console.log('🪟 Container de modais criado');
    }

    /**
     * Configura eventos globais
     */
    setupGlobalEvents() {
        // Tecla ESC para fechar modais
        document.addEventListener('keydown', this.handleKeyPress);
        
        // Eventos do jogo
        document.addEventListener('showModal', (e) => this.showModal(e.detail));
        document.addEventListener('closeModal', (e) => this.closeModal(e.detail.id));
        document.addEventListener('closeAllModals', () => this.closeAllModals());
        
        console.log('🪟 Eventos globais configurados');
    }

    /**
     * Registra templates padrão
     */
    registerDefaultTemplates() {
        // Template de confirmação
        this.registerTemplate('confirm', {
            title: 'Confirmação',
            size: { width: 400, height: 200 },
            buttons: [
                { text: 'Cancelar', type: 'secondary', action: 'cancel' },
                { text: 'Confirmar', type: 'primary', action: 'confirm' }
            ],
            content: (data) => `
                <div class="modal-message">
                    <div class="message-icon">❓</div>
                    <div class="message-text">${data.message || 'Tem certeza?'}</div>
                </div>
            `
        });
        
        // Template de alerta
        this.registerTemplate('alert', {
            title: 'Alerta',
            size: { width: 400, height: 180 },
            buttons: [
                { text: 'OK', type: 'primary', action: 'ok' }
            ],
            content: (data) => `
                <div class="modal-message">
                    <div class="message-icon">⚠️</div>
                    <div class="message-text">${data.message || 'Atenção!'}</div>
                </div>
            `
        });
        
        // Template de erro
        this.registerTemplate('error', {
            title: 'Erro',
            size: { width: 450, height: 200 },
            buttons: [
                { text: 'OK', type: 'danger', action: 'ok' }
            ],
            content: (data) => `
                <div class="modal-message">
                    <div class="message-icon">❌</div>
                    <div class="message-text">${data.message || 'Ocorreu um erro!'}</div>
                    ${data.details ? `<div class="message-details">${data.details}</div>` : ''}
                </div>
            `
        });
        
        // Template de sucesso
        this.registerTemplate('success', {
            title: 'Sucesso',
            size: { width: 400, height: 180 },
            buttons: [
                { text: 'OK', type: 'success', action: 'ok' }
            ],
            content: (data) => `
                <div class="modal-message">
                    <div class="message-icon">✅</div>
                    <div class="message-text">${data.message || 'Operação realizada com sucesso!'}</div>
                </div>
            `
        });
        
        // Template de prompt
        this.registerTemplate('prompt', {
            title: 'Entrada de Dados',
            size: { width: 450, height: 250 },
            buttons: [
                { text: 'Cancelar', type: 'secondary', action: 'cancel' },
                { text: 'OK', type: 'primary', action: 'submit' }
            ],
            content: (data) => `
                <div class="modal-prompt">
                    <div class="prompt-message">${data.message || 'Digite o valor:'}</div>
                    <div class="prompt-input">
                        <input type="${data.inputType || 'text'}" 
                               id="prompt-input" 
                               placeholder="${data.placeholder || ''}"
                               value="${data.defaultValue || ''}"
                               ${data.required ? 'required' : ''}>
                    </div>
                    ${data.validation ? `<div class="prompt-validation">${data.validation}</div>` : ''}
                </div>
            `
        });
        
        // Template de loading
        this.registerTemplate('loading', {
            title: 'Carregando',
            size: { width: 300, height: 150 },
            closable: false,
            buttons: [],
            content: (data) => `
                <div class="modal-loading">
                    <div class="loading-spinner"></div>
                    <div class="loading-message">${data.message || 'Carregando...'}</div>
                    ${data.progress !== undefined ? `
                        <div class="loading-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${data.progress}%"></div>
                            </div>
                            <div class="progress-text">${Math.round(data.progress)}%</div>
                        </div>
                    ` : ''}
                </div>
            `
        });
        
        console.log('🪟 Templates padrão registrados');
    }

    /**
     * Registra um template de modal
     */
    registerTemplate(type, template) {
        this.modalTemplates.set(type, template);
        console.log(`🪟 Template registrado: ${type}`);
    }

    /**
     * Mostra um modal
     */
    showModal(options) {
        try {
            const modalId = this.generateModalId();
            
            // Verifica limite de modais abertos
            if (this.activeModals.size >= this.config.maxOpenModals) {
                if (this.config.queueModals) {
                    this.modalQueue.push({ id: modalId, options: options });
                    console.log(`🪟 Modal adicionado à fila: ${modalId}`);
                    return modalId;
                } else {
                    console.warn('⚠️ Limite de modais abertos atingido');
                    return null;
                }
            }
            
            // Cria elemento do modal
            const modalElement = this.createModalElement(modalId, options);
            
            // Adiciona ao container
            this.container.appendChild(modalElement);
            
            // Registra modal ativo
            this.activeModals.set(modalId, {
                element: modalElement,
                options: options,
                openedAt: Date.now(),
                promise: null,
                resolve: null,
                reject: null
            });
            
            // Cria promise para resultado
            let promiseResolve, promiseReject;
            const promise = new Promise((resolve, reject) => {
                promiseResolve = resolve;
                promiseReject = reject;
            });
            
            // Atualiza o modal com as funções de resolve/reject
            const modal = this.activeModals.get(modalId);
            modal.resolve = promiseResolve;
            modal.reject = promiseReject;
            modal.promise = promise;
            
            // Adiciona ao histórico
            this.addToHistory(modalId, options.type || 'custom');
            
            // Anima entrada
            if (this.config.enableAnimations) {
                this.animateModalIn(modalElement);
            }
            
            // Foca no modal
            this.focusModal(modalId);
            
            console.log(`🪟 Modal aberto: ${options.type || 'custom'} (${modalId})`);
            
            // Dispara evento
            this.dispatchEvent('modalOpened', { id: modalId, type: options.type, options: options });
            
            return promise;
            
        } catch (error) {
            console.error('❌ Erro ao abrir modal:', error);
            return null;
        }
    }

    /**
     * Fecha um modal
     */
    closeModal(modalId, result = null) {
        try {
            if (!this.activeModals.has(modalId)) {
                console.warn(`⚠️ Modal não encontrado: ${modalId}`);
                return false;
            }
            
            const modal = this.activeModals.get(modalId);
            
            // Resolve promise se existir
            if (modal.resolve) {
                modal.resolve(result);
            }
            
            // Anima saída
            if (this.config.enableAnimations) {
                this.animateModalOut(modal.element, () => {
                    this.removeModalElement(modalId, modal);
                });
            } else {
                this.removeModalElement(modalId, modal);
            }
            
            console.log(`🪟 Modal fechado: ${modalId}`);
            
            // Dispara evento
            this.dispatchEvent('modalClosed', { id: modalId, result: result });
            
            // Processa fila
            this.processModalQueue();
            
            return true;
            
        } catch (error) {
            console.error('❌ Erro ao fechar modal:', error);
            return false;
        }
    }

    /**
     * Fecha todos os modais
     */
    closeAllModals() {
        const modalIds = Array.from(this.activeModals.keys());
        
        modalIds.forEach(modalId => {
            this.closeModal(modalId);
        });
        
        // Limpa fila
        this.modalQueue = [];
        
        console.log('🪟 Todos os modais fechados');
    }

    /**
     * Cria elemento do modal
     */
    createModalElement(modalId, options) {
        const modal = document.createElement('div');
        modal.className = 'game-modal';
        modal.id = modalId;
        modal.setAttribute('data-modal-type', options.type || 'custom');
        
        // Overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        if (this.config.closeOnOverlayClick) {
            overlay.addEventListener('click', () => this.closeModal(modalId));
        }
        
        // Container do modal
        const container = document.createElement('div');
        container.className = 'modal-container';
        
        // Aplica template se especificado
        if (options.type && this.modalTemplates.has(options.type)) {
            const template = this.modalTemplates.get(options.type);
            this.applyTemplate(container, template, options, modalId);
        } else {
            this.createCustomModal(container, options, modalId);
        }
        
        modal.appendChild(overlay);
        modal.appendChild(container);
        
        return modal;
    }

    /**
     * Aplica template ao modal
     */
    applyTemplate(container, template, options, modalId) {
        // Define tamanho
        const size = options.size || template.size || this.config.defaultSize;
        container.style.width = `${size.width}px`;
        container.style.height = `${size.height}px`;
        
        // Cabeçalho
        const header = this.createModalHeader(
            options.title || template.title,
            template.closable !== false,
            modalId
        );
        container.appendChild(header);
        
        // Conteúdo
        const content = document.createElement('div');
        content.className = 'modal-content';
        
        if (typeof template.content === 'function') {
            content.innerHTML = template.content(options);
        } else {
            content.innerHTML = template.content || '';
        }
        
        container.appendChild(content);
        
        // Rodapé com botões
        if (template.buttons && template.buttons.length > 0) {
            const footer = this.createModalFooter(template.buttons, modalId, options);
            container.appendChild(footer);
        }
    }

    /**
     * Cria modal customizado
     */
    createCustomModal(container, options, modalId) {
        // Define tamanho
        const size = options.size || this.config.defaultSize;
        container.style.width = `${size.width}px`;
        container.style.height = `${size.height}px`;
        
        // Cabeçalho
        if (options.title) {
            const header = this.createModalHeader(options.title, options.closable !== false, modalId);
            container.appendChild(header);
        }
        
        // Conteúdo
        const content = document.createElement('div');
        content.className = 'modal-content';
        
        if (typeof options.content === 'function') {
            const contentResult = options.content(options, modalId);
            if (typeof contentResult === 'string') {
                content.innerHTML = contentResult;
            } else if (contentResult instanceof HTMLElement) {
                content.appendChild(contentResult);
            }
        } else if (typeof options.content === 'string') {
            content.innerHTML = options.content;
        } else if (options.content instanceof HTMLElement) {
            content.appendChild(options.content);
        }
        
        container.appendChild(content);
        
        // Rodapé com botões
        if (options.buttons && options.buttons.length > 0) {
            const footer = this.createModalFooter(options.buttons, modalId, options);
            container.appendChild(footer);
        }
    }

    /**
     * Cria cabeçalho do modal
     */
    createModalHeader(title, closable, modalId) {
        const header = document.createElement('div');
        header.className = 'modal-header';
        
        header.innerHTML = `
            <div class="modal-title">${title}</div>
            ${closable ? `<button class="modal-close" onclick="modals.closeModal('${modalId}')">×</button>` : ''}
        `;
        
        return header;
    }

    /**
     * Cria rodapé do modal
     */
    createModalFooter(buttons, modalId, options) {
        const footer = document.createElement('div');
        footer.className = 'modal-footer';
        
        const buttonsHtml = buttons.map(button => {
            const btnClass = `btn btn-${button.type || 'primary'}`;
            const btnAction = this.getButtonAction(button.action, modalId, options);
            
            return `<button class="${btnClass}" onclick="${btnAction}">${button.text}</button>`;
        }).join('');
        
        footer.innerHTML = buttonsHtml;
        
        return footer;
    }

    /**
     * Obtém ação do botão
     */
    getButtonAction(action, modalId, options) {
        switch (action) {
            case 'cancel':
                return `modals.closeModal('${modalId}', { action: 'cancel' })`;
            case 'confirm':
                return `modals.closeModal('${modalId}', { action: 'confirm' })`;
            case 'ok':
                return `modals.closeModal('${modalId}', { action: 'ok' })`;
            case 'submit':
                return `modals.submitPrompt('${modalId}')`;
            default:
                if (typeof action === 'string') {
                    return action.replace('{{modalId}}', modalId);
                }
                return `modals.closeModal('${modalId}', { action: '${action}' })`;
        }
    }

    /**
     * Submete prompt
     */
    submitPrompt(modalId) {
        const input = document.getElementById('prompt-input');
        if (input) {
            const value = input.value;
            this.closeModal(modalId, { action: 'submit', value: value });
        } else {
            this.closeModal(modalId, { action: 'submit', value: null });
        }
    }

    /**
     * Métodos de conveniência para tipos comuns
     */
    
    confirm(message, title = 'Confirmação') {
        return this.showModal({
            type: 'confirm',
            title: title,
            message: message
        });
    }
    
    alert(message, title = 'Alerta') {
        return this.showModal({
            type: 'alert',
            title: title,
            message: message
        });
    }
    
    error(message, details = null, title = 'Erro') {
        return this.showModal({
            type: 'error',
            title: title,
            message: message,
            details: details
        });
    }
    
    success(message, title = 'Sucesso') {
        return this.showModal({
            type: 'success',
            title: title,
            message: message
        });
    }
    
    prompt(message, defaultValue = '', title = 'Entrada de Dados') {
        return this.showModal({
            type: 'prompt',
            title: title,
            message: message,
            defaultValue: defaultValue
        });
    }
    
    loading(message = 'Carregando...', progress = null) {
        return this.showModal({
            type: 'loading',
            message: message,
            progress: progress
        });
    }

    /**
     * Atualiza modal de loading
     */
    updateLoading(modalId, message, progress = null) {
        const modal = this.activeModals.get(modalId);
        if (modal) {
            const messageElement = modal.element.querySelector('.loading-message');
            if (messageElement) {
                messageElement.textContent = message;
            }
            
            if (progress !== null) {
                const progressFill = modal.element.querySelector('.progress-fill');
                const progressText = modal.element.querySelector('.progress-text');
                
                if (progressFill) {
                    progressFill.style.width = `${progress}%`;
                }
                
                if (progressText) {
                    progressText.textContent = `${Math.round(progress)}%`;
                }
            }
        }
    }

    /**
     * Métodos auxiliares
     */
    
    generateModalId() {
        return `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    focusModal(modalId) {
        const modal = this.activeModals.get(modalId);
        if (modal) {
            modal.element.style.zIndex = this.getHighestZIndex() + 1;
            modal.element.classList.add('modal-focused');
            
            // Remove foco de outros modais
            this.activeModals.forEach((otherModal, otherId) => {
                if (otherId !== modalId) {
                    otherModal.element.classList.remove('modal-focused');
                }
            });
            
            // Foca no primeiro input se existir
            const firstInput = modal.element.querySelector('input, textarea, select');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }
    
    getHighestZIndex() {
        let highest = 2000;
        
        this.activeModals.forEach(modal => {
            const zIndex = parseInt(modal.element.style.zIndex) || 2000;
            if (zIndex > highest) {
                highest = zIndex;
            }
        });
        
        return highest;
    }
    
    addToHistory(modalId, type) {
        this.modalHistory.unshift({ id: modalId, type: type, timestamp: Date.now() });
        
        if (this.modalHistory.length > 20) {
            this.modalHistory = this.modalHistory.slice(0, 20);
        }
    }
    
    processModalQueue() {
        if (this.modalQueue.length > 0 && this.activeModals.size < this.config.maxOpenModals) {
            const next = this.modalQueue.shift();
            this.showModal(next.options);
        }
    }
    
    removeModalElement(modalId, modal) {
        // Remove do DOM
        if (modal.element.parentElement) {
            modal.element.parentElement.removeChild(modal.element);
        }
        
        // Remove do registro
        this.activeModals.delete(modalId);
    }
    
    animateModalIn(element) {
        const overlay = element.querySelector('.modal-overlay');
        const container = element.querySelector('.modal-container');
        
        // Overlay
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.transition = `opacity ${this.config.animationDuration}ms ease`;
            overlay.style.opacity = '1';
        }, 10);
        
        // Container
        container.style.opacity = '0';
        container.style.transform = 'scale(0.8) translateY(-50px)';
        
        setTimeout(() => {
            container.style.transition = `opacity ${this.config.animationDuration}ms ease, transform ${this.config.animationDuration}ms ease`;
            container.style.opacity = '1';
            container.style.transform = 'scale(1) translateY(0)';
        }, 10);
    }
    
    animateModalOut(element, callback) {
        const overlay = element.querySelector('.modal-overlay');
        const container = element.querySelector('.modal-container');
        
        // Overlay
        overlay.style.transition = `opacity ${this.config.animationDuration}ms ease`;
        overlay.style.opacity = '0';
        
        // Container
        container.style.transition = `opacity ${this.config.animationDuration}ms ease, transform ${this.config.animationDuration}ms ease`;
        container.style.opacity = '0';
        container.style.transform = 'scale(0.8) translateY(-50px)';
        
        setTimeout(callback, this.config.animationDuration);
    }

    /**
     * Eventos
     */
    
    handleKeyPress(event) {
        if (event.key === 'Escape' && this.config.closeOnEscape) {
            // Fecha o modal mais recente
            const modalIds = Array.from(this.activeModals.keys());
            if (modalIds.length > 0) {
                const latestModalId = modalIds[modalIds.length - 1];
                this.closeModal(latestModalId, { action: 'escape' });
            }
        }
    }
    
    handleOverlayClick(event) {
        if (this.config.closeOnOverlayClick && event.target.classList.contains('modal-overlay')) {
            const modal = event.target.closest('.game-modal');
            if (modal) {
                this.closeModal(modal.id, { action: 'overlay' });
            }
        }
    }
    
    dispatchEvent(eventName, data = {}) {
        const event = new CustomEvent(eventName, { detail: data });
        document.dispatchEvent(event);
    }

    /**
     * Gerenciamento de dados
     */
    
    loadModalSettings() {
        try {
            const savedSettings = localStorage.getItem('modalSettings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                this.config = { ...this.config, ...settings };
                
                console.log('💾 Configurações dos modais carregadas');
            }
        } catch (error) {
            console.error('❌ Erro ao carregar configurações dos modais:', error);
        }
    }
    
    saveModalSettings() {
        try {
            localStorage.setItem('modalSettings', JSON.stringify(this.config));
            console.log('💾 Configurações dos modais salvas');
        } catch (error) {
            console.error('❌ Erro ao salvar configurações dos modais:', error);
        }
    }

    /**
     * Limpeza e destruição
     */
    
    destroy() {
        // Salva configurações
        this.saveModalSettings();
        
        // Fecha todos os modais
        this.closeAllModals();
        
        // Remove container
        if (this.container && this.container.parentElement) {
            this.container.parentElement.removeChild(this.container);
        }
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyPress);
        
        // Limpa dados
        this.activeModals.clear();
        this.modalTemplates.clear();
        this.modalQueue = [];
        this.modalHistory = [];
        this.isInitialized = false;
        
        console.log('🧹 Sistema de modais destruído');
    }
}

// Exporta para uso global e módulos
if (typeof window !== 'undefined') {
    window.Modals = Modals;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Modals;
}