/**
 * Sistema de Indicadores de Problemas - FarmVerse
 * Monitora e exibe problemas agrícolas baseados em dados da NASA
 */

class ProblemIndicatorSystem {
    constructor() {
        this.problems = {
            drought: {
                id: 'drought',
                name: 'Seca',
                icon: '🌵',
                active: false,
                severity: 0, // 0-100
                description: 'Baixa umidade do solo detectada',
                nasaData: 'SMAP Soil Moisture',
                threshold: 30,
                solutions: [
                    'Implementar irrigação por gotejamento',
                    'Usar culturas resistentes à seca',
                    'Aplicar cobertura morta no solo'
                ]
            },
            pest: {
                id: 'pest',
                name: 'Pragas',
                icon: '🐛',
                active: false,
                severity: 0,
                description: 'Atividade de pragas detectada nas culturas',
                nasaData: 'MODIS Vegetation Health',
                threshold: 40,
                solutions: [
                    'Aplicar controle biológico',
                    'Usar armadilhas para pragas',
                    'Implementar rotação de culturas'
                ]
            },
            disease: {
                id: 'disease',
                name: 'Doenças',
                icon: '🦠',
                active: false,
                severity: 0,
                description: 'Sinais de doenças nas plantas detectados',
                nasaData: 'Landsat Spectral Analysis',
                threshold: 35,
                solutions: [
                    'Aplicar fungicidas orgânicos',
                    'Melhorar ventilação das culturas',
                    'Remover plantas infectadas'
                ]
            },
            weather: {
                id: 'weather',
                name: 'Clima Extremo',
                icon: '⛈️',
                active: false,
                severity: 0,
                description: 'Condições climáticas adversas previstas',
                nasaData: 'GPM Precipitation Data',
                threshold: 50,
                solutions: [
                    'Proteger culturas com estufas',
                    'Implementar drenagem adequada',
                    'Usar variedades resistentes ao clima'
                ]
            }
        };

        this.updateInterval = null;
        this.init();
    }

    /**
     * Inicializa o sistema de indicadores
     */
    init() {
        this.bindEvents();
        this.startMonitoring();
        this.createProblemPopup();
    }

    /**
     * Vincula eventos aos indicadores
     */
    bindEvents() {
        Object.keys(this.problems).forEach(problemId => {
            const indicator = document.getElementById(`${problemId}-indicator`);
            if (indicator) {
                indicator.addEventListener('click', () => {
                    this.showProblemDetails(problemId);
                });
            }
        });
    }

    /**
     * Cria o popup de detalhes dos problemas
     */
    createProblemPopup() {
        const popup = document.createElement('div');
        popup.id = 'problem-popup';
        popup.className = 'problem-popup hidden';
        popup.innerHTML = `
            <div class="problem-content">
                <div class="problem-header">
                    <h2 id="problem-title">Detalhes do Problema</h2>
                    <button class="close-btn" id="close-problem">&times;</button>
                </div>
                
                <div class="problem-info">
                    <div class="problem-icon-large" id="problem-icon-large">🌵</div>
                    <div class="problem-details">
                        <h3 id="problem-name">Nome do Problema</h3>
                        <p id="problem-description">Descrição do problema</p>
                        
                        <div class="severity-meter">
                            <label>Severidade:</label>
                            <div class="severity-bar">
                                <div class="severity-fill" id="severity-fill"></div>
                            </div>
                            <span id="severity-text">0%</span>
                        </div>
                        
                        <div class="nasa-source">
                            <strong>Fonte NASA:</strong> <span id="nasa-source-text"></span>
                        </div>
                    </div>
                </div>
                
                <div class="solutions-section">
                    <h4>Soluções Recomendadas:</h4>
                    <ul id="solutions-list">
                        <!-- Soluções serão inseridas dinamicamente -->
                    </ul>
                </div>
                
                <div class="action-buttons">
                    <button class="action-btn primary" id="implement-solution">
                        Implementar Solução
                    </button>
                    <button class="action-btn secondary" id="monitor-problem">
                        Continuar Monitorando
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);

        // Vincular eventos do popup
        const closeBtn = document.getElementById('close-problem');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeProblemPopup());
        }

        const popup_element = document.getElementById('problem-popup');
        if (popup_element) {
            popup_element.addEventListener('click', (e) => {
                if (e.target === popup_element) {
                    this.closeProblemPopup();
                }
            });
        }
    }

    /**
     * Inicia o monitoramento automático dos problemas
     */
    startMonitoring() {
        // Atualizar indicadores a cada 10 segundos
        this.updateInterval = setInterval(() => {
            this.updateProblems();
        }, 10000);

        // Primeira atualização imediata
        this.updateProblems();
    }

    /**
     * Atualiza o status dos problemas baseado em dados simulados da NASA
     */
    updateProblems() {
        // Simular dados da NASA (em uma implementação real, viria da API)
        const nasaData = this.simulateNASAData();

        Object.keys(this.problems).forEach(problemId => {
            const problem = this.problems[problemId];
            const dataValue = nasaData[problemId] || 0;

            // Determinar se o problema está ativo baseado no threshold
            const wasActive = problem.active;
            problem.active = dataValue > problem.threshold;
            problem.severity = Math.min(100, Math.max(0, dataValue));

            // Atualizar indicador visual
            this.updateIndicatorVisual(problemId, problem);

            // Notificar se um novo problema foi detectado
            if (!wasActive && problem.active) {
                this.notifyNewProblem(problem);
            }
        });
    }

    /**
     * Simula dados da NASA para demonstração
     */
    simulateNASAData() {
        return {
            drought: Math.random() * 100,
            pest: Math.random() * 80,
            disease: Math.random() * 70,
            weather: Math.random() * 90
        };
    }

    /**
     * Atualiza a aparência visual do indicador
     */
    updateIndicatorVisual(problemId, problem) {
        const indicator = document.getElementById(`${problemId}-indicator`);
        if (!indicator) return;

        if (problem.active) {
            indicator.classList.remove('inactive');
            indicator.classList.add('active');
            
            // Adicionar animação baseada na severidade
            if (problem.severity > 70) {
                indicator.classList.add('critical');
            } else {
                indicator.classList.remove('critical');
            }
        } else {
            indicator.classList.add('inactive');
            indicator.classList.remove('active', 'critical');
        }

        // Atualizar tooltip
        indicator.title = `${problem.name} - Severidade: ${Math.round(problem.severity)}%`;
    }

    /**
     * Exibe detalhes de um problema específico
     */
    showProblemDetails(problemId) {
        const problem = this.problems[problemId];
        if (!problem) return;

        // Atualizar conteúdo do popup
        document.getElementById('problem-title').textContent = `Problema: ${problem.name}`;
        document.getElementById('problem-icon-large').textContent = problem.icon;
        document.getElementById('problem-name').textContent = problem.name;
        document.getElementById('problem-description').textContent = problem.description;
        document.getElementById('nasa-source-text').textContent = problem.nasaData;

        // Atualizar medidor de severidade
        const severityFill = document.getElementById('severity-fill');
        const severityText = document.getElementById('severity-text');
        if (severityFill && severityText) {
            severityFill.style.width = `${problem.severity}%`;
            severityText.textContent = `${Math.round(problem.severity)}%`;
            
            // Cor baseada na severidade
            if (problem.severity > 70) {
                severityFill.style.background = '#ff4444';
            } else if (problem.severity > 40) {
                severityFill.style.background = '#ffaa00';
            } else {
                severityFill.style.background = '#44ff44';
            }
        }

        // Atualizar lista de soluções
        const solutionsList = document.getElementById('solutions-list');
        if (solutionsList) {
            solutionsList.innerHTML = '';
            problem.solutions.forEach(solution => {
                const li = document.createElement('li');
                li.textContent = solution;
                solutionsList.appendChild(li);
            });
        }

        // Mostrar popup
        const popup = document.getElementById('problem-popup');
        if (popup) {
            popup.classList.remove('hidden');
        }
    }

    /**
     * Fecha o popup de detalhes
     */
    closeProblemPopup() {
        const popup = document.getElementById('problem-popup');
        if (popup) {
            popup.classList.add('hidden');
        }
    }

    /**
     * Notifica sobre um novo problema detectado
     */
    notifyNewProblem(problem) {
        // Atualizar mensagem de status
        const statusMessage = document.getElementById('status-message');
        if (statusMessage) {
            const p = statusMessage.querySelector('p');
            if (p) {
                p.textContent = `⚠️ Novo problema detectado: ${problem.name}! Clique no indicador para mais detalhes.`;
                
                // Remover a notificação após 5 segundos
                setTimeout(() => {
                    p.textContent = 'Mantenha os olhos abertos para problemas em sua fazenda e não deixe que saiam de controle! Pode haver ferramentas em sua árvore de tecnologia que poderiam ajudar a combater alguns desses desafios.';
                }, 5000);
            }
        }
    }

    /**
     * Obtém o status atual de todos os problemas
     */
    getProblemsStatus() {
        return Object.keys(this.problems).map(id => ({
            id,
            ...this.problems[id]
        }));
    }

    /**
     * Resolve um problema (simula implementação de solução)
     */
    resolveProblem(problemId) {
        const problem = this.problems[problemId];
        if (problem) {
            problem.active = false;
            problem.severity = 0;
            this.updateIndicatorVisual(problemId, problem);
            this.closeProblemPopup();
            
            // Notificar resolução
            const statusMessage = document.getElementById('status-message');
            if (statusMessage) {
                const p = statusMessage.querySelector('p');
                if (p) {
                    p.textContent = `✅ Problema ${problem.name} foi resolvido com sucesso!`;
                    setTimeout(() => {
                        p.textContent = 'Mantenha os olhos abertos para problemas em sua fazenda e não deixe que saiam de controle! Pode haver ferramentas em sua árvore de tecnologia que poderiam ajudar a combater alguns desses desafios.';
                    }, 3000);
                }
            }
        }
    }

    /**
     * Para o monitoramento
     */
    stopMonitoring() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
}

// Inicializar o sistema quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.problemIndicatorSystem = new ProblemIndicatorSystem();
});