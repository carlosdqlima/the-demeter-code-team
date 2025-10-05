/**
 * Configuração dos principais países do mundo
 * Dados dos países com maior potencial agrícola global
 */

const regionsConfig = {
    'brazil': {
        name: 'Brasil',
        center: [-14.2350, -51.9253], // [lat, lng] - Centro do Brasil
        climate: 'tropical',
        specialties: ['soja', 'milho', 'café', 'cana-de-açúcar'],
        bonus: { yield: 0.20 },
        description: 'Maior produtor agrícola da América do Sul, líder mundial em soja e café.',
        soilQuality: 85,
        waterAvailability: 80,
        averageTemp: 25,
        rainfall: 1200
    },
    
    'usa': {
        name: 'Estados Unidos',
        center: [39.8283, -98.5795], // [lat, lng] - Centro dos EUA
        climate: 'continental',
        specialties: ['milho', 'soja', 'trigo', 'algodão'],
        bonus: { technology: 0.25 },
        description: 'Líder mundial em tecnologia agrícola e produção de milho.',
        soilQuality: 90,
        waterAvailability: 75,
        averageTemp: 15,
        rainfall: 700
    },
    
    'china': {
        name: 'China',
        center: [35.8617, 104.1954], // [lat, lng] - Centro da China
        climate: 'continental',
        specialties: ['arroz', 'trigo', 'milho', 'soja'],
        bonus: { efficiency: 0.18 },
        description: 'Maior produtor mundial de arroz e trigo, agricultura intensiva.',
        soilQuality: 80,
        waterAvailability: 70,
        averageTemp: 18,
        rainfall: 800
    },
    
    'india': {
        name: 'Índia',
        center: [20.5937, 78.9629], // [lat, lng] - Centro da Índia
        climate: 'tropical',
        specialties: ['arroz', 'trigo', 'algodão', 'cana-de-açúcar'],
        bonus: { diversity: 0.22 },
        description: 'Segundo maior produtor mundial de arroz e trigo.',
        soilQuality: 75,
        waterAvailability: 65,
        averageTemp: 26,
        rainfall: 1100
    },
    
    'argentina': {
        name: 'Argentina',
        center: [-38.4161, -63.6167], // [lat, lng] - Centro da Argentina
        climate: 'temperate',
        specialties: ['soja', 'trigo', 'milho', 'carne'],
        bonus: { quality: 0.16 },
        description: 'Grandes planícies férteis, importante exportador de grãos.',
        soilQuality: 88,
        waterAvailability: 70,
        averageTemp: 16,
        rainfall: 600
    },
    
    'australia': {
        name: 'Austrália',
        center: [-25.2744, 133.7751], // [lat, lng] - Centro da Austrália
        climate: 'arid',
        specialties: ['trigo', 'cevada', 'carne', 'lã'],
        bonus: { sustainability: 0.14 },
        description: 'Agricultura adaptada ao clima seco, foco em sustentabilidade.',
        soilQuality: 70,
        waterAvailability: 50,
        averageTemp: 22,
        rainfall: 400
    },
    
    'canada': {
        name: 'Canadá',
        center: [56.1304, -106.3468], // [lat, lng] - Centro do Canadá
        climate: 'continental',
        specialties: ['trigo', 'canola', 'cevada', 'aveia'],
        bonus: { cold_resistance: 0.15 },
        description: 'Grandes extensões de terra cultivável, especialista em grãos.',
        soilQuality: 85,
        waterAvailability: 80,
        averageTemp: 8,
        rainfall: 500
    },
    
    'russia': {
        name: 'Rússia',
        center: [61.5240, 105.3188], // [lat, lng] - Centro da Rússia
        climate: 'continental',
        specialties: ['trigo', 'cevada', 'aveia', 'girassol'],
        bonus: { expansion: 0.17 },
        description: 'Vastas terras cultiváveis, maior exportador mundial de trigo.',
        soilQuality: 80,
        waterAvailability: 75,
        averageTemp: 5,
        rainfall: 450
    }
};

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.regionsConfig = regionsConfig;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = regionsConfig;
}