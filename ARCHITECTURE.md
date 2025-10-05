# NASA Farm Navigators - Arquitetura do Projeto

## 🎯 Visão Geral
Jogo estilo Top Crop com mapa mundial interativo utilizando dados reais da NASA para agricultura global.

## 🏗️ Arquitetura Técnica

### Tecnologias Utilizadas
- **HTML5**: Estrutura base e Canvas para renderização
- **CSS3**: Estilização responsiva e animações
- **JavaScript ES6+**: Lógica principal do jogo
- **Phaser.js 3.70**: Engine de jogo para mecânicas de fazenda
- **Leaflet.js**: Mapa mundial interativo
- **Three.js**: Efeitos visuais 3D
- **jQuery**: Manipulação DOM e AJAX
- **NASA APIs**: Dados climáticos e de solo em tempo real

### Estrutura de Pastas
```
nasa-farm-navigators/
├── index.html                 # Página principal
├── css/
│   ├── main.css              # Estilos principais
│   ├── ui.css                # Interface do usuário
│   └── animations.css        # Animações CSS3
├── js/
│   ├── core/
│   │   ├── game.js           # Inicialização do jogo
│   │   ├── config.js         # Configurações globais
│   │   └── utils.js          # Utilitários
│   ├── systems/
│   │   ├── map-system.js     # Sistema de mapa mundial
│   │   ├── farm-system.js    # Sistema de fazendas
│   │   ├── weather-system.js # Sistema climático
│   │   ├── economy-system.js # Sistema econômico
│   │   └── tech-system.js    # Sistema de tecnologia
│   ├── data/
│   │   ├── nasa-api.js       # Integração APIs NASA
│   │   ├── crops-data.js     # Dados de culturas
│   │   └── regions-data.js   # Dados regionais
│   ├── ui/
│   │   ├── hud.js            # Interface principal
│   │   ├── panels.js         # Painéis de controle
│   │   └── modals.js         # Janelas modais
│   └── main.js               # Arquivo principal
├── assets/
│   ├── images/
│   │   ├── crops/            # Imagens de culturas
│   │   ├── ui/               # Elementos de interface
│   │   └── effects/          # Efeitos visuais
│   ├── sounds/               # Efeitos sonoros
│   └── data/
│       ├── world-regions.json # Regiões mundiais
│       └── crop-varieties.json # Variedades de culturas
└── docs/
    ├── API.md                # Documentação da API
    └── GAMEPLAY.md           # Mecânicas de jogo
```

## 🎮 Componentes Principais

### 1. Sistema de Mapa Mundial (Leaflet.js)
- Mapa interativo com regiões agrícolas
- Zoom e navegação fluida
- Marcadores de fazendas ativas
- Overlay de dados climáticos

### 2. Sistema de Fazendas (Phaser.js)
- Plantio e colheita de múltiplas culturas
- Crescimento baseado em dados reais
- Gestão de recursos (água, fertilizantes)
- Tecnologias sustentáveis

### 3. Sistema Climático (NASA APIs)
- Dados meteorológicos em tempo real
- Previsões climáticas
- Eventos extremos (secas, enchentes)
- Impacto no crescimento das culturas

### 4. Sistema Econômico
- Preços globais de commodities
- Mercados regionais
- Oferta e demanda dinâmica
- Contratos futuros

### 5. Sistema de Tecnologia
- Painéis solares e energia renovável
- Sistemas de irrigação inteligente
- Drones para monitoramento
- Agricultura de precisão

## 🔄 Fluxo de Dados

1. **Inicialização**: Carrega dados base e configurações
2. **Seleção de Região**: Jogador escolhe área no mapa mundial
3. **Dados NASA**: Busca informações climáticas da região
4. **Simulação**: Executa mecânicas de fazenda baseadas em dados reais
5. **Economia**: Atualiza preços e mercados globais
6. **Progressão**: Salva progresso e desbloqueia tecnologias

## 📊 APIs da NASA Utilizadas

### 1. NASA Earth Data
- **URL**: `https://api.nasa.gov/planetary/earth/`
- **Dados**: Imagens de satélite, índices de vegetação

### 2. NASA Power API
- **URL**: `https://power.larc.nasa.gov/api/`
- **Dados**: Radiação solar, temperatura, precipitação

### 3. NASA MODIS
- **URL**: `https://modis.gsfc.nasa.gov/data/`
- **Dados**: Cobertura vegetal, umidade do solo

### 4. NASA GISS
- **URL**: `https://data.giss.nasa.gov/`
- **Dados**: Dados climáticos históricos

## 🎯 Mecânicas de Jogo

### Objetivos Principais
1. **Sustentabilidade**: Manter fazendas ecologicamente viáveis
2. **Produtividade**: Maximizar rendimento das culturas
3. **Economia**: Gerenciar recursos e lucros
4. **Tecnologia**: Pesquisar e implementar inovações

### Progressão
- **Níveis**: Baseados em sustentabilidade e produtividade
- **Desbloqueios**: Novas regiões, culturas e tecnologias
- **Conquistas**: Marcos de sustentabilidade e eficiência

## 🔧 Configurações Técnicas

### Performance
- Lazy loading de assets
- Otimização de renderização
- Cache de dados da NASA
- Compressão de imagens

### Responsividade
- Design mobile-first
- Breakpoints para tablet e desktop
- Touch controls para dispositivos móveis
- Redimensionamento dinâmico

### Acessibilidade
- Suporte a leitores de tela
- Controles por teclado
- Alto contraste
- Legendas para efeitos sonoros