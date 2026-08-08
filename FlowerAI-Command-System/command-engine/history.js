/**
 * Command History Manager
 * Stores and manages CLI execution logs in ~/.flower-ai-history.json
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const Logger = require('../utils/logger');
const config = require('../config/config-manager');

class HistoryManager {
  constructor() {
    this.historyFile = path.join(os.homedir(), '.flower-ai-history.json');
    this.history = this.loadHistory();
  }

  loadHistory() {
    try {
      if (fs.existsSync(this.historyFile)) {
        const data = fs.readFileSync(this.historyFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (err) {
      // Fallback
    }
    return [];
  }

  saveHistory() {
    try {
      const maxItems = config.get('maxHistory') || 100;
      const trimmed = this.history.slice(-maxItems);
      fs.writeFileSync(this.historyFile, JSON.stringify(trimmed, null, 2), 'utf8');
    } catch (err) {
      // Ignore
    }
  }

  record(commandStr, status = 'success', durationMs = 0) {
    const entry = {
      id: Date.now().toString(36),
      command: commandStr,
      status,
      duration: `${durationMs}ms`,
      timestamp: new Date().toISOString()
    };

    this.history.push(entry);
    this.saveHistory();
  }

  showRecent(limit = 10) {
    const recent = this.history.slice(-limit).reverse();
    if (recent.length === 0) {
      Logger.info('No command history recorded yet.');
      return;
    }

    const rows = recent.map((item, index) => [
      `#${recent.length - index}`,
      item.command,
      item.status === 'success' ? Logger.color('SUCCESS', 'green.bold') : Logger.color('FAILED', 'red.bold'),
      item.duration,
      new Date(item.timestamp).toLocaleTimeString()
    ]);

    Logger.table(['Index', 'Command Line', 'Status', 'Duration', 'Time'], rows);
  }

  clear() {
    this.history = [];
    this.saveHistory();
    Logger.success('Command history cleared.');
  }
}

module.exports = new HistoryManager();
