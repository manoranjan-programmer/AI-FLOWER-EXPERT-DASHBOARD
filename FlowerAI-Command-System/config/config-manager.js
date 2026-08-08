/**
 * Configuration Manager for FlowerAI Command System
 * Reads, persists, and provides access to CLI configurations.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const defaultConfig = require('./default-config.json');

class ConfigManager {
  constructor() {
    this.userConfigPath = path.join(os.homedir(), '.flower-ai-config.json');
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      if (fs.existsSync(this.userConfigPath)) {
        const fileData = fs.readFileSync(this.userConfigPath, 'utf8');
        return { ...defaultConfig, ...JSON.parse(fileData) };
      }
    } catch (err) {
      // Fallback silently to default config
    }
    return { ...defaultConfig };
  }

  saveConfig() {
    try {
      fs.writeFileSync(this.userConfigPath, JSON.stringify(this.config, null, 2), 'utf8');
      return true;
    } catch (err) {
      return false;
    }
  }

  get(key) {
    if (!key) return this.config;
    const parts = key.split('.');
    let curr = this.config;
    for (const part of parts) {
      if (curr && typeof curr === 'object' && part in curr) {
        curr = curr[part];
      } else {
        return undefined;
      }
    }
    return curr;
  }

  set(key, value) {
    const parts = key.split('.');
    let curr = this.config;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!curr[part] || typeof curr[part] !== 'object') {
        curr[part] = {};
      }
      curr = curr[part];
    }
    curr[parts[parts.length - 1]] = value;
    this.saveConfig();
    return true;
  }

  getRouteUrl(routeName) {
    const baseUrl = this.get('baseUrl') || 'http://localhost:3000';
    const routes = this.get('routes') || {};
    const routePath = routes[routeName] || `/${routeName}`;
    return `${baseUrl.replace(/\/$/, '')}${routePath}`;
  }

  reset() {
    this.config = { ...defaultConfig };
    this.saveConfig();
  }
}

module.exports = new ConfigManager();
