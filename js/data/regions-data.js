/**
 * Dados das Regiões Agrícolas - NASA Farm Navigators
 * Configurações das regiões disponíveis para agricultura
 */

const regionsConfig = {
    'great-plains': {
        name: 'Grandes Planícies',
        center: [39.8283, -98.5795], // [lat, lng] - Kansas, EUA
        climate: 'continental',
        specialties: ['trigo', 'milho', 'soja'],
        bonus: { yield: 0.15 },
        description: 'Região ideal para cultivo de grãos com vastas planícies férteis.',
        soilQuality: 85,
        waterAvailability: 70,
        averageTemp: 12,
        rainfall: 600
    },
    
    'pampas': {
        name: 'Pampas',
        center: [-34.6037, -58.3816], // [lat, lng] - Buenos Aires, Argentina
        climate: 'subtropical',
        specialties: ['soja', 'trigo', 'milho'],
        bonus: { yield: 0.12 },
        description: 'Planícies férteis da América do Sul, ideais para agricultura extensiva.',
        soilQuality: 90,
        waterAvailability: 75,
        averageTemp: 16,
        rainfall: 800
    },
    
    'nile-delta': {
        name: 'Delta do Nilo',
        center: [30.0444, 31.2357], // [lat, lng] - Cairo, Egito
        climate: 'arid',
        specialties: ['arroz', 'algodão', 'trigo'],
        bonus: { water_efficiency: 0.20 },
        description: 'Região histórica de agricultura irrigada no Egito.',
        soilQuality: 80,
        waterAvailability: 60,
        averageTemp: 22,
        rainfall: 200
    },
    
    'ganges-plain': {
        name: 'Planície do Ganges',
        center: [26.8467, 80.9462], // [lat, lng] - Lucknow, Índia
        climate: 'tropical',
        specialties: ['arroz', 'trigo', 'cana-de-açúcar'],
        bonus: { yield: 0.18 },
        description: 'Uma das regiões mais férteis do mundo, ideal para arroz.',
        soilQuality: 95,
        waterAvailability: 85,
        averageTemp: 25,
        rainfall: 1200
    },
    
    'ukraine-plains': {
        name: 'Planícies da Ucrânia',
        center: [49.8397, 24.0297], // [lat, lng] - Lviv, Ucrânia
        climate: 'continental',
        specialties: ['trigo', 'milho', 'girassol'],
        bonus: { yield: 0.14 },
        description: 'Terra negra fértil, conhecida como o celeiro da Europa.',
        soilQuality: 92,
        waterAvailability: 65,
        averageTemp: 8,
        rainfall: 550
    },
    
    'murray-darling': {
        name: 'Murray-Darling',
        center: [-34.9285, 138.6007], // [lat, lng] - Adelaide, Austrália
        climate: 'mediterranean',
        specialties: ['trigo', 'cevada', 'uva'],
        bonus: { drought_resistance: 0.16 },
        description: 'Principal região agrícola da Austrália.',
        soilQuality: 75,
        waterAvailability: 55,
        averageTemp: 18,
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