const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  checkKey: async (key) => {
    try {
      const response = await fetch('https://twoj-railway-url/api/check-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Server error' };
    }
  }
});
