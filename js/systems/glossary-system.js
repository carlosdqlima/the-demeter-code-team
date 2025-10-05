/**
 * Sistema de Glossário - NASA Farm Navigators
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
     * Inicializa os dados do glossário com informações regionais
     */
    initializeGlossaryData() {
        return {
            global: {
                title: "Informações Globais",
                description: "Dados gerais sobre agricultura sustentável e tecnologias da NASA",
                items: [
                    {
                        term: "Agricultura de Precisão",
                        definition: "Uso de tecnologia para otimizar o rendimento das culturas e reduzir o desperdício",
                        nasaData: "Dados de satélite MODIS para monitoramento de culturas"
                    },
                    {
                        term: "Índice de Vegetação (NDVI)",
                        definition: "Medida da saúde da vegetação usando dados de satélite",
                        nasaData: "Calculado usando bandas vermelha e infravermelha próxima"
                    },
                    {
                        term: "Umidade do Solo",
                        definition: "Quantidade de água presente no solo, crucial para o crescimento das plantas",
                        nasaData: "Monitorada pelo satélite SMAP da NASA"
                    }
                ]
            },
            brazil: {
                title: "Brasil - Região Tropical",
                description: "Informações específicas para agricultura tropical brasileira",
                items: [
                    {
                        term: "Cerrado",
                        definition: "Bioma brasileiro ideal para agricultura de grãos como soja e milho",
                        nasaData: "Monitorado por satélites Landsat para desmatamento"
                    },
                    {
                        term: "Agricultura Tropical",
                        definition: "Técnicas adaptadas ao clima quente e úmido",
                        nasaData: "Dados de precipitação do GPM (Global Precipitation Measurement)"
                    },
                    {
                        term: "Rotação de Culturas",
                        definition: "Alternância de diferentes culturas para manter a fertilidade do solo",
                        nasaData: "Análise temporal usando imagens MODIS"
                    }
                ]
            },
            usa: {
                title: "Estados Unidos - Região Temperada",
                description: "Informações para agricultura em clima temperado",
                items: [
                    {
                        term: "Corn Belt",
                        definition: "Região dos EUA especializada no cultivo de milho e soja",
                        nasaData: "Monitoramento de produtividade via MODIS e Landsat"
                    },
                    {
                        term: "Agricultura de Sequeiro",
                        definition: "Cultivo dependente apenas da precipitação natural",
                        nasaData: "Dados de precipitação e umidade do solo SMAP"
                    },
                    {
                        term: "Manejo Integrado de Pragas",
                        definition: "Estratégia sustentável para controle de pragas",
                        nasaData: "Detecção de estresse em culturas via sensoriamento remoto"
                    }
                ]
            },
            africa: {
                title: "África - Região Árida/Semiárida",
                description: "Técnicas para agricultura em regiões com escassez de água",
                items: [
                    {
                        term: "Agricultura de Subsistência",
                        definition: "Cultivo para alimentação familiar e local",
                        nasaData: "Monitoramento de secas via dados GRACE"
                    },
                    {
                        term: "Irrigação por Gotejamento",
                        definition: "Técnica eficiente de irrigação para regiões áridas",
                        nasaData: "Otimização usando dados de evapotranspiração MODIS"
                    },
                    {
                        term: "Culturas Resistentes à Seca",
                        definition: "Plantas adaptadas a condições de baixa precipitação",
                        nasaData: "Identificação de variedades via análise espectral"
                    }
                ]
            }
        };
    }

    /**
     * Inicializa o sistema de glossário
     */
    init() {
        this.createGlossaryPopup();
        this.bindEvents();
    }

    /**
     * Cria o popup do glossário
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