/**
 * Rotas da API para persistência de dados
 * Fornece endpoints para salvar e carregar dados do jogo
 */
import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminhos para arquivos de dados
const DATA_DIR = path.join(__dirname, '../data');
const SAVES_DIR = path.join(DATA_DIR, 'saves');
const BACKUPS_DIR = path.join(DATA_DIR, 'backups');

/**
 * Utilitário para garantir que os diretórios existem
 */
const ensureDirectories = async () => {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(SAVES_DIR, { recursive: true });
  await fs.mkdir(BACKUPS_DIR, { recursive: true });
};

/**
 * Utilitário para validar dados do jogo
 */
const validateGameData = (data) => {
  const required = ['playerId', 'gameState', 'timestamp'];
  
  for (const field of required) {
    if (!data[field]) {
      throw new Error(`Campo obrigatório ausente: ${field}`);
    }
  }
  
  if (typeof data.gameState !== 'object') {
    throw new Error('gameState deve ser um objeto');
  }
};

/**
 * GET /api/data/saves
 * Lista todos os saves disponíveis
 */
router.get('/saves', async (req, res) => {
  try {
    await ensureDirectories();
    
    const files = await fs.readdir(SAVES_DIR);
    const saveFiles = files.filter(file => file.endsWith('.json'));
    
    const saves = await Promise.all(
      saveFiles.map(async (file) => {
        try {
          const filePath = path.join(SAVES_DIR, file);
          const stats = await fs.stat(filePath);
          const content = await fs.readFile(filePath, 'utf8');
          const data = JSON.parse(content);
          
          return {
            id: path.basename(file, '.json'),
            filename: file,
            playerId: data.playerId,
            timestamp: data.timestamp,
            lastModified: stats.mtime.toISOString(),
            size: stats.size,
            gameVersion: data.gameVersion || '1.0.0'
          };
        } catch (error) {
          console.error(`Erro ao ler save ${file}:`, error);
          return null;
        }
      })
    );
    
    res.json({
      success: true,
      saves: saves.filter(save => save !== null),
      count: saves.filter(save => save !== null).length
    });
    
  } catch (error) {
    console.error('Erro ao listar saves:', error);
    res.status(500).json({
      error: 'Erro ao carregar lista de saves'
    });
  }
});

/**
 * GET /api/data/save/:id
 * Carrega um save específico
 */
router.get('/save/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const filePath = path.join(SAVES_DIR, `${id}.json`);
    
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const data = JSON.parse(content);
      
      res.json({
        success: true,
        data,
        loadedAt: new Date().toISOString()
      });
      
    } catch (error) {
      if (error.code === 'ENOENT') {
        return res.status(404).json({
          error: 'Save não encontrado'
        });
      }
      throw error;
    }
    
  } catch (error) {
    console.error('Erro ao carregar save:', error);
    res.status(500).json({
      error: 'Erro ao carregar dados do save'
    });
  }
});

/**
 * POST /api/data/save
 * Salva dados do jogo
 */
router.post('/save', async (req, res) => {
  try {
    const gameData = req.body;
    
    // Validar dados
    validateGameData(gameData);
    
    await ensureDirectories();
    
    // Gerar ID único se não fornecido
    const saveId = gameData.saveId || `save_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Preparar dados para salvar
    const saveData = {
      ...gameData,
      saveId,
      savedAt: new Date().toISOString(),
      gameVersion: gameData.gameVersion || '1.0.0'
    };
    
    const filePath = path.join(SAVES_DIR, `${saveId}.json`);
    
    // Criar backup se o arquivo já existir
    try {
      await fs.access(filePath);
      const backupPath = path.join(BACKUPS_DIR, `${saveId}_${Date.now()}.json`);
      await fs.copyFile(filePath, backupPath);
    } catch (error) {
      // Arquivo não existe, não precisa fazer backup
    }
    
    // Salvar dados
    await fs.writeFile(filePath, JSON.stringify(saveData, null, 2));
    
    res.json({
      success: true,
      saveId,
      message: 'Dados salvos com sucesso',
      savedAt: saveData.savedAt
    });
    
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    res.status(500).json({
      error: 'Erro ao salvar dados do jogo',
      details: error.message
    });
  }
});

/**
 * PUT /api/data/save/:id
 * Atualiza um save existente
 */
router.put('/save/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const gameData = req.body;
    
    // Validar dados
    validateGameData(gameData);
    
    const filePath = path.join(SAVES_DIR, `${id}.json`);
    
    // Verificar se o save existe
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({
        error: 'Save não encontrado'
      });
    }
    
    // Criar backup
    const backupPath = path.join(BACKUPS_DIR, `${id}_${Date.now()}.json`);
    await fs.copyFile(filePath, backupPath);
    
    // Preparar dados atualizados
    const saveData = {
      ...gameData,
      saveId: id,
      updatedAt: new Date().toISOString(),
      gameVersion: gameData.gameVersion || '1.0.0'
    };
    
    // Salvar dados atualizados
    await fs.writeFile(filePath, JSON.stringify(saveData, null, 2));
    
    res.json({
      success: true,
      saveId: id,
      message: 'Save atualizado com sucesso',
      updatedAt: saveData.updatedAt
    });
    
  } catch (error) {
    console.error('Erro ao atualizar save:', error);
    res.status(500).json({
      error: 'Erro ao atualizar save',
      details: error.message
    });
  }
});

/**
 * DELETE /api/data/save/:id
 * Remove um save
 */
router.delete('/save/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const filePath = path.join(SAVES_DIR, `${id}.json`);
    
    // Verificar se o save existe
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({
        error: 'Save não encontrado'
      });
    }
    
    // Criar backup antes de deletar
    const backupPath = path.join(BACKUPS_DIR, `${id}_deleted_${Date.now()}.json`);
    await fs.copyFile(filePath, backupPath);
    
    // Remover arquivo
    await fs.unlink(filePath);
    
    res.json({
      success: true,
      message: 'Save removido com sucesso',
      backupCreated: path.basename(backupPath)
    });
    
  } catch (error) {
    console.error('Erro ao remover save:', error);
    res.status(500).json({
      error: 'Erro ao remover save'
    });
  }
});

/**
 * GET /api/data/backups
 * Lista backups disponíveis
 */
router.get('/backups', async (req, res) => {
  try {
    await ensureDirectories();
    
    const files = await fs.readdir(BACKUPS_DIR);
    const backupFiles = files.filter(file => file.endsWith('.json'));
    
    const backups = await Promise.all(
      backupFiles.map(async (file) => {
        try {
          const filePath = path.join(BACKUPS_DIR, file);
          const stats = await fs.stat(filePath);
          
          return {
            filename: file,
            created: stats.birthtime.toISOString(),
            size: stats.size,
            originalSaveId: file.split('_')[0]
          };
        } catch (error) {
          console.error(`Erro ao ler backup ${file}:`, error);
          return null;
        }
      })
    );
    
    res.json({
      success: true,
      backups: backups.filter(backup => backup !== null).sort((a, b) => 
        new Date(b.created) - new Date(a.created)
      ),
      count: backups.filter(backup => backup !== null).length
    });
    
  } catch (error) {
    console.error('Erro ao listar backups:', error);
    res.status(500).json({
      error: 'Erro ao carregar lista de backups'
    });
  }
});

/**
 * POST /api/data/restore/:filename
 * Restaura um backup
 */
router.post('/restore/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const backupPath = path.join(BACKUPS_DIR, filename);
    
    // Verificar se o backup existe
    try {
      await fs.access(backupPath);
    } catch (error) {
      return res.status(404).json({
        error: 'Backup não encontrado'
      });
    }
    
    // Ler dados do backup
    const content = await fs.readFile(backupPath, 'utf8');
    const data = JSON.parse(content);
    
    // Extrair ID original do save
    const originalSaveId = filename.split('_')[0];
    
    // Restaurar para o diretório de saves
    const restorePath = path.join(SAVES_DIR, `${originalSaveId}.json`);
    
    // Criar backup do arquivo atual se existir
    try {
      await fs.access(restorePath);
      const currentBackupPath = path.join(BACKUPS_DIR, `${originalSaveId}_before_restore_${Date.now()}.json`);
      await fs.copyFile(restorePath, currentBackupPath);
    } catch (error) {
      // Arquivo não existe, não precisa fazer backup
    }
    
    // Restaurar dados
    const restoredData = {
      ...data,
      restoredAt: new Date().toISOString(),
      restoredFrom: filename
    };
    
    await fs.writeFile(restorePath, JSON.stringify(restoredData, null, 2));
    
    res.json({
      success: true,
      message: 'Backup restaurado com sucesso',
      saveId: originalSaveId,
      restoredAt: restoredData.restoredAt
    });
    
  } catch (error) {
    console.error('Erro ao restaurar backup:', error);
    res.status(500).json({
      error: 'Erro ao restaurar backup',
      details: error.message
    });
  }
});

/**
 * GET /api/data/export/:id
 * Exporta um save para download
 */
router.get('/export/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const filePath = path.join(SAVES_DIR, `${id}.json`);
    
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const data = JSON.parse(content);
      
      // Adicionar metadados de exportação
      const exportData = {
        ...data,
        exportedAt: new Date().toISOString(),
        exportVersion: '1.0.0'
      };
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="nasa-farm-save-${id}.json"`);
      res.send(JSON.stringify(exportData, null, 2));
      
    } catch (error) {
      if (error.code === 'ENOENT') {
        return res.status(404).json({
          error: 'Save não encontrado'
        });
      }
      throw error;
    }
    
  } catch (error) {
    console.error('Erro ao exportar save:', error);
    res.status(500).json({
      error: 'Erro ao exportar save'
    });
  }
});

export default router;