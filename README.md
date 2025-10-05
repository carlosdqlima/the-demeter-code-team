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

### **APIs and Data**
- **NASA APIs**: Real-time climate and geographic data
- **OpenStreetMap**: Base map tiles
- **Simulated Data**: Fallback for offline mode

## 🏗️ Project Architecture

```
nasa-farm-navigators/
├── index.html                 # Main page
├── css/
│   ├── main.css              # Main styles
│   ├── ui.css                # User interface
│   └── animations.css        # CSS3 animations
├── js/
│   ├── core/
│   │   ├── config.js         # Global configurations
│   │   ├── utils.js          # Utilities
│   │   └── game.js           # Game initialization
│   ├── systems/
│   │   ├── map-system.js     # World map system
│   │   ├── farm-system.js    # Farm system
│   │   ├── weather-system.js # Weather system
│   │   ├── economy-system.js # Economic system
│   │   └── tech-system.js    # Technology system
│   ├── data/
│   │   ├── nasa-api.js       # NASA APIs integration
│   │   ├── crops-data.js     # Crop data
│   │   └── regions-data.js   # Regional data
│   ├── ui/
│   │   ├── hud.js            # Main interface
│   │   ├── panels.js         # Control panels
│   │   └── modals.js         # Modal windows
│   └── main.js               # Main file
├── assets/
│   ├── images/               # Game images
│   ├── sounds/               # Sound effects
│   └── data/                 # Static data
└── docs/
    ├── ARCHITECTURE.md       # Architecture documentation
    ├── API.md                # API documentation
    └── GAMEPLAY.md           # Game mechanics
```

## 🚀 How to Run

### **Prerequisites**
- Modern browser with ES6+ support
- Local web server (Python, Node.js, or similar)
- Internet connection for NASA APIs

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nasa-farm-navigators.git
   cd nasa-farm-navigators
   ```

2. **Configure NASA API Key**
   - Get a free key at: https://api.nasa.gov/
   - Edit `js/core/config.js` and replace `DEMO_KEY` with your key

3. **Start a local server**
   
   **Using Node.js:**
   ```bash
   npx serve .
   ```
   
   **Using Python:**
   ```bash
   python -m http.server 8000
   ```

4. **Access the game**
   - Open `http://localhost:3000` (Node.js) or `http://localhost:8000` (Python)

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

### **Development Structure**
```bash
# Install development dependencies
npm install -g live-server

# Run in development mode
live-server --port=3000

# Run tests
npm test

# Build for production
npm run build
```

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