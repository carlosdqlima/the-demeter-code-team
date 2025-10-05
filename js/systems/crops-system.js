/**
 * Sistema de Culturas - NASA Farm Navigators
 * Gerencia informações sobre diferentes tipos de culturas e suas características
 */

class CropsSystem {
    constructor() {
        this.selectedCrop = 'wheat';
        this.cropsData = this.initializeCropsData();
        this.isOpen = false;
        this.init();
    }

    /**
     * Inicializa os dados das culturas com informações detalhadas
     */
    initializeCropsData() {
        return {
            wheat: {
                id: 'wheat',
                name: 'Trigo',
                icon: '🌾',
                category: 'Cereais',
                growthTime: 120, // dias
                waterRequirement: 'Médio',
                soilType: 'Argiloso/Franco',
                climate: 'Temperado',
                yield: '3-5 ton/ha',
                price: '$250/ton',
                description: 'Cereal básico para alimentação humana, usado principalmente para produção de farinha.',
                nasaData: {
                    optimalNDVI: '0.6-0.8',
                    soilMoisture: '25-35%',
                    temperature: '15-25°C'
                },
                advantages: [
                    'Alta demanda global',
                    'Resistente a variações climáticas',
                    'Múltiplos usos industriais'
                ],
                challenges: [
                    'Suscetível a fungos',
                    'Requer rotação de culturas',
                    'Sensível ao excesso de umidade'
                ],
                sustainability: {
                    carbonFootprint: 'Baixo',
                    waterEfficiency: 'Médio',
                    soilHealth: 'Neutro'
                }
            },
            corn: {
                id: 'corn',
                name: 'Milho',
                icon: '🌽',
                category: 'Cereais',
                growthTime: 100,
                waterRequirement: 'Alto',
                soilType: 'Franco/Arenoso',
                climate: 'Tropical/Subtropical',
                yield: '8-12 ton/ha',
                price: '$180/ton',
                description: 'Cereal versátil usado para alimentação humana, animal e produção de biocombustíveis.',
                nasaData: {
                    optimalNDVI: '0.7-0.9',
                    soilMoisture: '30-40%',
                    temperature: '20-30°C'
                },
                advantages: [
                    'Alto rendimento por hectare',
                    'Múltiplas aplicações',
                    'Crescimento rápido'
                ],
                challenges: [
                    'Alto consumo de água',
                    'Suscetível a pragas',
                    'Requer fertilização intensa'
                ],
                sustainability: {
                    carbonFootprint: 'Médio',
                    waterEfficiency: 'Baixo',
                    soilHealth: 'Negativo'
                }
            },
            soy: {
                id: 'soy',
                name: 'Soja',
                icon: '🫘',
                category: 'Leguminosas',
                growthTime: 110,
                waterRequirement: 'Médio',
                soilType: 'Franco/Argiloso',
                climate: 'Tropical/Subtropical',
                yield: '2-4 ton/ha',
                price: '$320/ton',
                description: 'Leguminosa rica em proteínas, essencial para alimentação animal e humana.',
                nasaData: {
                    optimalNDVI: '0.6-0.8',
                    soilMoisture: '25-35%',
                    temperature: '20-28°C'
                },
                advantages: [
                    'Fixa nitrogênio no solo',
                    'Alto valor proteico',
                    'Mercado global estável'
                ],
                challenges: [
                    'Sensível a doenças fúngicas',
                    'Requer manejo cuidadoso',
                    'Competição com outras culturas'
                ],
                sustainability: {
                    carbonFootprint: 'Baixo',
                    waterEfficiency: 'Alto',
                    soilHealth: 'Positivo'
                }
            },
            rice: {
                id: 'rice',
                name: 'Arroz',
                icon: '🌾',
                category: 'Cereais',
                growthTime: 130,
                waterRequirement: 'Muito Alto',
                soilType: 'Argiloso',
                climate: 'Tropical/Subtropical',
                yield: '6-8 ton/ha',
                price: '$400/ton',
                description: 'Cereal básico que alimenta mais da metade da população mundial.',
                nasaData: {
                    optimalNDVI: '0.5-0.7',
                    soilMoisture: '80-100%',
                    temperature: '22-32°C'
                },
                advantages: [
                    'Alimento básico global',
                    'Alto valor nutricional',
                    'Adaptado a solos alagados'
                ],
                challenges: [
                    'Extremo consumo de água',
                    'Emissões de metano',
                    'Trabalho intensivo'
                ],
                sustainability: {
                    carbonFootprint: 'Alto',
                    waterEfficiency: 'Muito Baixo',
                    soilHealth: 'Neutro'
                }
            },
            cotton: {
                id: 'cotton',
                name: 'Algodão',
                icon: '☁️',
                category: 'Fibras',
                growthTime: 180,
                waterRequirement: 'Alto',
                soilType: 'Franco/Arenoso',
                climate: 'Subtropical',
                yield: '1-2 ton/ha',
                price: '$1500/ton',
                description: 'Fibra natural essencial para a indústria têxtil mundial.',
                nasaData: {
                    optimalNDVI: '0.6-0.8',
                    soilMoisture: '25-40%',
                    temperature: '18-30°C'
                },
                advantages: [
                    'Alto valor comercial',
                    'Demanda constante',
                    'Subprodutos úteis'
                ],
                challenges: [
                    'Intensivo em pesticidas',
                    'Alto consumo de água',
                    'Ciclo longo de crescimento'
                ],
                sustainability: {
                    carbonFootprint: 'Alto',
                    waterEfficiency: 'Baixo',
                    soilHealth: 'Negativo'
                }
            },
            vegetables: {
                id: 'vegetables',
                name: 'Vegetais',
                icon: '🥬',
                category: 'Hortaliças',
                growthTime: 60,
                waterRequirement: 'Médio',
                soilType: 'Franco/Rico em matéria orgânica',
                climate: 'Variado',
                yield: '15-25 ton/ha',
                price: '$800/ton',
                description: 'Diversas hortaliças essenciais para alimentação saudável e equilibrada.',
                nasaData: {
                    optimalNDVI: '0.4-0.7',
                    soilMoisture: '30-45%',
                    temperature: '15-25°C'
                },
                advantages: [
                    'Ciclo curto',
                    'Alto valor nutricional',
                    'Diversificação de renda'
                ],
                challenges: [
                    'Perecibilidade alta',
                    'Manejo intensivo',
                    'Suscetível a pragas'
                ],
                sustainability: {
                    carbonFootprint: 'Baixo',
                    waterEfficiency: 'Médio',
                    soilHealth: 'Positivo'
                }
            }
        };
    }

    /**
     * Inicializa o sistema de culturas
     */
    init() {
        this.createCropsPopup();
        this.bindEvents();
    }

    /**
     * Cria o popup de informações das culturas
     */
    createCropsPopup() {
        const popup = document.createElement('div');
        popup.id = 'crops-popup';
        popup.className = 'crops-popup hidden';
        popup.innerHTML = `
            <div class="crops-content">
                <div class="crops-header">
                    <h2>Informações das Culturas</h2>
                    <button class="close-btn" id="close-crops">&times;</button>
                </div>
                
                <div class="crops-selector">
                    <div class="crop-tabs" id="crop-tabs">
                        ${Object.values(this.cropsData).map(crop => `
                            <button class="crop-tab ${crop.id === this.selectedCrop ? 'active' : ''}" 
                                    data-crop="${crop.id}">
                                <span class="crop-tab-icon">${crop.icon}</span>
                                <span class="crop-tab-name">${crop.name}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="crop-details" id="crop-details">
                    <!-- Detalhes serão inseridos dinamicamente -->
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
    }

    /**
     * Vincula eventos aos elementos
     */
    bindEvents() {
        // Botão para abrir popup de culturas
        const cropsBtn = document.getElementById('crops-btn');
        if (cropsBtn) {
            cropsBtn.addEventListener('click', () => this.openCropsPopup());
        }

        // Botão para fechar popup
        const closeBtn = document.getElementById('close-crops');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeCropsPopup());
        }

        // Fechar ao clicar fora do popup
        const popup = document.getElementById('crops-popup');
        if (popup) {
            popup.addEventListener('click', (e) => {
                if (e.target === popup) {
                    this.closeCropsPopup();
                }
            });
        }

        // Tabs de culturas
        document.addEventListener('click', (e) => {
            if (e.target.closest('.crop-tab')) {
                const cropId = e.target.closest('.crop-tab').dataset.crop;
                this.selectCrop(cropId);
            }
        });

        // Fechar com tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeCropsPopup();
            }
        });
    }

    /**
     * Abre o popup de culturas
     */
    openCropsPopup() {
        const popup = document.getElementById('crops-popup');
        if (popup) {
            popup.classList.remove('hidden');
            this.isOpen = true;
            this.updateCropDetails();
        }
    }

    /**
     * Fecha o popup de culturas
     */
    closeCropsPopup() {
        const popup = document.getElementById('crops-popup');
        if (popup) {
            popup.classList.add('hidden');
            this.isOpen = false;
        }
    }

    /**
     * Seleciona uma cultura específica
     */
    selectCrop(cropId) {
        if (this.cropsData[cropId]) {
            this.selectedCrop = cropId;
            this.updateCropTabs();
            this.updateCropDetails();
        }
    }

    /**
     * Atualiza as abas de culturas
     */
    updateCropTabs() {
        const tabs = document.querySelectorAll('.crop-tab');
        tabs.forEach(tab => {
            if (tab.dataset.crop === this.selectedCrop) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }

    /**
     * Atualiza os detalhes da cultura selecionada
     */
    updateCropDetails() {
        const crop = this.cropsData[this.selectedCrop];
        if (!crop) return;

        const detailsContainer = document.getElementById('crop-details');
        if (!detailsContainer) return;

        detailsContainer.innerHTML = `
            <div class="crop-overview">
                <div class="crop-icon-large">${crop.icon}</div>
                <div class="crop-basic-info">
                    <h3>${crop.name}</h3>
                    <span class="crop-category">${crop.category}</span>
                    <p class="crop-description">${crop.description}</p>
                </div>
            </div>
            
            <div class="crop-stats">
                <div class="stat-grid">
                    <div class="stat-item">
                        <span class="stat-label">Tempo de Crescimento</span>
                        <span class="stat-value">${crop.growthTime} dias</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Necessidade de Água</span>
                        <span class="stat-value">${crop.waterRequirement}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Tipo de Solo</span>
                        <span class="stat-value">${crop.soilType}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Clima</span>
                        <span class="stat-value">${crop.climate}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Rendimento</span>
                        <span class="stat-value">${crop.yield}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Preço</span>
                        <span class="stat-value">${crop.price}</span>
                    </div>
                </div>
            </div>
            
            <div class="nasa-requirements">
                <h4>📡 Parâmetros NASA Ideais</h4>
                <div class="nasa-params">
                    <div class="param-item">
                        <span class="param-label">NDVI Ótimo:</span>
                        <span class="param-value">${crop.nasaData.optimalNDVI}</span>
                    </div>
                    <div class="param-item">
                        <span class="param-label">Umidade do Solo:</span>
                        <span class="param-value">${crop.nasaData.soilMoisture}</span>
                    </div>
                    <div class="param-item">
                        <span class="param-label">Temperatura:</span>
                        <span class="param-value">${crop.nasaData.temperature}</span>
                    </div>
                </div>
            </div>
            
            <div class="crop-analysis">
                <div class="advantages-section">
                    <h4>✅ Vantagens</h4>
                    <ul>
                        ${crop.advantages.map(advantage => `<li>${advantage}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="challenges-section">
                    <h4>⚠️ Desafios</h4>
                    <ul>
                        ${crop.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="sustainability-metrics">
                <h4>🌱 Métricas de Sustentabilidade</h4>
                <div class="sustainability-grid">
                    <div class="sustainability-item">
                        <span class="sustainability-label">Pegada de Carbono</span>
                        <span class="sustainability-value ${this.getSustainabilityClass(crop.sustainability.carbonFootprint)}">${crop.sustainability.carbonFootprint}</span>
                    </div>
                    <div class="sustainability-item">
                        <span class="sustainability-label">Eficiência Hídrica</span>
                        <span class="sustainability-value ${this.getSustainabilityClass(crop.sustainability.waterEfficiency)}">${crop.sustainability.waterEfficiency}</span>
                    </div>
                    <div class="sustainability-item">
                        <span class="sustainability-label">Saúde do Solo</span>
                        <span class="sustainability-value ${this.getSustainabilityClass(crop.sustainability.soilHealth)}">${crop.sustainability.soilHealth}</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Obtém a classe CSS baseada no valor de sustentabilidade
     */
    getSustainabilityClass(value) {
        const lowerValue = value.toLowerCase();
        if (lowerValue.includes('alto') || lowerValue.includes('positivo')) {
            return 'sustainability-good';
        } else if (lowerValue.includes('baixo') || lowerValue.includes('negativo')) {
            return 'sustainability-bad';
        } else {
            return 'sustainability-neutral';
        }
    }

    /**
     * Obtém informações de uma cultura específica
     */
    getCropInfo(cropId) {
        return this.cropsData[cropId] || null;
    }

    /**
     * Obtém todas as culturas disponíveis
     */
    getAllCrops() {
        return Object.values(this.cropsData);
    }

    /**
     * Filtra culturas por categoria
     */
    getCropsByCategory(category) {
        return Object.values(this.cropsData).filter(crop => crop.category === category);
    }

    /**
     * Obtém culturas recomendadas baseadas em condições
     */
    getRecommendedCrops(conditions) {
        // Lógica para recomendar culturas baseada em condições climáticas e do solo
        return Object.values(this.cropsData).filter(crop => {
            // Implementar lógica de recomendação baseada em conditions
            return true; // Placeholder
        });
    }
}

// Inicializar o sistema quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.cropsSystem = new CropsSystem();
});