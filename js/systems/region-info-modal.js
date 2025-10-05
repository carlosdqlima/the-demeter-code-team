/**
 * Sistema de Modal de Informações da Região
 * Gerencia a exibição de informações detalhadas sobre regiões antes da seleção
 */
class RegionInfoModal {
    constructor() {
        this.modal = null;
        this.currentRegion = null;
        this.isVisible = false;
        this.init();
    }

    /**
     * Inicializa o sistema do modal
     */
    init() {
        this.modal = document.getElementById('region-info-modal');
        this.setupEventListeners();
    }

    /**
     * Configura os event listeners do modal
     */
    setupEventListeners() {
        // Fechar modal ao clicar no overlay
        const overlay = this.modal.querySelector('.modal-overlay');
        overlay.addEventListener('click', () => this.hide());

        // Fechar modal ao clicar no botão X
        const closeBtn = this.modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => this.hide());

        // Botão cancelar
        const cancelBtn = this.modal.querySelector('.btn-secondary');
        cancelBtn.addEventListener('click', () => this.hide());

        // Botão confirmar seleção
        const confirmBtn = this.modal.querySelector('.btn-primary');
        confirmBtn.addEventListener('click', () => this.confirmSelection());

        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
    }

    /**
     * Exibe o modal com informações da região
     * @param {Object} regionData - Dados da região
     */
    show(regionData) {
        this.currentRegion = regionData;
        this.populateModal(regionData);
        this.modal.classList.add('active');
        this.isVisible = true;
        document.body.style.overflow = 'hidden';
    }

    /**
     * Oculta o modal
     */
    hide() {
        this.modal.classList.remove('active');
        this.isVisible = false;
        this.currentRegion = null;
        document.body.style.overflow = '';
    }

    /**
     * Confirma a seleção da região e direciona para a fazenda
     */
    confirmSelection() {
        if (this.currentRegion) {
            console.log('Confirmando seleção da região:', this.currentRegion);
            // Dispara evento de seleção confirmada
            const event = new CustomEvent('regionConfirmed', {
                detail: { region: this.currentRegion }
            });
            document.dispatchEvent(event);
            
            this.hide();
        }
    }

    /**
     * Popula o modal com dados da região
     * @param {Object} regionData - Dados da região
     */
    populateModal(regionData) {
        // Título da região
        const title = this.modal.querySelector('.modal-header h2');
        title.textContent = regionData.name || 'Região Desconhecida';

        // Informações básicas
        this.populateBasicInfo(regionData);
        
        // Informações climáticas
        this.populateClimateInfo(regionData);
        
        // Especialidades agrícolas
        this.populateSpecialties(regionData);
        
        // Bônus regional
        this.populateBonus(regionData);
        
        // Dados da NASA
        this.populateNASAData(regionData);
    }

    /**
     * Popula informações básicas da região
     * @param {Object} regionData - Dados da região
     */
    populateBasicInfo(regionData) {
        const regionName = this.modal.querySelector('.region-basic-info h3');
        const regionDesc = this.modal.querySelector('.region-basic-info p');
        const regionIcon = this.modal.querySelector('.region-icon');

        regionName.textContent = regionData.name || 'Região Desconhecida';
        regionDesc.textContent = regionData.description || 'Uma região rica em oportunidades agrícolas com características únicas para o cultivo sustentável.';
        
        // Define ícone baseado no tipo de região
        const icons = {
            'tropical': '🌴',
            'temperate': '🌾',
            'arid': '🌵',
            'continental': '🏔️',
            'mediterranean': '🫒',
            'default': '🌍'
        };
        
        regionIcon.textContent = icons[regionData.climate?.type] || icons.default;
    }

    /**
     * Popula informações climáticas
     * @param {Object} regionData - Dados da região
     */
    populateClimateInfo(regionData) {
        const climateTag = this.modal.querySelector('.climate-tag');
        const climateStats = this.modal.querySelector('.climate-stats');

        // Tag do clima
        const climateTypes = {
            'tropical': 'Tropical',
            'temperate': 'Temperado',
            'arid': 'Árido',
            'continental': 'Continental',
            'mediterranean': 'Mediterrâneo'
        };
        
        climateTag.textContent = climateTypes[regionData.climate?.type] || 'Temperado';

        // Estatísticas climáticas
        const climate = regionData.climate || {};
        const stats = [
            { label: 'Temperatura Média', value: `${climate.avgTemp || 22}°C` },
            { label: 'Precipitação Anual', value: `${climate.rainfall || 800}mm` },
            { label: 'Umidade', value: `${climate.humidity || 65}%` },
            { label: 'Estação de Cultivo', value: climate.growingSeason || '8 meses' }
        ];

        climateStats.innerHTML = stats.map(stat => `
            <div class="stat">
                <span class="label">${stat.label}:</span>
                <span class="value">${stat.value}</span>
            </div>
        `).join('');
    }

    /**
     * Popula especialidades agrícolas
     * @param {Object} regionData - Dados da região
     */
    populateSpecialties(regionData) {
        const specialtiesGrid = this.modal.querySelector('.specialties-grid');
        const specialties = regionData.specialties || ['Milho', 'Soja', 'Trigo'];

        // Mapeamento de culturas para ícones disponíveis
        const cropIcons = {
            'Milho': 'assets/images/icons/Corn.png',
            'Corn': 'assets/images/icons/Corn.png',
            'Trigo': 'assets/images/icons/Wheat.png',
            'Wheat': 'assets/images/icons/Wheat.png',
            'Arroz': 'assets/images/icons/Rice.png',
            'Rice': 'assets/images/icons/Rice.png',
            'Soja': 'assets/images/icons/Farm.png',
            'Café': 'assets/images/icons/Farm.png',
            'Cacau': 'assets/images/icons/Farm.png',
            'Cana-de-açúcar': 'assets/images/icons/Farm.png',
            'Cevada': 'assets/images/icons/Wheat.png',
            'Beterraba': 'assets/images/icons/Farm.png',
            'Girassol': 'assets/images/icons/Farm.png',
            'Chá': 'assets/images/icons/Farm.png',
            'Sorgo': 'assets/images/icons/Corn.png',
            'Milheto': 'assets/images/icons/Wheat.png',
            'Mandioca': 'assets/images/icons/Farm.png',
            'Frutas': 'assets/images/icons/Farm.png',
            'Vinho': 'assets/images/icons/Farm.png',
            'Algodão': 'assets/images/icons/Farm.png'
        };

        specialtiesGrid.innerHTML = specialties.map(specialty => {
            const iconPath = cropIcons[specialty] || 'assets/images/icons/Farm.png';
            return `
                <div class="specialty-item">
                    <img src="${iconPath}" alt="${specialty}" class="specialty-icon">
                    <span class="specialty-name">${specialty}</span>
                </div>
            `;
        }).join('');
    }

    /**
     * Popula bônus regional
     * @param {Object} regionData - Dados da região
     */
    populateBonus(regionData) {
        const bonusCard = this.modal.querySelector('.bonus-card');
        const bonus = regionData.bonus || { type: 'Produtividade', value: '+15%' };

        const bonusIcons = {
            'Produtividade': '📈',
            'Qualidade': '⭐',
            'Sustentabilidade': '♻️',
            'Resistência': '🛡️',
            'Eficiência': '⚡'
        };

        bonusCard.innerHTML = `
            <i>${bonusIcons[bonus.type] || '🎯'}</i>
            <div class="bonus-details">
                <span>Bônus Regional</span>
                <div class="bonus-value">${bonus.type}: ${bonus.value}</div>
            </div>
        `;
    }

    /**
     * Popula dados da NASA
     * @param {Object} regionData - Dados da região
     */
    populateNASAData(regionData) {
        const nasaData = this.modal.querySelector('.nasa-data');
        const data = regionData.nasaData || {
            soilQuality: 75,
            waterAvailability: 80,
            solarRadiation: 85,
            carbonContent: 60
        };

        const dataItems = [
            { label: 'Qualidade do Solo', value: data.soilQuality, unit: '%' },
            { label: 'Disponibilidade Hídrica', value: data.waterAvailability, unit: '%' },
            { label: 'Radiação Solar', value: data.solarRadiation, unit: '%' },
            { label: 'Conteúdo de Carbono', value: data.carbonContent, unit: '%' }
        ];

        nasaData.innerHTML = dataItems.map(item => `
            <div class="data-item">
                <span class="label">${item.label}:</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${item.value}%"></div>
                </div>
                <span class="value">${item.value}${item.unit}</span>
            </div>
        `).join('');
    }

    /**
     * Obtém dados específicos de um país para exibição no modal
     * @param {string} regionId - ID do país
     * @returns {Object} Dados do país
     */
    static getRegionData(regionId) {
        const regionsData = {
            'brazil': {
                name: 'Brasil',
                description: 'Maior produtor mundial de soja e café, com vastas áreas agrícolas no Cerrado e Amazônia.',
                climate: {
                    type: 'tropical',
                    avgTemp: 25,
                    rainfall: 1200,
                    humidity: 70,
                    growingSeason: '8-10 meses'
                },
                specialties: ['Soja', 'Café', 'Cana-de-açúcar'],
                bonus: { type: 'Biodiversidade', value: '+25%' },
                nasaData: {
                    soilQuality: 85,
                    waterAvailability: 80,
                    solarRadiation: 90,
                    carbonContent: 75
                }
            },
            'usa': {
                name: 'Estados Unidos',
                description: 'Líder mundial em produção de milho e tecnologia agrícola avançada.',
                climate: {
                    type: 'continental',
                    avgTemp: 18,
                    rainfall: 700,
                    humidity: 60,
                    growingSeason: '6-8 meses'
                },
                specialties: ['Milho', 'Soja', 'Trigo'],
                bonus: { type: 'Tecnologia', value: '+30%' },
                nasaData: {
                    soilQuality: 88,
                    waterAvailability: 75,
                    solarRadiation: 80,
                    carbonContent: 70
                }
            },
            'china': {
                name: 'China',
                description: 'Maior produtor mundial de arroz e líder em agricultura intensiva.',
                climate: {
                    type: 'subtropical',
                    avgTemp: 22,
                    rainfall: 900,
                    humidity: 70,
                    growingSeason: '8-10 meses'
                },
                specialties: ['Arroz', 'Trigo', 'Milho'],
                bonus: { type: 'Intensidade', value: '+35%' },
                nasaData: {
                    soilQuality: 82,
                    waterAvailability: 78,
                    solarRadiation: 85,
                    carbonContent: 68
                }
            },
            'india': {
                name: 'Índia',
                description: 'Segundo maior produtor mundial de arroz e trigo, com agricultura baseada em monções.',
                climate: {
                    type: 'tropical',
                    avgTemp: 30,
                    rainfall: 1100,
                    humidity: 78,
                    growingSeason: '6-8 meses'
                },
                specialties: ['Arroz', 'Trigo', 'Algodão'],
                bonus: { type: 'Monções', value: '+20%' },
                nasaData: {
                    soilQuality: 80,
                    waterAvailability: 85,
                    solarRadiation: 88,
                    carbonContent: 72
                }
            },
            'argentina': {
                name: 'Argentina',
                description: 'Grande exportador de carne bovina e soja, com os férteis Pampas.',
                climate: {
                    type: 'subtropical',
                    avgTemp: 17,
                    rainfall: 800,
                    humidity: 68,
                    growingSeason: '7-9 meses'
                },
                specialties: ['Soja', 'Trigo', 'Carne Bovina'],
                bonus: { type: 'Pampas', value: '+25%' },
                nasaData: {
                    soilQuality: 92,
                    waterAvailability: 75,
                    solarRadiation: 82,
                    carbonContent: 85
                }
            },
            'australia': {
                name: 'Austrália',
                description: 'Líder em agricultura sustentável e adaptada ao clima seco.',
                climate: {
                    type: 'mediterranean',
                    avgTemp: 23,
                    rainfall: 450,
                    humidity: 50,
                    growingSeason: '7-9 meses'
                },
                specialties: ['Trigo', 'Cevada', 'Carne Bovina'],
                bonus: { type: 'Sustentabilidade', value: '+30%' },
                nasaData: {
                    soilQuality: 75,
                    waterAvailability: 55,
                    solarRadiation: 90,
                    carbonContent: 65
                }
            },
            'canada': {
                name: 'Canadá',
                description: 'Grande produtor de trigo e canola, com agricultura adaptada ao clima frio.',
                climate: {
                    type: 'continental',
                    avgTemp: 12,
                    rainfall: 500,
                    humidity: 60,
                    growingSeason: '4-6 meses'
                },
                specialties: ['Trigo', 'Canola', 'Cevada'],
                bonus: { type: 'Clima Frio', value: '+20%' },
                nasaData: {
                    soilQuality: 85,
                    waterAvailability: 70,
                    solarRadiation: 65,
                    carbonContent: 78
                }
            },
            'russia': {
                name: 'Rússia',
                description: 'Maior país do mundo com vastas áreas de cultivo de trigo e cevada.',
                climate: {
                    type: 'continental',
                    avgTemp: 9,
                    rainfall: 400,
                    humidity: 65,
                    growingSeason: '4-5 meses'
                },
                specialties: ['Trigo', 'Cevada', 'Aveia'],
                bonus: { type: 'Extensão', value: '+40%' },
                nasaData: {
                    soilQuality: 80,
                    waterAvailability: 65,
                    solarRadiation: 60,
                    carbonContent: 82
                }
            }
        };

        return regionsData[regionId] || regionsData['brazil'];
    }
}

// Instância global do modal
window.RegionInfoModal = RegionInfoModal;