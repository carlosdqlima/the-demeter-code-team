/**
 * Sistema de Mapa Mundial - FarmVerse
 * Gerencia o mapa interativo global usando MapLibre GL JS
 */

class MapSystem {
    constructor() {
        this.map = null;
        this.markers = new Map();
        this.regions = new Map();
        this.selectedRegion = null;
        this.climateLayer = null;
        this.farmMarkers = [];
        this.isInitialized = false;
        this.isFullscreen = true; // Inicia em tela cheia
        
        // Configurações do mapa
        this.config = {
            center: [0, 20], // [lng, lat] para MapLibre
            zoom: 2,
            minZoom: 1, // Zoom mínimo - visualização mundial
            maxZoom: 6, // Zoom máximo - detalhes dos continentes
            style: 'https://demotiles.maplibre.org/globe.json' // Estilo do mapa
        };
        
        // Bind methods
        this.onRegionClick = this.onRegionClick.bind(this);
        this.onMapClick = this.onMapClick.bind(this);
    }
    
    /**
     * Inicializa o sistema de mapa
     * Configura o mapa, carrega as regiões e configura os eventos
     */
    async initialize() {
        try {
            console.log('🗺️ Inicializando sistema de mapa...');
            
            this.setupOverlay();
            this.createMap();
            await this.loadRegions();
            this.setupEventListeners();
            
            this.isInitialized = true;
            console.log('✅ Sistema de mapa inicializado com sucesso');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar sistema de mapa:', error);
            throw error;
        }
    }
    
    /**
     * Cria o mapa MapLibre GL JS
     * Inicializa o mapa com as configurações básicas
     */
    createMap() {
        const mapContainerId = this.isFullscreen ? 'world-map-fullscreen' : 'world-map';
        const mapContainer = document.getElementById(mapContainerId);
        
        if (!mapContainer) {
            throw new Error(`Container do mapa não encontrado: ${mapContainerId}`);
        }

        this.map = new maplibregl.Map({
            container: mapContainerId,
            style: this.config.style,
            center: this.config.center,
            zoom: this.config.zoom,
            minZoom: this.config.minZoom,
            maxZoom: this.config.maxZoom,
            attributionControl: false,
            scrollZoom: true, // Habilita zoom com scroll
            doubleClickZoom: true, // Habilita zoom com duplo clique
            touchZoomRotate: true, // Habilita zoom e rotação touch
            boxZoom: false, // Mantém desabilitado zoom por seleção
            keyboard: true // Habilita zoom por teclado
        });

        // Adiciona controles de navegação
        this.map.addControl(new maplibregl.NavigationControl(), 'top-right');
        
        // Adiciona controles customizados
        this.addCustomControls();

        // Configura eventos do mapa
        this.map.on('load', () => {
            console.log('🗺️ Mapa carregado com sucesso');
            this.setupMapLayers();
        });

        this.map.on('click', this.onMapClick);

        console.log('🗺️ Mapa criado com sucesso');
    }
    
    /**
     * Configura as camadas do mapa
     * Adiciona fontes de dados e camadas personalizadas
     */
    setupMapLayers() {
        // Inicializa camadas da NASA
        this.initializeNASALayers();
        
        console.log('🗺️ Camadas do mapa configuradas');
    }
    
    /**
     * Inicializa camadas de dados da NASA
     */
    initializeNASALayers() {
        this.nasaLayers = {
            climate: {
                enabled: false,
                data: new Map(),
                overlay: null
            },
            satellite: {
                enabled: false,
                data: new Map(),
                overlay: null
            },
            soilMoisture: {
                enabled: false,
                data: new Map(),
                overlay: null
            },
            precipitation: {
                enabled: false,
                data: new Map(),
                overlay: null
            }
        };
        
        // Inicializa serviço da NASA API se disponível
        if (window.NASAApiService) {
            this.nasaApi = new window.NASAApiService();
        }
        
        console.log('🛰️ Camadas da NASA inicializadas');
    }
    
    /**
     * Adiciona camada de dados climáticos da NASA
     */
    async addNASAClimateLayer() {
        if (!this.nasaApi) {
            console.warn('Serviço NASA API não disponível');
            return;
        }
        
        try {
            // Obtém dados climáticos para todas as regiões visíveis
            const bounds = this.map.getBounds();
            const climateData = await this.loadClimateDataForBounds(bounds);
            
            // Cria overlay de dados climáticos
            this.createClimateOverlay(climateData);
            
            this.nasaLayers.climate.enabled = true;
            console.log('🌡️ Camada climática da NASA adicionada');
            
        } catch (error) {
            console.error('Erro ao adicionar camada climática:', error);
        }
    }
    
    /**
     * Adiciona camada de imagens de satélite da NASA
     */
    async addNASASatelliteLayer() {
        if (!this.nasaApi) {
            console.warn('Serviço NASA API não disponível');
            return;
        }
        
        try {
            // Obtém imagens de satélite para regiões visíveis
            const satelliteData = await this.loadSatelliteImagery();
            
            // Cria overlay de imagens de satélite
            this.createSatelliteOverlay(satelliteData);
            
            this.nasaLayers.satellite.enabled = true;
            console.log('🛰️ Camada de satélite da NASA adicionada');
            
        } catch (error) {
            console.error('Erro ao adicionar camada de satélite:', error);
        }
    }
    
    /**
     * Adiciona camada de dados de umidade do solo (SMAP)
     */
    async addNASASoilMoistureLayer() {
        if (!this.nasaApi) {
            console.warn('Serviço NASA API não disponível');
            return;
        }
        
        try {
            // Obtém dados de umidade do solo
            const soilData = await this.loadSoilMoistureData();
            
            // Cria overlay de umidade do solo
            this.createSoilMoistureOverlay(soilData);
            
            this.nasaLayers.soilMoisture.enabled = true;
            console.log('💧 Camada de umidade do solo da NASA adicionada');
            
        } catch (error) {
            console.error('Erro ao adicionar camada de umidade do solo:', error);
        }
    }
    
    /**
     * Carrega dados climáticos para uma área específica
     * @param {Object} bounds - Limites da área do mapa
     */
    async loadClimateDataForBounds(bounds) {
        const climateData = [];
        
        // Cria grid de pontos para coleta de dados
        const gridPoints = this.createDataGrid(bounds, 0.5); // Grid de 0.5 graus
        
        for (const point of gridPoints) {
            try {
                const data = await this.nasaApi.getCompleteClimateData(point.lat, point.lng);
                climateData.push({
                    ...point,
                    climate: data
                });
            } catch (error) {
                console.warn(`Erro ao obter dados climáticos para ${point.lat}, ${point.lng}:`, error);
            }
        }
        
        return climateData;
    }
    
    /**
     * Carrega imagens de satélite para regiões
     */
    async loadSatelliteImagery() {
        const satelliteData = [];
        
        for (const [regionId, regionData] of this.regions) {
            try {
                // Valida coordenadas da região
                if (!regionData.center || !Array.isArray(regionData.center) || 
                    regionData.center.length !== 2) {
                    console.warn(`Coordenadas inválidas para região ${regionId}:`, regionData.center);
                    continue;
                }
                
                const [lat, lng] = regionData.center; // [lat, lng] no regions-data.js
                
                const imagery = await this.nasaApi.getEarthImagery(lat, lng);
                
                satelliteData.push({
                    regionId,
                    lat,
                    lng,
                    imagery
                });
            } catch (error) {
                console.warn(`Erro ao obter imagem de satélite para região ${regionId}:`, error);
            }
        }
        
        return satelliteData;
    }
    
    /**
     * Carrega dados de umidade do solo
     */
    async loadSoilMoistureData() {
        const soilData = [];
        
        for (const [regionId, regionData] of this.regions) {
            try {
                const soilMoisture = await this.nasaApi.getSoilTemperature(
                    regionData.center.lat,
                    regionData.center.lng
                );
                
                soilData.push({
                    regionId,
                    ...regionData.center,
                    soilMoisture
                });
            } catch (error) {
                console.warn(`Erro ao obter dados de umidade do solo para região ${regionId}:`, error);
            }
        }
        
        return soilData;
    }
    
    /**
     * Cria grid de pontos para coleta de dados
     * @param {Object} bounds - Limites da área
     * @param {number} resolution - Resolução do grid em graus
     */
    createDataGrid(bounds, resolution) {
        const points = [];
        const north = bounds.getNorth();
        const south = bounds.getSouth();
        const east = bounds.getEast();
        const west = bounds.getWest();
        
        for (let lat = south; lat <= north; lat += resolution) {
            for (let lng = west; lng <= east; lng += resolution) {
                points.push({ lat, lng });
            }
        }
        
        return points;
    }
    
    /**
     * Cria overlay de dados climáticos
     * @param {Array} climateData - Dados climáticos
     */
    createClimateOverlay(climateData) {
        if (this.nasaLayers.climate.overlay) {
            this.map.removeSource('climate-data');
            this.map.removeLayer('climate-layer');
        }
        
        const features = climateData
            .filter(point => point.climate && point.climate.temperature)
            .map(point => ({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [point.lng, point.lat]
                },
                properties: {
                    temperature: point.climate.temperature,
                    humidity: point.climate.humidity,
                    precipitation: point.climate.precipitation,
                    solarRadiation: point.climate.solarRadiation,
                    color: this.getTemperatureColor(point.climate.temperature)
                }
            }));
        
        this.map.addSource('climate-data', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: features
            }
        });
        
        this.map.addLayer({
            id: 'climate-layer',
            type: 'circle',
            source: 'climate-data',
            paint: {
                'circle-radius': 8,
                'circle-color': ['get', 'color'],
                'circle-stroke-color': '#fff',
                'circle-stroke-width': 1,
                'circle-opacity': 0.8
            }
        });
        
        // Adiciona popup ao clicar
        this.map.on('click', 'climate-layer', (e) => {
            const properties = e.features[0].properties;
            new maplibregl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(`
                    <div class="nasa-climate-popup">
                        <h6>🌡️ Dados Climáticos NASA</h6>
                        <p><strong>Temperatura:</strong> ${properties.temperature}°C</p>
                        <p><strong>Umidade:</strong> ${properties.humidity}%</p>
                        <p><strong>Precipitação:</strong> ${properties.precipitation}mm</p>
                        <p><strong>Radiação Solar:</strong> ${properties.solarRadiation} W/m²</p>
                    </div>
                `)
                .addTo(this.map);
        });
        
        this.nasaLayers.climate.overlay = true;
    }
    
    /**
     * Cria overlay de imagens de satélite
     * @param {Array} satelliteData - Dados de satélite
     */
    createSatelliteOverlay(satelliteData) {
        if (this.nasaLayers.satellite.overlay) {
            this.map.removeSource('satellite-data');
            this.map.removeLayer('satellite-layer');
        }
        
        satelliteData.forEach(point => {
            if (point.imagery && point.imagery.url) {
                // Valida coordenadas antes de criar o marcador
                if (isNaN(point.lng) || isNaN(point.lat) || 
                    point.lng === undefined || point.lat === undefined) {
                    console.warn(`Coordenadas inválidas para ponto de satélite:`, point);
                    return;
                }
                
                const markerElement = document.createElement('div');
                markerElement.className = 'nasa-satellite-marker';
                markerElement.innerHTML = '<i class="fas fa-satellite"></i>';
                
                const marker = new maplibregl.Marker({
                    element: markerElement
                })
                .setLngLat([point.lng, point.lat])
                .setPopup(new maplibregl.Popup().setHTML(`
                    <div class="nasa-satellite-popup">
                        <h6>🛰️ Imagem de Satélite NASA</h6>
                        <img src="${point.imagery.url}" alt="Imagem de satélite" style="width: 200px; height: 150px; object-fit: cover;">
                        <p><strong>Data:</strong> ${point.imagery.date}</p>
                        <p><strong>Região:</strong> ${point.regionId}</p>
                    </div>
                `))
                .addTo(this.map);
            }
        });
        
        this.nasaLayers.satellite.overlay = true;
    }
    
    /**
     * Cria overlay de dados de umidade do solo
     * @param {Array} soilData - Dados de umidade do solo
     */
    createSoilMoistureOverlay(soilData) {
        if (this.nasaLayers.soilMoisture.overlay) {
            this.map.removeSource('soil-data');
            this.map.removeLayer('soil-layer');
        }
        
        const features = soilData
            .filter(point => point.soilMoisture)
            .map(point => {
                const moistureLevel = point.soilMoisture.moisture || 0;
                return {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [point.lng, point.lat]
                    },
                    properties: {
                        moisture: moistureLevel,
                        temperature: point.soilMoisture.temperature,
                        regionId: point.regionId,
                        color: this.getSoilMoistureColor(moistureLevel)
                    }
                };
            });
        
        this.map.addSource('soil-data', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: features
            }
        });
        
        this.map.addLayer({
            id: 'soil-layer',
            type: 'circle',
            source: 'soil-data',
            paint: {
                'circle-radius': 10,
                'circle-color': ['get', 'color'],
                'circle-stroke-color': '#333',
                'circle-stroke-width': 2,
                'circle-opacity': 0.8
            }
        });
        
        // Adiciona popup ao clicar
        this.map.on('click', 'soil-layer', (e) => {
            const properties = e.features[0].properties;
            new maplibregl.Popup()
                .setLngLat(e.lngLat)
                .setHTML(`
                    <div class="nasa-soil-popup">
                        <h6>💧 Umidade do Solo NASA</h6>
                        <p><strong>Umidade:</strong> ${properties.moisture}%</p>
                        <p><strong>Temperatura do Solo:</strong> ${properties.temperature}°C</p>
                        <p><strong>Região:</strong> ${properties.regionId}</p>
                    </div>
                `)
                .addTo(this.map);
        });
        
        this.nasaLayers.soilMoisture.overlay = true;
    }
    
    /**
     * Obtém cor baseada na temperatura
     * @param {number} temperature - Temperatura em Celsius
     */
    getTemperatureColor(temperature) {
        if (temperature < 0) return '#0066cc';      // Azul para muito frio
        if (temperature < 10) return '#3399ff';     // Azul claro para frio
        if (temperature < 20) return '#66ccff';     // Azul muito claro para fresco
        if (temperature < 25) return '#99ff99';     // Verde claro para agradável
        if (temperature < 30) return '#ffff66';     // Amarelo para morno
        if (temperature < 35) return '#ff9933';     // Laranja para quente
        return '#ff3333';                           // Vermelho para muito quente
    }
    
    /**
     * Obtém cor baseada na umidade do solo
     * @param {number} moisture - Umidade em porcentagem
     */
    getSoilMoistureColor(moisture) {
        if (moisture < 20) return '#8B4513';        // Marrom para solo seco
        if (moisture < 40) return '#D2691E';        // Marrom claro para solo pouco úmido
        if (moisture < 60) return '#228B22';        // Verde para solo adequadamente úmido
        if (moisture < 80) return '#006400';        // Verde escuro para solo muito úmido
        return '#0000FF';                           // Azul para solo encharcado
    }
    
    /**
     * Alterna visibilidade das camadas da NASA
     * @param {string} layerType - Tipo da camada (climate, satellite, soilMoisture)
     */
    toggleNASALayer(layerType) {
        if (!this.nasaLayers[layerType]) {
            console.warn(`Camada NASA '${layerType}' não encontrada`);
            return;
        }
        
        const layer = this.nasaLayers[layerType];
        
        if (layer.enabled && layer.overlay) {
            // Remove camada
            this.map.removeLayer(layer.overlay);
            layer.enabled = false;
            console.log(`Camada NASA '${layerType}' removida`);
        } else {
            // Adiciona camada
            switch (layerType) {
                case 'climate':
                    this.addNASAClimateLayer();
                    break;
                case 'satellite':
                    this.addNASASatelliteLayer();
                    break;
                case 'soilMoisture':
                    this.addNASASoilMoistureLayer();
                    break;
            }
        }
        
        // Atualiza UI dos controles
        this.updateNASALayerControls();
    }
    
    /**
     * Atualiza controles das camadas da NASA
     */
    updateNASALayerControls() {
        const controls = document.querySelectorAll('.nasa-layer-control');
        controls.forEach(control => {
            const layerType = control.dataset.layer;
            if (this.nasaLayers[layerType]) {
                control.classList.toggle('active', this.nasaLayers[layerType].enabled);
            }
        });
    }
    
    /**
     * Carrega dados das regiões agrícolas
     */
    async loadRegions() {
        // Usa regionsConfig do arquivo regions-data.js em vez do GameConfig
        const regionsData = window.regionsConfig || {};
        
        for (const [regionId, regionData] of Object.entries(regionsData)) {
            // Valida se as coordenadas são válidas
            if (!regionData.center || 
                !Array.isArray(regionData.center) || 
                regionData.center.length !== 2 ||
                isNaN(regionData.center[0]) || 
                isNaN(regionData.center[1])) {
                console.warn(`Coordenadas inválidas para região ${regionId}:`, regionData.center);
                continue;
            }
            
            // Cria marcador para a região
            const marker = this.createRegionMarker(regionId, regionData);
            this.markers.set(regionId, marker);
            this.regions.set(regionId, regionData);
        }
        
        console.log(`Carregadas ${this.regions.size} regiões agrícolas`);
    }
    
    /**
     * Cria marcador para região agrícola
     * @param {string} regionId - ID da região
     * @param {Object} regionData - Dados da região
     * @returns {maplibregl.Marker} Marcador MapLibre GL JS
     */
    createRegionMarker(regionId, regionData) {
        // Cria elemento HTML customizado para o marcador
        const markerElement = document.createElement('div');
        markerElement.className = 'region-marker';
        markerElement.innerHTML = `
            <div class="region-marker-content" data-region="${regionId}">
                <i class="fas fa-map-marker-alt"></i>
                <span class="region-name">${regionData.name}</span>
            </div>
        `;
        
        // Cria marcador MapLibre GL JS
        const marker = new maplibregl.Marker({
            element: markerElement,
            anchor: 'bottom'
        })
        .setLngLat([regionData.center[1], regionData.center[0]]) // [lng, lat] para MapLibre
        .addTo(this.map);
        
        // Adiciona popup com informações
        const popupContent = this.createRegionPopup(regionId, regionData);
        const popup = new maplibregl.Popup({
            maxWidth: '300px',
            className: 'region-popup'
        })
        .setHTML(popupContent);
        
        marker.setPopup(popup);
        
        // Adiciona evento de clique
        markerElement.addEventListener('click', (e) => {
            e.stopPropagation();
            this.onRegionClick(regionId, regionData);
        });
        
        // Armazena dados da região no marcador
        marker.regionId = regionId;
        marker.regionData = regionData;
        
        return marker;
    }
    
    /**
     * Cria conteúdo do popup da região
     * @param {string} regionId - ID da região
     * @param {Object} regionData - Dados da região
     * @returns {string} HTML do popup
     */
    createRegionPopup(regionId, regionData) {
        const specialties = regionData.specialties.map(crop => 
            `<span class="specialty-tag">${crop}</span>`
        ).join('');
        
        const bonusType = Object.keys(regionData.bonus)[0];
        const bonusValue = Utils.formatPercentage(regionData.bonus[bonusType]);
        
        return `
            <div class="region-popup-content">
                <h4>${regionData.name}</h4>
                <div class="region-info">
                    <p><strong>Clima:</strong> ${this.getClimateLabel(regionData.climate)}</p>
                    <p><strong>Especialidades:</strong></p>
                    <div class="specialties">${specialties}</div>
                    <p><strong>Bônus:</strong> ${this.getBonusLabel(bonusType)} +${bonusValue}</p>
                </div>
                <p class="popup-hint">🖱️ Clique na região para ver mais detalhes</p>
            </div>
        `;
    }
    
    /**
     * Adiciona pontos de dados climáticos simulados
     * Método adaptado para MapLibre GL JS
     */
    addClimateDataPoints() {
        // Este método pode ser implementado no futuro usando camadas do MapLibre GL JS
        // Por enquanto, mantemos apenas como placeholder
        console.log('🌡️ Pontos climáticos podem ser adicionados no futuro');
    }
    
    /**
     * Adiciona controles personalizados ao mapa
     */
    addCustomControls() {
        // Controle de localização
        const mapSystem = this; // Referência para o MapSystem
        
        class LocationControl {
            onAdd(map) {
                this._map = map;
                this._container = document.createElement('div');
                this._container.className = 'maplibregl-ctrl maplibregl-ctrl-group';
                this._container.innerHTML = '<button class="btn btn-primary btn-sm" title="Minha Localização"><i class="fas fa-location-arrow"></i></button>';
                
                this._container.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    mapSystem.getUserLocation(); // Usar a referência do MapSystem
                });
                
                return this._container;
            }
            
            onRemove() {
                this._container.parentNode.removeChild(this._container);
                this._map = undefined;
            }
        }
        
        this.map.addControl(new LocationControl(), 'top-right');
        
        // Controles das camadas da NASA
        this.addNASALayerControls();
    }
    
    /**
     * Adiciona controles das camadas da NASA
     */
    addNASALayerControls() {
        const mapSystem = this; // Referência para o MapSystem
        
        class NASALayersControl {
            onAdd(map) {
                this._map = map;
                this._container = document.createElement('div');
                this._container.className = 'maplibregl-ctrl nasa-layers-control';
                this._container.innerHTML = `
                    <div class="nasa-layers-panel">
                        <div class="nasa-panel-header">
                            <h6><i class="fas fa-satellite"></i> Dados NASA</h6>
                            <button class="nasa-panel-toggle" title="Alternar painel">
                                <i class="fas fa-chevron-down"></i>
                            </button>
                        </div>
                        <div class="nasa-panel-content">
                            <div class="nasa-layer-item">
                                <button class="nasa-layer-control" data-layer="climate" title="Dados Climáticos">
                                    <i class="fas fa-thermometer-half"></i>
                                    <span>Clima</span>
                                </button>
                            </div>
                            <div class="nasa-layer-item">
                                <button class="nasa-layer-control" data-layer="satellite" title="Imagens de Satélite">
                                    <i class="fas fa-satellite"></i>
                                    <span>Satélite</span>
                                </button>
                            </div>
                            <div class="nasa-layer-item">
                                <button class="nasa-layer-control" data-layer="soilMoisture" title="Umidade do Solo">
                                    <i class="fas fa-tint"></i>
                                    <span>Solo</span>
                                </button>
                            </div>
                            <div class="nasa-layer-item">
                                <div class="nasa-connection-status">
                                    <i id="nasa-connection" class="fas fa-satellite-dish"></i>
                                    <span class="connection-text">NASA API</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                // Event listeners para os controles
                mapSystem.setupNASAControlEvents(this._container);
                
                return this._container;
            }
            
            onRemove() {
                this._container.parentNode.removeChild(this._container);
                this._map = undefined;
            }
        }
        
        this.map.addControl(new NASALayersControl(), 'top-left');
    }
    
    /**
     * Configura eventos dos controles da NASA
     * @param {HTMLElement} controlDiv - Elemento do controle
     */
    setupNASAControlEvents(controlDiv) {
        // Toggle do painel
        const toggleBtn = controlDiv.querySelector('.nasa-panel-toggle');
        const panelContent = controlDiv.querySelector('.nasa-panel-content');
        
        if (toggleBtn && panelContent) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                panelContent.classList.toggle('collapsed');
                const icon = toggleBtn.querySelector('i');
                icon.classList.toggle('fa-chevron-down');
                icon.classList.toggle('fa-chevron-up');
            });
        }
        
        // Controles das camadas
        const layerControls = controlDiv.querySelectorAll('.nasa-layer-control');
        layerControls.forEach(control => {
            control.addEventListener('click', (e) => {
                e.stopPropagation();
                const layerType = control.dataset.layer;
                this.toggleNASALayer(layerType);
            });
        });
    }
    
    /**
     * Configura event listeners
     */
    setupEventListeners() {
        // Clique no mapa
        this.map.on('click', this.onMapClick);
        
        // Mudança de zoom
        this.map.on('zoomend', () => {
            this.updateMarkersVisibility();
        });
        
        // Botão de camadas
        const layersBtn = document.getElementById('map-layers-btn');
        if (layersBtn) {
            layersBtn.addEventListener('click', () => {
                this.toggleClimateLayers();
            });
        }
    }
    
    /**
     * Configura o overlay de tela cheia
     * Inicializa o estado do overlay e elementos relacionados
     */
    setupOverlay() {
        const overlay = document.querySelector('.world-map-overlay');
        const gameContainer = document.querySelector('.game-container');
        
        if (this.isFullscreen) {
            overlay?.classList.add('active');
            gameContainer?.classList.add('hidden');
        } else {
            overlay?.classList.remove('active');
            gameContainer?.classList.remove('hidden');
        }
    }

    /**
     * Transição do modo tela cheia para o modo normal
     * Oculta o overlay e mostra o jogo principal
     */
    exitFullscreen() {
        const overlay = document.querySelector('.world-map-overlay');
        const gameContainer = document.querySelector('.game-container');
        
        // Inicia transição
        overlay?.classList.remove('active');
        
        // Aguarda animação e mostra o jogo
        setTimeout(() => {
            gameContainer?.classList.remove('hidden');
            this.isFullscreen = false;
            
            // Recria o mapa no container normal
            if (this.map) {
                this.map.remove();
                this.createMap();
                this.loadRegions();
            }
        }, 500);
    }



    /**
     * Retorna ao mapa mundial em tela cheia
     * Permite trocar de região
     */
    returnToWorldMap() {
        const overlay = document.querySelector('.world-map-overlay');
        const gameContainer = document.querySelector('.game-container');
        
        // Oculta o jogo
        gameContainer?.classList.add('hidden');
        
        // Mostra o overlay
        setTimeout(() => {
            overlay?.classList.add('active');
            this.isFullscreen = true;
            
            // Recria o mapa em tela cheia
            if (this.map) {
                this.map.remove();
                this.createMap();
                this.loadRegions();
            }
        }, 100);
    }

    /**
     * Manipula clique em região
     * @param {string} regionId - ID da região
     * @param {Object} regionData - Dados da região
     */
    onRegionClick(regionId, regionData) {
        console.log(`Região clicada: ${regionData.name}`);
        
        // Destaca região selecionada
        this.highlightRegion(regionId);
        
        // Atualiza UI
        this.updateRegionInfo(regionId, regionData);
        
        // Exibe modal de informações da região
        this.showRegionInfoModal(regionId, regionData);
        
        // Se estiver em tela cheia, faz a transição
        if (this.isFullscreen) {
            this.exitFullscreen();
        }
        
        // NÃO dispara evento de seleção aqui - apenas exibe o modal
        // O evento será disparado apenas quando o usuário confirmar no modal
    }
    
    /**
     * Exibe o modal de informações da região
     * @param {string} regionId - ID da região
     * @param {Object} regionData - Dados da região
     */
    showRegionInfoModal(regionId, regionData) {
        // Obtém dados detalhados da região
        const detailedData = RegionInfoModal.getRegionData(regionId);
        
        // Mescla dados básicos com dados detalhados
        const fullRegionData = {
            ...regionData,
            ...detailedData,
            id: regionId
        };
        
        // Exibe o modal
        if (window.regionInfoModal) {
            window.regionInfoModal.show(fullRegionData);
        }
    }
    
    /**
     * Manipula clique no mapa
     * @param {maplibregl.MapMouseEvent} e - Evento do MapLibre GL JS
     */
    onMapClick(e) {
        // Verifica se o clique foi em um marcador ou popup
        if (e.originalEvent && e.originalEvent.target) {
            const target = e.originalEvent.target;
            // Se clicou em um marcador ou popup, ignora
            if (target.closest('.region-marker') || 
                target.closest('.maplibregl-popup') ||
                target.closest('.maplibregl-marker')) {
                return;
            }
        }
        
        const { lng, lat } = e.lngLat;
        console.log(`Clique no mapa: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        
        // Verifica se pode criar fazenda nesta localização
        if (this.canCreateFarmAt(lat, lng)) {
            this.showFarmCreationDialog(lat, lng);
        } else {
            // Mostra informações da localização
            this.showLocationInfo(lat, lng);
        }
    }
    
    /**
     * Destaca região selecionada
     * @param {string} regionId - ID da região
     */
    highlightRegion(regionId) {
        // Remove destaque anterior
        if (this.selectedRegion) {
            const prevMarker = this.markers.get(this.selectedRegion);
            if (prevMarker) {
                prevMarker.getElement().classList.remove('selected');
            }
        }
        
        // Adiciona destaque à nova região
        const marker = this.markers.get(regionId);
        if (marker) {
            marker.getElement().classList.add('selected');
            this.selectedRegion = regionId;
        }
    }
    
    /**
     * Atualiza informações da região na UI
     * @param {string} regionId - ID da região
     * @param {Object} regionData - Dados da região
     */
    updateRegionInfo(regionId, regionData) {
        const regionNameEl = document.getElementById('region-name');
        const regionTempEl = document.getElementById('region-temp');
        const regionHumidityEl = document.getElementById('region-humidity');
        const regionSolarEl = document.getElementById('region-solar');
        
        if (regionNameEl) regionNameEl.textContent = regionData.name;
        
        // Simula dados climáticos (em produção, viria da NASA API)
        const mockClimate = this.getMockClimateData(regionId);
        if (regionTempEl) regionTempEl.textContent = `${mockClimate.temp}°C`;
        if (regionHumidityEl) regionHumidityEl.textContent = `${mockClimate.humidity}%`;
        if (regionSolarEl) regionSolarEl.textContent = `${mockClimate.solar} kWh/m²`;
    }
    
    /**
     * Verifica se pode criar fazenda na localização
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     * @returns {boolean} True se pode criar fazenda
     */
    canCreateFarmAt(lat, lng) {
        // Verifica se está em terra (simplificado)
        // Em produção, usaria dados geográficos reais
        return Math.abs(lat) < 70; // Não nos polos
    }
    
    /**
     * Mostra informações da localização clicada
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     */
    showLocationInfo(lat, lng) {
        // Cria popup temporário com informações da localização
        const popup = new maplibregl.Popup()
            .setLngLat([lng, lat])
            .setHTML(`
                <div class="location-info-popup">
                    <h4>📍 Localização</h4>
                    <p><strong>Coordenadas:</strong><br>
                    ${lat.toFixed(4)}°, ${lng.toFixed(4)}°</p>
                    <p><em>Clique em uma região destacada para ver informações agrícolas ou criar uma fazenda.</em></p>
                </div>
            `)
            .addTo(this.map);
            
        // Remove o popup após 3 segundos
        setTimeout(() => {
            popup.remove();
        }, 3000);
    }
    
    /**
     * Mostra diálogo de criação de fazenda
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     */
    showFarmCreationDialog(lat, lng) {
        const dialog = document.createElement('div');
        dialog.className = 'farm-creation-dialog';
        dialog.innerHTML = `
            <div class="dialog-content">
                <h3>Criar Nova Fazenda</h3>
                <p>Localização: ${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
                <div class="dialog-buttons">
                    <button class="btn-confirm" onclick="MapSystem.createFarm(${lat}, ${lng})">
                        Criar Fazenda
                    </button>
                    <button class="btn-cancel" onclick="this.parentElement.parentElement.parentElement.remove()">
                        Cancelar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
    }
    
    /**
     * Cria nova fazenda na localização
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     */
    createFarm(lat, lng) {
        const farmElement = document.createElement('div');
        farmElement.className = 'farm-marker';
        farmElement.innerHTML = '<i class="fas fa-tractor"></i>';
        
        const farmMarker = new maplibregl.Marker({
            element: farmElement
        })
        .setLngLat([lng, lat])
        .setPopup(new maplibregl.Popup().setHTML(`
            <div class="farm-popup">
                <h4>Fazenda #${this.farmMarkers.length + 1}</h4>
                <p>Localização: ${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
                <button onclick="FarmSystem.openFarm(${this.farmMarkers.length})">
                    Gerenciar Fazenda
                </button>
            </div>
        `))
        .addTo(this.map);
        
        this.farmMarkers.push(farmMarker);
        
        // Remove diálogo
        const dialog = document.querySelector('.farm-creation-dialog');
        if (dialog) dialog.remove();
        
        Utils.showNotification('Fazenda criada com sucesso!', 'success');
    }
    
    /**
     * Obtém localização do usuário
     */
    getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    this.map.flyTo({
                        center: [longitude, latitude],
                        zoom: 8
                    });
                    
                    // Adiciona marcador da localização
                    new maplibregl.Marker()
                        .setLngLat([longitude, latitude])
                        .setPopup(new maplibregl.Popup().setHTML('Sua localização'))
                        .addTo(this.map)
                        .togglePopup();
                },
                (error) => {
                    console.error('Erro ao obter localização:', error);
                    Utils.showNotification('Não foi possível obter sua localização', 'warning');
                }
            );
        } else {
            Utils.showNotification('Geolocalização não suportada', 'error');
        }
    }
    
    /**
     * Alterna visibilidade das camadas climáticas
     */
    toggleClimateLayers() {
        if (this.map.getLayer('climate-layer')) {
            this.map.removeLayer('climate-layer');
            this.map.removeSource('climate-data');
        } else {
            this.addNASAClimateLayer();
        }
    }
    
    /**
     * Atualiza visibilidade dos marcadores baseado no zoom
     */
    updateMarkersVisibility() {
        const zoom = this.map.getZoom();
        const showDetails = zoom > 4;
        
        this.markers.forEach(marker => {
            const element = marker.getElement();
            if (element) {
                element.classList.toggle('detailed', showDetails);
            }
        });
    }
    
    /**
     * Obtém dados climáticos simulados para região
     * @param {string} regionId - ID da região
     * @returns {Object} Dados climáticos simulados
     */
    getMockClimateData(regionId) {
        const baseData = {
            northAmerica: { temp: 22, humidity: 65, solar: 5.5 },
            southAmerica: { temp: 28, humidity: 75, solar: 6.2 },
            europe: { temp: 18, humidity: 60, solar: 4.8 },
            asia: { temp: 25, humidity: 70, solar: 5.8 },
            africa: { temp: 32, humidity: 45, solar: 7.2 },
            oceania: { temp: 24, humidity: 55, solar: 6.0 }
        };
        
        return baseData[regionId] || { temp: 20, humidity: 50, solar: 5.0 };
    }
    
    /**
     * Obtém label do clima
     * @param {string} climate - Tipo de clima
     * @returns {string} Label traduzido
     */
    getClimateLabel(climate) {
        const labels = {
            temperate: 'Temperado',
            tropical: 'Tropical',
            arid: 'Árido',
            varied: 'Variado'
        };
        return labels[climate] || climate;
    }
    
    /**
     * Obtém label do bônus
     * @param {string} bonusType - Tipo de bônus
     * @returns {string} Label traduzido
     */
    getBonusLabel(bonusType) {
        const labels = {
            yield: 'Produtividade',
            growth: 'Crescimento',
            efficiency: 'Eficiência',
            sustainability: 'Sustentabilidade',
            resilience: 'Resistência',
            innovation: 'Inovação'
        };
        return labels[bonusType] || bonusType;
    }
    

    
    /**
     * Atualiza o sistema de mapa (chamado pelo game loop)
     * @param {number} deltaTime - Tempo decorrido desde a última atualização
     */
    update(deltaTime) {
        if (!this.isInitialized || !this.map) return;
        
        try {
            // Atualiza visibilidade dos marcadores baseado no zoom
            this.updateMarkersVisibility();
            
            // Atualiza informações das regiões se necessário
            if (this.selectedRegion) {
                const regionData = this.regions.get(this.selectedRegion);
                if (regionData) {
                    this.updateRegionInfo(this.selectedRegion, regionData);
                }
            }
            
        } catch (error) {
            console.error('❌ Erro ao atualizar sistema de mapa:', error);
        }
    }
    
    /**
     * Limpa recursos do sistema
     */
    destroy() {
        if (this.map) {
            this.map.remove();
            this.map = null;
        }
        
        this.markers.clear();
        this.regions.clear();
        this.farmMarkers = [];
        this.isInitialized = false;
    }
}

// Exporta a classe globalmente
if (typeof window !== 'undefined') {
    window.MapSystem = MapSystem;
    
    /**
     * Função global para selecionar região (para uso em HTML)
     * @param {string} regionId - ID da região
     */
    window.selectRegion = function(regionId) {
        if (window.gameInstance && window.gameInstance.mapSystem) {
            const regionData = window.gameInstance.mapSystem.regions.get(regionId);
            if (regionData) {
                window.gameInstance.mapSystem.onRegionClick(regionId, regionData);
            }
        }
    };
    
    /**
     * Função global para criar fazenda (para uso em HTML)
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     */
    window.createFarm = function(lat, lng) {
        if (window.gameInstance && window.gameInstance.mapSystem) {
            window.gameInstance.mapSystem.createFarm(lat, lng);
        }
    };
}