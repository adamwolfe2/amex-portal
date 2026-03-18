// ============================================================
// Storage Adapter — localStorage with graceful fallback
// Supports new keys: amexos_portfolio, amexos_claims,
//   amexos_decisions, amexos_rakuten + legacy keys
// ============================================================

const StorageAdapter = (() => {
  let _backend = 'memory';
  const _memoryStore = {};

  function _testLocalStorage() {
    try {
      const key = '__amex_os_test__';
      localStorage.setItem(key, '1');
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  }

  if (_testLocalStorage()) {
    _backend = 'localStorage';
  }

  function get(key) {
    try {
      if (_backend === 'localStorage') {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      }
      return _memoryStore[key] ? JSON.parse(_memoryStore[key]) : null;
    } catch (e) {
      console.warn('StorageAdapter.get error:', e);
      return null;
    }
  }

  function set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      if (_backend === 'localStorage') {
        localStorage.setItem(key, serialized);
      } else {
        _memoryStore[key] = serialized;
      }
      return true;
    } catch (e) {
      console.warn('StorageAdapter.set error:', e);
      return false;
    }
  }

  function remove(key) {
    try {
      if (_backend === 'localStorage') {
        localStorage.removeItem(key);
      } else {
        delete _memoryStore[key];
      }
    } catch (e) {
      console.warn('StorageAdapter.remove error:', e);
    }
  }

  const ALL_KEYS = [
    'amexos_checklist',
    'amexos_vault',
    'amexos_portfolio',
    'amexos_claims',
    'amexos_decisions',
    'amexos_rakuten',
    'amexos_onboarding'
  ];

  function getAll() {
    const allData = {};
    ALL_KEYS.forEach(key => {
      const val = get(key);
      if (val !== null) allData[key] = val;
    });
    return allData;
  }

  function exportJSON() {
    const data = getAll();
    data._exportedAt = new Date().toISOString();
    data._backend = _backend;
    return JSON.stringify(data, null, 2);
  }

  function importJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      delete data._exportedAt;
      delete data._backend;
      Object.entries(data).forEach(([key, value]) => {
        set(key, value);
      });
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      return false;
    }
  }

  function getBackend() {
    return _backend;
  }

  return { get, set, remove, getAll, exportJSON, importJSON, getBackend };
})();
