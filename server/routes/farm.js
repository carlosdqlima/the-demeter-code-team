/**
 * Rotas da API para gerenciamento de fazendas
 * Fornece endpoints para CRUD de fazendas, parcelas e cultivos
 */
import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho para o arquivo de dados da fazenda
const FARM_DATA_PATH = path.join(__dirname, '../data/farms.json');

/**
 * Utilitário para ler dados da fazenda
 */
const readFarmData = async () => {
  try {
    const data = await fs.readFile(FARM_DATA_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Se o arquivo não existir, retorna estrutura padrão
    if (error.code === 'ENOENT') {
      return { farms: [], lastUpdated: new Date().toISOString() };
    }
    throw error;
  }
};

/**
 * Utilitário para salvar dados da fazenda
 */
const saveFarmData = async (data) => {
  // Garantir que o diretório existe
  await fs.mkdir(path.dirname(FARM_DATA_PATH), { recursive: true });
  
  data.lastUpdated = new Date().toISOString();
  await fs.writeFile(FARM_DATA_PATH, JSON.stringify(data, null, 2));
};

/**
 * GET /api/farm/list
 * Lista todas as fazendas
 */
router.get('/list', async (req, res) => {
  try {
    const data = await readFarmData();
    
    res.json({
      success: true,
      farms: data.farms,
      count: data.farms.length,
      lastUpdated: data.lastUpdated
    });
    
  } catch (error) {
    console.error('Erro ao listar fazendas:', error);
    res.status(500).json({
      error: 'Erro ao carregar lista de fazendas'
    });
  }
});

/**
 * GET /api/farm/:id
 * Obtém dados de uma fazenda específica
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readFarmData();
    
    const farm = data.farms.find(f => f.id === id);
    
    if (!farm) {
      return res.status(404).json({
        error: 'Fazenda não encontrada'
      });
    }
    
    res.json({
      success: true,
      farm
    });
    
  } catch (error) {
    console.error('Erro ao buscar fazenda:', error);
    res.status(500).json({
      error: 'Erro ao carregar dados da fazenda'
    });
  }
});

/**
 * POST /api/farm/create
 * Cria uma nova fazenda
 */
router.post('/create', async (req, res) => {
  try {
    const { name, location, size, owner, plots } = req.body;
    
    if (!name || !location) {
      return res.status(400).json({
        error: 'Nome e localização são obrigatórios'
      });
    }
    
    const data = await readFarmData();
    
    const newFarm = {
      id: `farm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      location,
      size: size || 0,
      owner: owner || 'Proprietário não informado',
      plots: plots || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stats: {
        totalPlots: plots?.length || 0,
        activeCrops: 0,
        totalHarvests: 0,
        totalProduction: 0
      }
    };
    
    data.farms.push(newFarm);
    await saveFarmData(data);
    
    res.status(201).json({
      success: true,
      farm: newFarm,
      message: 'Fazenda criada com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao criar fazenda:', error);
    res.status(500).json({
      error: 'Erro ao criar fazenda'
    });
  }
});

/**
 * PUT /api/farm/:id
 * Atualiza dados de uma fazenda
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const data = await readFarmData();
    const farmIndex = data.farms.findIndex(f => f.id === id);
    
    if (farmIndex === -1) {
      return res.status(404).json({
        error: 'Fazenda não encontrada'
      });
    }
    
    // Atualizar fazenda mantendo campos obrigatórios
    data.farms[farmIndex] = {
      ...data.farms[farmIndex],
      ...updates,
      id, // Manter ID original
      updatedAt: new Date().toISOString()
    };
    
    await saveFarmData(data);
    
    res.json({
      success: true,
      farm: data.farms[farmIndex],
      message: 'Fazenda atualizada com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao atualizar fazenda:', error);
    res.status(500).json({
      error: 'Erro ao atualizar fazenda'
    });
  }
});

/**
 * DELETE /api/farm/:id
 * Remove uma fazenda
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const data = await readFarmData();
    const farmIndex = data.farms.findIndex(f => f.id === id);
    
    if (farmIndex === -1) {
      return res.status(404).json({
        error: 'Fazenda não encontrada'
      });
    }
    
    const removedFarm = data.farms.splice(farmIndex, 1)[0];
    await saveFarmData(data);
    
    res.json({
      success: true,
      farm: removedFarm,
      message: 'Fazenda removida com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao remover fazenda:', error);
    res.status(500).json({
      error: 'Erro ao remover fazenda'
    });
  }
});

/**
 * POST /api/farm/:id/plot
 * Adiciona uma nova parcela à fazenda
 */
router.post('/:id/plot', async (req, res) => {
  try {
    const { id } = req.params;
    const plotData = req.body;
    
    const data = await readFarmData();
    const farmIndex = data.farms.findIndex(f => f.id === id);
    
    if (farmIndex === -1) {
      return res.status(404).json({
        error: 'Fazenda não encontrada'
      });
    }
    
    const newPlot = {
      id: `plot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...plotData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    if (!data.farms[farmIndex].plots) {
      data.farms[farmIndex].plots = [];
    }
    
    data.farms[farmIndex].plots.push(newPlot);
    data.farms[farmIndex].updatedAt = new Date().toISOString();
    data.farms[farmIndex].stats.totalPlots = data.farms[farmIndex].plots.length;
    
    await saveFarmData(data);
    
    res.status(201).json({
      success: true,
      plot: newPlot,
      farm: data.farms[farmIndex],
      message: 'Parcela adicionada com sucesso'
    });
    
  } catch (error) {
    console.error('Erro ao adicionar parcela:', error);
    res.status(500).json({
      error: 'Erro ao adicionar parcela'
    });
  }
});

/**
 * GET /api/farm/:id/stats
 * Obtém estatísticas da fazenda
 */
router.get('/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readFarmData();
    
    const farm = data.farms.find(f => f.id === id);
    
    if (!farm) {
      return res.status(404).json({
        error: 'Fazenda não encontrada'
      });
    }
    
    // Calcular estatísticas em tempo real
    const plots = farm.plots || [];
    const activeCrops = plots.filter(p => p.crop && p.status === 'planted').length;
    const totalHarvests = plots.reduce((sum, p) => sum + (p.harvests?.length || 0), 0);
    const totalProduction = plots.reduce((sum, p) => {
      return sum + (p.harvests?.reduce((harvestSum, h) => harvestSum + (h.quantity || 0), 0) || 0);
    }, 0);
    
    const stats = {
      totalPlots: plots.length,
      activeCrops,
      totalHarvests,
      totalProduction,
      averageProductionPerPlot: plots.length > 0 ? totalProduction / plots.length : 0,
      plotsByStatus: plots.reduce((acc, p) => {
        acc[p.status || 'unknown'] = (acc[p.status || 'unknown'] || 0) + 1;
        return acc;
      }, {}),
      cropTypes: [...new Set(plots.map(p => p.crop).filter(Boolean))]
    };
    
    res.json({
      success: true,
      farmId: id,
      stats,
      lastCalculated: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Erro ao calcular estatísticas:', error);
    res.status(500).json({
      error: 'Erro ao calcular estatísticas da fazenda'
    });
  }
});

export default router;