/**
 * Plugin Loader Architecture
 * Dynamically loads and attaches external extension plugins.
 */

const fs = require('fs');
const path = require('path');
const Logger = require('../utils/logger');

class PluginLoader {
  constructor() {
    this.plugins = new Map();
  }

  loadPluginsFromDir(pluginDir) {
    if (!fs.existsSync(pluginDir)) return;

    try {
      const files = fs.readdirSync(pluginDir);
      files.forEach(file => {
        if (file.endsWith('.js')) {
          const pluginPath = path.join(pluginDir, file);
          try {
            const plugin = require(pluginPath);
            if (plugin && plugin.name && typeof plugin.register === 'function') {
              this.registerPlugin(plugin);
            }
          } catch (err) {
            Logger.warn(`Failed to load plugin ${file}: ${err.message}`);
          }
        }
      });
    } catch (err) {
      Logger.warn(`Error scanning plugin directory: ${err.message}`);
    }
  }

  registerPlugin(plugin) {
    this.plugins.set(plugin.name, plugin);
    Logger.info(`Loaded Plugin: ${Logger.color(plugin.name, 'brightCyan')} (v${plugin.version || '1.0.0'})`);
  }

  getPlugins() {
    return Array.from(this.plugins.values());
  }
}

module.exports = new PluginLoader();
