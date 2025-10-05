/**
 * Dados das Culturas - NASA Farm Navigators
 * Configurações das culturas disponíveis para plantio
 */

const cropsData = {
    'trigo': {
        name: 'Trigo',
        icon: 'assets/images/crops/wheat.svg',
        category: 'grãos',
        growthTime: 120, // dias
        waterRequirement: 'médio',
        temperatureRange: [5, 25],
        soilType: ['argiloso', 'franco'],
        yield: {
            base: 3.5, // toneladas por hectare
            optimal: 6.0
        },
        price: {
            base: 250, // por tonelada
            volatility: 0.15
        },
        climate: ['continental', 'temperado'],
        season: 'inverno',
        description: 'Cereal básico para alimentação humana, adaptado a climas temperados.'
    },
    
    'milho': {
        name: 'Milho',
        icon: 'assets/images/crops/corn.svg',
        category: 'grãos',
        growthTime: 100,
        waterRequirement: 'alto',
        temperatureRange: [15, 35],
        soilType: ['franco', 'arenoso'],
        yield: {
            base: 8.0,
            optimal: 12.0
        },
        price: {
            base: 200,
            volatility: 0.20
        },
        climate: ['continental', 'subtropical'],
        season: 'verão',
        description: 'Cereal versátil usado para alimentação humana e animal.'
    },
    
    'soja': {
        name: 'Soja',
        icon: 'assets/images/crops/soybean.svg',
        category: 'leguminosas',
        growthTime: 110,
        waterRequirement: 'médio',
        temperatureRange: [20, 30],
        soilType: ['franco', 'argiloso'],
        yield: {
            base: 2.8,
            optimal: 4.5
        },
        price: {
            base: 400,
            volatility: 0.25
        },
        climate: ['subtropical', 'tropical'],
        season: 'verão',
        description: 'Leguminosa rica em proteínas, fixa nitrogênio no solo.'
    },
    
    'arroz': {
        name: 'Arroz',
        icon: 'assets/images/crops/rice.svg',
        category: 'grãos',
        growthTime: 130,
        waterRequirement: 'muito alto',
        temperatureRange: [20, 35],
        soilType: ['argiloso', 'franco'],
        yield: {
            base: 4.5,
            optimal: 8.0
        },
        price: {
            base: 350,
            volatility: 0.18
        },
        climate: ['tropical', 'subtropical'],
        season: 'verão',
        description: 'Cereal básico para mais da metade da população mundial.'
    },
    
    'algodão': {
        name: 'Algodão',
        icon: 'assets/images/crops/cotton.svg',
        category: 'fibras',
        growthTime: 180,
        waterRequirement: 'alto',
        temperatureRange: [18, 35],
        soilType: ['franco', 'arenoso'],
        yield: {
            base: 1.5,
            optimal: 2.5
        },
        price: {
            base: 1500,
            volatility: 0.30
        },
        climate: ['subtropical', 'árido'],
        season: 'verão',
        description: 'Fibra natural importante para a indústria têxtil.'
    },
    
    'cana-de-açúcar': {
        name: 'Cana-de-açúcar',
        icon: 'assets/images/crops/sugarcane.svg',
        category: 'industriais',
        growthTime: 365,
        waterRequirement: 'muito alto',
        temperatureRange: [20, 35],
        soilType: ['franco', 'argiloso'],
        yield: {
            base: 70,
            optimal: 120
        },
        price: {
            base: 50,
            volatility: 0.12
        },
        climate: ['tropical', 'subtropical'],
        season: 'anual',
        description: 'Cultura perene usada para produção de açúcar e etanol.'
    },
    
    'girassol': {
        name: 'Girassol',
        icon: 'assets/images/crops/sunflower.svg',
        category: 'oleaginosas',
        growthTime: 90,
        waterRequirement: 'baixo',
        temperatureRange: [15, 25],
        soilType: ['franco', 'arenoso'],
        yield: {
            base: 2.0,
            optimal: 3.5
        },
        price: {
            base: 600,
            volatility: 0.22
        },
        climate: ['continental', 'temperado'],
        season: 'verão',
        description: 'Oleaginosa resistente à seca, produz óleo comestível.'
    },
    
    'cevada': {
        name: 'Cevada',
        icon: 'assets/images/crops/barley.svg',
        category: 'grãos',
        growthTime: 100,
        waterRequirement: 'baixo',
        temperatureRange: [5, 20],
        soilType: ['franco', 'arenoso'],
        yield: {
            base: 3.0,
            optimal: 5.0
        },
        price: {
            base: 220,
            volatility: 0.16
        },
        climate: ['temperado', 'mediterrâneo'],
        season: 'inverno',
        description: 'Cereal usado para alimentação animal e produção de cerveja.'
    },
    
    'uva': {
        name: 'Uva',
        icon: 'assets/images/crops/grape.svg',
        category: 'frutas',
        growthTime: 150,
        waterRequirement: 'médio',
        temperatureRange: [10, 30],
        soilType: ['franco', 'calcário'],
        yield: {
            base: 12,
            optimal: 20
        },
        price: {
            base: 800,
            volatility: 0.35
        },
        climate: ['mediterrâneo', 'temperado'],
        season: 'verão',
        description: 'Fruta usada para consumo in natura e produção de vinho.'
    }
};

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.cropsData = cropsData;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = cropsData;
}