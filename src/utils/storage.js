const createStorage = () => {
  const storage = {};
  return {
    setItem(key, value) {
      storage[key] = value || '';
    },
    getItem(key) {
      return storage[key] || null;
    },
    removeItem(key) {
      delete storage[key];
    },
    get length() {
      return Object.keys(storage).length;
    },
    key(i) {
      const keys = Object.keys(storage);
      return keys[i] || null;
    },
    clear() {
      Object.keys(storage).forEach(key => {
        delete storage[key];
      });
    }
  };
};

export const sessionStorage = __CLIENT__ && window.sessionStorage || createStorage();
export const localStorage = __CLIENT__ && window.localStorage || createStorage();
