# 🌍 FarmVerse

## Global Agriculture Game with Real NASA Data

**FarmVerse** is an innovative agricultural simulation game that combines Top Crop-style game mechanics with real climate and geographic data from NASA. Players manage farms around the world, making decisions based on real scientific information about climate, soil, and sustainability.

![FarmVerse](assets/images/ui/banner.png)

## 🎯 Main Features

### 🌐 **Interactive World Map**
- Interactive global map using Leaflet.js
- Agricultural regions based on real geographic data
- Real-time climate data visualization
- Location selection for farm creation

### 🛰️ **NASA APIs Integration**
- **NASA Earth Data**: Satellite imagery and vegetation indices
- **NASA Power API**: Solar radiation, temperature and precipitation data
- **NASA MODIS**: Vegetation cover and soil moisture
- **NASA GISS**: Historical climate data

### 🚜 **Advanced Farm System**
- Planting and harvesting multiple crops
- Growth based on real climate conditions
- Resource management (water, fertilizers, energy)
- Sustainable technologies (solar panels, smart irrigation)

### 📊 **Dynamic Global Economy**
- Commodity prices based on real markets
- Regional supply and demand
- Futures contracts and speculation
- Impact of climate events on prices

### 🌱 **Sustainability and Technology**
- Sustainability scoring system
- Technology research and development
- Precision agriculture with drones
- Renewable energy and energy efficiency

## 🛠️ Technologies Used

### **Frontend**
- **HTML5**: Semantic structure and Canvas for rendering
- **CSS3**: Responsive styling with Grid and Flexbox
- **JavaScript ES6+**: Main logic and object-oriented programming

### **Libraries and Frameworks**
- **Phaser.js 3.70**: Game engine for farm mechanics
- **Leaflet.js**: Interactive world map
- **Three.js**: 3D visual effects
- **jQuery**: DOM manipulation and AJAX
- **Font Awesome**: Vector icons

### **Backend & Development Tools**
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web application framework
- **Socket.IO**: Real-time bidirectional communication
- **SQLite3**: Lightweight database for data persistence
- **Vite**: Fast build tool and development server
- **Vitest**: Unit testing framework
- **ESLint**: Code linting and quality assurance
- **Prettier**: Code formatting
- **dotenv**: Environment variables management
- **Axios**: HTTP client for API requests

### **APIs and Data**
- **NASA APIs**: Real-time climate and geographic data
  - MODIS Terra/Aqua satellite data
  - VIIRS vegetation indices
  - Landsat imagery
  - Climate data and weather patterns
- **OpenStreetMap**: Base map tiles
- **Simulated Data**: Fallback for offline mode

## 🏗️ Project Architecture

```
nasa-farm-navigators/
├── index.html                 # Main page
├── package.json              # Node.js dependencies and scripts
├── vite.config.js            # Vite build configuration
├── vitest.config.js          # Testing configuration
├── .env.example              # Environment variables template
├── css/
│   ├── main.css              # Main styles
│   ├── ui.css                # User interface
│   ├── animations.css        # CSS3 animations
│   ├── farm-html.css         # Farm HTML interface styles
│   ├── farm-visual.css       # Visual farm system styles
│   └── style.css             # Additional styles
├── js/
│   ├── core/
│   │   ├── config.js         # Global configurations
│   │   ├── utils.js          # Utilities
│   │   └── game.js           # Game initialization
│   ├── systems/
│   │   ├── map-system.js     # World map system
│   │   ├── farm-system.js    # Basic farm system
│   │   ├── visual-farm-system.js # Advanced visual farm system
│   │   ├── html-farm-system.js   # HTML-based farm interface
│   │   ├── weather-system.js # Weather system
│   │   ├── economy-system.js # Economic system
│   │   ├── crops-system.js   # Crop management system
│   │   ├── tech-system.js    # Technology system
│   │   ├── agriculture-decision-engine.js # AI decision support
│   │   ├── crop-monitoring-nasa.js # NASA crop monitoring
│   │   ├── farm-persistence.js # Save/load system
│   │   ├── farm-integration.js # Farm system integration
│   │   ├── nasa-data-integration.js # Enhanced NASA integration
│   │   ├── problem-indicators.js # Problem detection system
│   │   ├── glossary-system.js # Educational glossary
│   │   └── region-info-modal.js # Regional information
│   ├── data/
│   │   ├── nasa-api.js       # NASA APIs integration
│   │   ├── crops-data.js     # Crop data
│   │   └── regions-data.js   # Regional data
│   ├── ui/
│   │   ├── hud.js            # Main interface
│   │   ├── panels.js         # Control panels
│   │   └── modals.js         # Modal windows
│   ├── effects/              # Visual effects
│   ├── location-enhancement.js # Location enhancement features
│   ├── phaser.min.js         # Phaser game engine
│   └── main.js               # Main file
├── server/                   # Node.js backend
│   ├── index.js              # Express server
│   └── routes/               # API routes
│       ├── data.js           # Data endpoints
│       ├── farm.js           # Farm endpoints
│       ├── nasa.js           # NASA API proxy
│       └── weather.js        # Weather endpoints
├── assets/
│   ├── images/               # Game images
│   │   ├── crops/            # Crop sprites
│   │   ├── effects/          # Visual effects
│   │   ├── icons/            # UI icons
│   │   └── ui/               # Interface elements
│   ├── sounds/               # Sound effects
│   └── data/                 # Static data
├── tests/                    # Test files
│   └── setup.js              # Test configuration
└── docs/
    ├── ARCHITECTURE.md       # Architecture documentation
    ├── API.md                # API documentation
    ├── GAMEPLAY.md           # Game mechanics
    ├── README-NODEJS.md      # Node.js setup guide
    ├── nasa-resources.md     # NASA resources documentation
    └── paleta-cores.md       # Color palette guide
```

## 🚀 How to Run

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js 16+ (for backend features)
- npm or yarn package manager

### Quick Start (Frontend Only)
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/nasa-farm-navigators.git
   cd nasa-farm-navigators
   ```

2. **Start a local server**:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server -p 8000
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Access the game**:
   Open your browser and go to `http://localhost:8000`

### Full Stack Setup (Recommended)
1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your NASA API keys and configurations
   ```

3. **Development mode**:
   ```bash
   npm run dev
   ```

4. **Production build**:
   ```bash
   npm run build
   npm run preview
   ```

5. **Run tests**:
   ```bash
   npm test
   ```

### Backend Server
The project includes a Node.js backend with the following features:
- **API Proxy**: Secure NASA API access
- **Data Persistence**: SQLite database for farm data
- **Real-time Updates**: Socket.IO for live data
- **RESTful APIs**: Farm management endpoints

To start the backend server:
```bash
npm run server
```

### Alternative Methods
- **Live Server (VS Code)**: Use the Live Server extension
- **XAMPP/WAMP**: Place files in the htdocs folder
- **GitHub Pages**: Deploy frontend to GitHub Pages
- **Vercel/Netlify**: Deploy with build commands

## 🎮 How to Play

### **Getting Started**
1. **Explore the Map**: Use the world map to navigate between regions
2. **Select a Region**: Click on a region to see climate data
3. **Create a Farm**: Click on the map to create your first farm
4. **Plant Crops**: Use action buttons to plant different crops

### **Main Mechanics**

#### **🌱 Agriculture**
- **Planting**: Select crops suitable for the region's climate
- **Growth**: Plants grow based on real climate data
- **Harvest**: Harvest at the right time to maximize profits
- **Rotation**: Practice crop rotation to maintain healthy soil

#### **💰 Economy**
- **Markets**: Monitor global commodity prices
- **Sales**: Sell your harvests at the best time
- **Investments**: Invest in technologies to increase efficiency
- **Contracts**: Negotiate futures contracts to secure prices

#### **🔬 Technology**
- **Research**: Develop new agricultural technologies
- **Sustainability**: Implement sustainable practices
- **Automation**: Use drones and AI to optimize operations
- **Energy**: Invest in renewable energy

### **Scoring System**
- **Productivity**: Amount of food produced
- **Sustainability**: Environmental impact of practices
- **Efficiency**: Optimized use of resources
- **Innovation**: Adoption of new technologies

## 🚀 Advanced Features

### **Visual Farm System**
- **Interactive Canvas**: Advanced farm visualization with zoom and pan
- **Grid-based Layout**: Precise crop placement and management
- **Real-time Rendering**: Smooth animations and visual feedback
- **Tool System**: Multiple interaction modes (plant, harvest, inspect)

### **AI Decision Engine**
- **Smart Recommendations**: AI-powered farming suggestions based on NASA data
- **Sustainability Metrics**: Environmental impact tracking
- **Problem Detection**: Automatic identification of agricultural issues
- **Optimization Algorithms**: Yield and efficiency optimization

### **NASA Data Integration**
- **Real-time Satellite Data**: MODIS Terra/Aqua imagery
- **Vegetation Indices**: NDVI and EVI monitoring
- **Climate Monitoring**: Temperature, precipitation, and weather patterns
- **Soil Analysis**: Moisture content and quality assessment

### **Persistence System**
- **Auto-save**: Automatic game state preservation
- **Cloud Sync**: Optional cloud-based save synchronization
- **Export/Import**: Farm data backup and sharing
- **Version Control**: Save state history and rollback

### **Educational Components**
- **Interactive Glossary**: Agricultural and NASA terminology
- **Regional Information**: Detailed climate and geography data
- **Problem Indicators**: Visual alerts for agricultural challenges
- **Learning Resources**: Links to NASA educational materials

## 🌍 NASA Data Used

### **Climate Data**
- **Temperature**: Daily maximum, minimum and average temperatures
- **Precipitation**: Rain and humidity data
- **Solar Radiation**: Available solar energy
- **Wind**: Wind speed and direction

### **Soil Data**
- **Moisture**: Soil water levels
- **Temperature**: Soil temperature
- **Composition**: Soil types and nutrients
- **Erosion**: Degradation risks

### **Vegetation Data**
- **NDVI**: Normalized Difference Vegetation Index
- **Coverage**: Percentage of vegetation cover
- **Health**: Plant health indicators
- **Growth**: Seasonal growth rates

## 🎨 User Interface

### **Main Interface**
- **Interactive World Map**: Leaflet.js with NASA data layers
- **Visual Farm System**: Advanced Canvas-based farm visualization
- **Dual View System**: Toggle between world map and farm views
- **Control Panel**: Comprehensive farm management tools
- **Data Visualization**: Real-time charts and graphs with NASA integration
- **Modal Windows**: Detailed information and settings
- **Responsive Design**: Adapts to different screen sizes

### **Visual Farm Interface**
- **Canvas Rendering**: High-performance 2D graphics with zoom and pan
- **Grid-based Layout**: Precise crop placement and management
- **Interactive Tools**: Plant, harvest, water, and fertilize tools
- **Real-time Animations**: Smooth crop growth and weather effects
- **Visual Feedback**: Hover effects, selection indicators, and status icons
- **Particle Systems**: Visual effects for actions and environmental changes

### **Enhanced Visual Elements**
- **Modern Design**: Clean and intuitive interface with glassmorphism effects
- **Smooth Animations**: CSS3 transitions, keyframe animations, and Canvas effects
- **Interactive Icons**: Font Awesome with enhanced hover and selection states
- **Color Coding**: Advanced visual indicators for crop health, soil conditions, and weather
- **Loading States**: Animated progress indicators and skeleton screens
- **Status Indicators**: Real-time visual feedback for farm conditions and NASA data
- **Responsive Animations**: Adaptive visual effects based on screen size and performance

### **Advanced UI Components**
- **Tool Selector**: Visual tool palette with icons and descriptions
- **Crop Management**: Interactive crop selection with growth stage visualization
- **Farm Information Overlay**: Real-time data display with NASA integration
- **Problem Indicators**: Visual alerts for agricultural challenges
- **Educational Tooltips**: Contextual information and NASA data explanations

### **Responsive Layout**
- **Desktop**: Three-column layout with map, game and controls
- **Tablet**: Adaptive layout with collapsible panels
- **Mobile**: Touch-optimized interface

### **Main Components**
- **Header**: Player statistics and global controls
- **World Map**: Navigation and region selection
- **Game Area**: Farm visualization
- **Side Panels**: Controls and information
- **Footer**: Game status and connection

### **Themes and Colors**
- **NASA Palette**: Space blue (#0b3d91) and NASA red (#fc3d21)
- **Natural Colors**: Greens for agriculture, blues for water
- **Dark Mode**: Interface optimized for long sessions
- **High Contrast**: Accessibility for visually impaired

## 📱 Responsiveness

### **Breakpoints**
- **Desktop**: > 1200px - Full layout
- **Tablet**: 768px - 1200px - Adaptive layout
- **Mobile**: < 768px - Simplified layout

### **Mobile Optimizations**
- **Touch Controls**: Touch-optimized gestures
- **Performance**: Optimized rendering for mobile devices
- **Connectivity**: Offline mode with simulated data
- **Battery**: Optimizations to save energy

## 🔧 Advanced Configuration

### **Game Settings**
```javascript
// js/core/config.js
const GameConfig = {
    gameplay: {
        timeScale: 1,           // Game speed
        startingMoney: 50000,   // Starting money
        difficulty: 'normal'    // Difficulty
    },
    nasa: {
        apiKey: 'YOUR_KEY_HERE',
        rateLimit: 1000,        // ms between requests
        timeout: 10000          // timeout in ms
    }
};
```

### **Crop Customization**
```javascript
// js/data/crops-data.js
const crops = {
    wheat: {
        growthTime: 15000,      // Growth time
        optimalTemp: [15, 25],  // Optimal temperature
        waterNeeds: 'medium',   // Water requirements
        price: 150              // Base price
    }
};
```

## 🧪 Development

### **Code Structure**
- **Modular Architecture**: Organized in logical modules
- **ES6+ Standards**: Modern JavaScript with classes and modules
- **Responsive Design**: Mobile-first approach
- **Performance Optimization**: Lazy loading and caching
- **Accessibility**: WCAG 2.1 compliance

### **Development Tools**
- **Build System**: Vite for fast development and building
- **Testing Framework**: Vitest for unit and integration tests
- **Code Quality**: ESLint and Prettier for consistent code style
- **Version Control**: Git with semantic commits
- **Documentation**: JSDoc for code documentation
- **Environment Management**: dotenv for configuration
- **Package Management**: npm with lock files for reproducible builds

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run test suite
npm run test:watch   # Run tests in watch mode
npm run lint         # Check code quality
npm run format       # Format code with Prettier
npm run server       # Start backend server
```

### **Development Workflow**
1. **Setup**: Clone repository and install dependencies
2. **Environment**: Configure `.env` file with API keys
3. **Development**: Use `npm run dev` for hot reloading
4. **Testing**: Write and run tests with `npm test`
5. **Quality**: Ensure code quality with `npm run lint`
6. **Build**: Create production build with `npm run build`
7. **Deploy**: Deploy to hosting platform of choice

### **Code Standards**
- **ES6+**: Use of classes, arrow functions and async/await
- **Modularization**: Each system in separate file
- **Documentation**: JSDoc for all functions
- **Naming**: camelCase for variables, PascalCase for classes

### **Performance**
- **Lazy Loading**: On-demand asset loading
- **Cache**: Cache system for NASA APIs
- **Optimization**: Minification and compression for production
- **Monitoring**: Real-time performance metrics

## 🤝 Contributing

### **How to Contribute**
1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### **Guidelines**
- Follow established code standards
- Add tests for new features
- Document changes in README
- Keep commits small and focused

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NASA**: For open data and free APIs
- **OpenStreetMap**: For map tiles
- **Leaflet.js**: For the mapping library
- **Open Source Community**: For all the libraries used

---

**🌍 Building the future of agriculture with NASA data! 🚀**