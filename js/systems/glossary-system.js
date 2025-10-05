/**
 * Sistema de Glossário - FarmVerse
 * Fornece informações regionais e dados educativos sobre agricultura
 */

class GlossarySystem {
    constructor() {
        this.isOpen = false;
        this.currentRegion = 'global';
        this.glossaryData = this.initializeGlossaryData();
        this.init();
    }

    /**
     * Initializes glossary data with regional information
     */
    initializeGlossaryData() {
        return {
            global: {
                title: "Global Information",
                description: "General data about sustainable agriculture and NASA technologies",
                items: [
                    {
                        term: "Precision Agriculture",
                        definition: "Use of technology to optimize crop yield and reduce waste",
                        nasaData: "MODIS satellite data for crop monitoring"
                    },
                    {
                        term: "Vegetation Index (NDVI)",
                        definition: "Measure of vegetation health using satellite data",
                        nasaData: "Calculated using red and near-infrared bands"
                    },
                    {
                        term: "Soil Moisture",
                        definition: "Amount of water present in soil, crucial for plant growth",
                        nasaData: "Monitored by NASA's SMAP satellite"
                    }
                ]
            },
            brazil: {
                title: "Brazil - Tropical Region",
                description: "Specific information for Brazilian tropical agriculture",
                items: [
                    {
                        term: "Cerrado",
                        definition: "Brazilian biome ideal for grain agriculture like soy and corn",
                        nasaData: "Monitored by Landsat satellites for deforestation"
                    },
                    {
                        term: "Tropical Agriculture",
                        definition: "Techniques adapted to hot and humid climate",
                        nasaData: "Precipitation data from GPM (Global Precipitation Measurement)"
                    },
                    {
                        term: "Crop Rotation",
                        definition: "Alternating different crops to maintain soil fertility",
                        nasaData: "Temporal analysis using MODIS images"
                    }
                ]
            },
            usa: {
                title: "United States - Temperate Region",
                description: "Information for agriculture in temperate climate",
                items: [
                    {
                        term: "Corn Belt",
                        definition: "US region specialized in corn and soybean cultivation",
                        nasaData: "Productivity monitoring via MODIS and Landsat"
                    },
                    {
                        term: "Dryland Agriculture",
                        definition: "Cultivation dependent only on natural precipitation",
                        nasaData: "Precipitation and soil moisture data from SMAP"
                    },
                    {
                        term: "Integrated Pest Management",
                        definition: "Sustainable strategy for pest control",
                        nasaData: "Crop stress detection via remote sensing"
                    }
                ]
            },
            africa: {
                title: "Africa - Arid/Semi-arid Region",
                description: "Techniques for agriculture in water-scarce regions",
                items: [
                    {
                        term: "Subsistence Agriculture",
                        definition: "Cultivation for family and local food supply",
                        nasaData: "Drought monitoring via GRACE data"
                    },
                    {
                        term: "Drip Irrigation",
                        definition: "Efficient irrigation technique for arid regions",
                        nasaData: "Optimization using MODIS evapotranspiration data"
                    },
                    {
                        term: "Drought-Resistant Crops",
                        definition: "Plants adapted to low precipitation conditions",
                        nasaData: "Variety identification via spectral analysis"
                    }
                ]
            }
        };
    }

    /**
     * Initializes the glossary system
     */
    init() {
        this.createGlossaryPopup();
        this.bindEvents();
    }

    /**
     * Creates the glossary popup
     */
    createGlossaryPopup() {
        const popup = document.createElement('div');
        popup.id = 'glossary-popup';
        popup.className = 'glossary-popup hidden';
        popup.innerHTML = `
            <div class="glossary-content">
                <div class="glossary-header">
                    <h2 id="glossary-title">Glossário</h2>
                    <button class="close-btn" id="close-glossary">&times;</button>
                </div>
                
                <div class="region-selector">
                    <label>Selecionar Região:</label>
                    <select id="region-select">
                        <option value="global">🌍 Global</option>
                        <option value="brazil">🇧🇷 Brasil</option>
                        <option value="usa">🇺🇸 Estados Unidos</option>
                        <option value="africa">🌍 África</option>
                    </select>
                </div>
                
                <div class="glossary-description">
                    <p id="region-description"></p>
                </div>
                
                <div class="glossary-items" id="glossary-items">
                    <!-- Items serão inseridos dinamicamente -->
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
    }

    /**
     * Vincula eventos aos elementos
     */
    bindEvents() {
        // Botão para abrir glossário
        const glossaryBtn = document.getElementById('glossary-btn');
        if (glossaryBtn) {
            glossaryBtn.addEventListener('click', () => this.openGlossary());
        }

        // Botão para fechar glossário
        const closeBtn = document.getElementById('close-glossary');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeGlossary());
        }

        // Seletor de região
        const regionSelect = document.getElementById('region-select');
        if (regionSelect) {
            regionSelect.addEventListener('change', (e) => {
                this.currentRegion = e.target.value;
                this.updateGlossaryContent();
            });
        }

        // Fechar ao clicar fora do popup
        const popup = document.getElementById('glossary-popup');
        if (popup) {
            popup.addEventListener('click', (e) => {
                if (e.target === popup) {
                    this.closeGlossary();
                }
            });
        }

        // Fechar com tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeGlossary();
            }
        });
    }

    /**
     * Abre o popup do glossário
     */
    openGlossary() {
        const popup = document.getElementById('glossary-popup');
        if (popup) {
            popup.classList.remove('hidden');
            this.isOpen = true;
            this.updateGlossaryContent();
        }
    }

    /**
     * Fecha o popup do glossário
     */
    closeGlossary() {
        const popup = document.getElementById('glossary-popup');
        if (popup) {
            popup.classList.add('hidden');
            this.isOpen = false;
        }
    }

    /**
     * Atualiza o conteúdo do glossário baseado na região selecionada
     */
    updateGlossaryContent() {
        const regionData = this.glossaryData[this.currentRegion];
        if (!regionData) return;

        // Atualizar título
        const title = document.getElementById('glossary-title');
        if (title) {
            title.textContent = regionData.title;
        }

        // Atualizar descrição
        const description = document.getElementById('region-description');
        if (description) {
            description.textContent = regionData.description;
        }

        // Atualizar items
        const itemsContainer = document.getElementById('glossary-items');
        if (itemsContainer) {
            itemsContainer.innerHTML = '';
            
            regionData.items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'glossary-item';
                itemElement.innerHTML = `
                    <div class="term-header">
                        <h4 class="term-name">${item.term}</h4>
                        <span class="nasa-badge">NASA</span>
                    </div>
                    <p class="term-definition">${item.definition}</p>
                    <div class="nasa-data">
                        <strong>Dados NASA:</strong> ${item.nasaData}
                    </div>
                `;
                itemsContainer.appendChild(itemElement);
            });
        }

        // Atualizar seletor de região
        const regionSelect = document.getElementById('region-select');
        if (regionSelect) {
            regionSelect.value = this.currentRegion;
        }
    }

    /**
     * Obtém informações de uma região específica
     */
    getRegionInfo(region) {
        return this.glossaryData[region] || this.glossaryData.global;
    }

    /**
     * Adiciona um novo termo ao glossário
     */
    addTerm(region, term, definition, nasaData) {
        if (!this.glossaryData[region]) {
            this.glossaryData[region] = {
                title: region.charAt(0).toUpperCase() + region.slice(1),
                description: `Informações específicas para ${region}`,
                items: []
            };
        }

        this.glossaryData[region].items.push({
            term,
            definition,
            nasaData
        });

        // Atualizar conteúdo se a região atual estiver sendo exibida
        if (this.currentRegion === region && this.isOpen) {
            this.updateGlossaryContent();
        }
    }
}

// Inicializar o sistema de glossário quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.glossarySystem = new GlossarySystem();
});