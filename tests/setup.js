/**
 * Arquivo de setup para testes do projeto FarmVerse
 * Configura o ambiente de teste e mocks globais
 */

// Configurações globais para testes
global.console = {
  ...console,
  // Silenciar logs durante os testes, exceto erros
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: console.error
};

// Mock do Phaser para testes
global.Phaser = {
  Scene: class MockScene {},
  Game: class MockGame {},
  AUTO: 'AUTO',
  Scale: {
    FIT: 'FIT',
    SHOW_ALL: 'SHOW_ALL'
  },
  Physics: {
    Arcade: {
      Events: {}
    }
  },
  Input: {
    Events: {}
  },
  Events: {
    EventEmitter: class MockEventEmitter {
      on() {}
      off() {}
      emit() {}
    }
  }
};

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
global.localStorage = localStorageMock;

// Mock do sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};
global.sessionStorage = sessionStorageMock;

// Mock de APIs do navegador
global.fetch = vi.fn();
global.navigator = {
  ...global.navigator,
  geolocation: {
    getCurrentPosition: vi.fn(),
    watchPosition: vi.fn(),
    clearWatch: vi.fn()
  }
};

// Mock do WebGL para testes de renderização
global.WebGLRenderingContext = vi.fn();
global.WebGL2RenderingContext = vi.fn();

// Configurações de timeout para testes assíncronos
vi.setConfig({
  testTimeout: 10000,
  hookTimeout: 10000
});

// Limpeza após cada teste
afterEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
  sessionStorageMock.clear();
});