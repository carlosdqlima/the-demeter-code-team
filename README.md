# 🌍 NASA Farm Navigators

## Jogo de Agricultura Global com Dados Reais da NASA

**NASA Farm Navigators** é um jogo de simulação agrícola inovador que combina mecânicas de jogo estilo Top Crop com dados climáticos e geográficos reais da NASA. Os jogadores gerenciam fazendas ao redor do mundo, tomando decisões baseadas em informações científicas reais sobre clima, solo e sustentabilidade.

![NASA Farm Navigators](assets/images/ui/banner.png)

## 🎯 Características Principais

### 🌐 **Mapa Mundial Interativo**
- Mapa global interativo usando Leaflet.js
- Regiões agrícolas baseadas em dados geográficos reais
- Visualização de dados climáticos em tempo real
- Seleção de localizações para criação de fazendas

### 🛰️ **Integração com APIs da NASA**
- **NASA Earth Data**: Imagens de satélite e índices de vegetação
- **NASA Power API**: Dados de radiação solar, temperatura e precipitação
- **NASA MODIS**: Cobertura vegetal e umidade do solo
- **NASA GISS**: Dados climáticos históricos

### 🚜 **Sistema de Fazendas Avançado**
- Plantio e colheita de múltiplas culturas
- Crescimento baseado em condições climáticas reais
- Gestão de recursos (água, fertilizantes, energia)
- Tecnologias sustentáveis (painéis solares, irrigação inteligente)

### 📊 **Economia Global Dinâmica**
- Preços de commodities baseados em mercados reais
- Oferta e demanda regional
- Contratos futuros e especulação
- Impacto de eventos climáticos nos preços

### 🌱 **Sustentabilidade e Tecnologia**
- Sistema de pontuação de sustentabilidade
- Pesquisa e desenvolvimento de tecnologias
- Agricultura de precisão com drones
- Energias renováveis e eficiência energética

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **HTML5**: Estrutura semântica e Canvas para renderização
- **CSS3**: Estilização responsiva com Grid e Flexbox
- **JavaScript ES6+**: Lógica principal e programação orientada a objetos

### **Bibliotecas e Frameworks**
- **Phaser.js 3.70**: Engine de jogo para mecânicas de fazenda
- **Leaflet.js**: Mapa mundial interativo
- **Three.js**: Efeitos visuais 3D
- **jQuery**: Manipulação DOM e AJAX
- **Font Awesome**: Ícones vetoriais

### **APIs e Dados**
- **NASA APIs**: Dados climáticos e geográficos em tempo real
- **OpenStreetMap**: Tiles de mapa base
- **Dados Simulados**: Fallback para modo offline

## 🏗️ Arquitetura do Projeto

```
nasa-farm-navigators/
├── index.html                 # Página principal
├── css/
│   ├── main.css              # Estilos principais
│   ├── ui.css                # Interface do usuário
│   └── animations.css        # Animações CSS3
├── js/
│   ├── core/
│   │   ├── config.js         # Configurações globais
│   │   ├── utils.js          # Utilitários
│   │   └── game.js           # Inicialização do jogo
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
│   ├── images/               # Imagens do jogo
│   ├── sounds/               # Efeitos sonoros
│   └── data/                 # Dados estáticos
└── docs/
    ├── ARCHITECTURE.md       # Documentação da arquitetura
    ├── API.md                # Documentação da API
    └── GAMEPLAY.md           # Mecânicas de jogo
```

## 🚀 Como Executar

### **Pré-requisitos**
- Navegador moderno com suporte a ES6+
- Servidor web local (Python, Node.js, ou similar)
- Conexão com internet para APIs da NASA

### **Instalação**

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/nasa-farm-navigators.git
   cd nasa-farm-navigators
   ```

2. **Configure a API Key da NASA**
   - Obtenha uma chave gratuita em: https://api.nasa.gov/
   - Edite `js/core/config.js` e substitua `DEMO_KEY` pela sua chave

3. **Inicie um servidor local**
   
   **Usando Node.js:**
   ```bash
   npx serve .
   ```
   
   **Usando Python:**
   ```bash
   python -m http.server 8000
   ```

4. **Acesse o jogo**
   - Abra `http://localhost:3000` (Node.js) ou `http://localhost:8000` (Python)

## 🎮 Como Jogar

### **Primeiros Passos**
1. **Explore o Mapa**: Use o mapa mundial para navegar entre regiões
2. **Selecione uma Região**: Clique em uma região para ver dados climáticos
3. **Crie uma Fazenda**: Clique no mapa para criar sua primeira fazenda
4. **Plante Culturas**: Use os botões de ação para plantar diferentes culturas

### **Mecânicas Principais**

#### **🌱 Agricultura**
- **Plantio**: Selecione culturas adequadas ao clima da região
- **Crescimento**: Plantas crescem baseadas em dados climáticos reais
- **Colheita**: Colha no momento certo para maximizar lucros
- **Rotação**: Pratique rotação de culturas para manter solo saudável

#### **💰 Economia**
- **Mercados**: Monitore preços globais de commodities
- **Vendas**: Venda suas colheitas no melhor momento
- **Investimentos**: Invista em tecnologias para aumentar eficiência
- **Contratos**: Negocie contratos futuros para garantir preços

#### **🔬 Tecnologia**
- **Pesquisa**: Desenvolva novas tecnologias agrícolas
- **Sustentabilidade**: Implemente práticas sustentáveis
- **Automação**: Use drones e IA para otimizar operações
- **Energia**: Invista em energias renováveis

### **Sistema de Pontuação**
- **Produtividade**: Quantidade de alimentos produzidos
- **Sustentabilidade**: Impacto ambiental das práticas
- **Eficiência**: Uso otimizado de recursos
- **Inovação**: Adoção de novas tecnologias

## 🌍 Dados da NASA Utilizados

### **Dados Climáticos**
- **Temperatura**: Máximas, mínimas e médias diárias
- **Precipitação**: Dados de chuva e umidade
- **Radiação Solar**: Energia solar disponível
- **Vento**: Velocidade e direção do vento

### **Dados de Solo**
- **Umidade**: Níveis de água no solo
- **Temperatura**: Temperatura do solo
- **Composição**: Tipos de solo e nutrientes
- **Erosão**: Riscos de degradação

### **Dados de Vegetação**
- **NDVI**: Índice de vegetação normalizado
- **Cobertura**: Percentual de cobertura vegetal
- **Saúde**: Indicadores de saúde das plantas
- **Crescimento**: Taxas de crescimento sazonal

## 🎨 Interface do Usuário

### **Layout Responsivo**
- **Desktop**: Layout de três colunas com mapa, jogo e controles
- **Tablet**: Layout adaptativo com painéis recolhíveis
- **Mobile**: Interface otimizada para toque

### **Componentes Principais**
- **Header**: Estatísticas do jogador e controles globais
- **Mapa Mundial**: Navegação e seleção de regiões
- **Área de Jogo**: Visualização das fazendas
- **Painéis Laterais**: Controles e informações
- **Footer**: Status do jogo e conexão

### **Temas e Cores**
- **Paleta NASA**: Azul espacial (#0b3d91) e vermelho NASA (#fc3d21)
- **Cores Naturais**: Verdes para agricultura, azuis para água
- **Modo Escuro**: Interface otimizada para longas sessões
- **Alto Contraste**: Acessibilidade para deficientes visuais

## 📱 Responsividade

### **Breakpoints**
- **Desktop**: > 1200px - Layout completo
- **Tablet**: 768px - 1200px - Layout adaptativo
- **Mobile**: < 768px - Layout simplificado

### **Otimizações Mobile**
- **Touch Controls**: Gestos otimizados para toque
- **Performance**: Renderização otimizada para dispositivos móveis
- **Conectividade**: Modo offline com dados simulados
- **Bateria**: Otimizações para economizar energia

## 🔧 Configuração Avançada

### **Configurações de Jogo**
```javascript
// js/core/config.js
const GameConfig = {
    gameplay: {
        timeScale: 1,           // Velocidade do jogo
        startingMoney: 50000,   // Dinheiro inicial
        difficulty: 'normal'    // Dificuldade
    },
    nasa: {
        apiKey: 'SUA_CHAVE_AQUI',
        rateLimit: 1000,        // ms entre requisições
        timeout: 10000          // timeout em ms
    }
};
```

### **Personalização de Culturas**
```javascript
// js/data/crops-data.js
const crops = {
    wheat: {
        growthTime: 15000,      // Tempo de crescimento
        optimalTemp: [15, 25],  // Temperatura ideal
        waterNeeds: 'medium',   // Necessidade de água
        price: 150              // Preço base
    }
};
```

## 🧪 Desenvolvimento

### **Estrutura de Desenvolvimento**
```bash
# Instalar dependências de desenvolvimento
npm install -g live-server

# Executar em modo desenvolvimento
live-server --port=3000

# Executar testes
npm test

# Build para produção
npm run build
```

### **Padrões de Código**
- **ES6+**: Uso de classes, arrow functions e async/await
- **Modularização**: Cada sistema em arquivo separado
- **Documentação**: JSDoc para todas as funções
- **Nomenclatura**: camelCase para variáveis, PascalCase para classes

### **Performance**
- **Lazy Loading**: Carregamento sob demanda de assets
- **Cache**: Sistema de cache para APIs da NASA
- **Otimização**: Minificação e compressão para produção
- **Monitoramento**: Métricas de performance em tempo real

## 🤝 Contribuição

### **Como Contribuir**
1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### **Diretrizes**
- Siga os padrões de código estabelecidos
- Adicione testes para novas funcionalidades
- Documente mudanças no README
- Mantenha commits pequenos e focados

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- **NASA**: Pelos dados abertos e APIs gratuitas
- **OpenStreetMap**: Pelos tiles de mapa
- **Phaser.js**: Pela excelente engine de jogos
- **Leaflet.js**: Pela biblioteca de mapas
- **Comunidade Open Source**: Por todas as bibliotecas utilizadas

## 📞 Contato

- **Desenvolvedor**: Seu Nome
- **Email**: seu.email@exemplo.com
- **GitHub**: [@seu-usuario](https://github.com/seu-usuario)
- **LinkedIn**: [Seu Perfil](https://linkedin.com/in/seu-perfil)

---

**🌍 Construindo o futuro da agricultura com dados da NASA! 🚀**