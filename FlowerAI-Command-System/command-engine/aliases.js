/**
 * Aliases Manager
 * Provides shorthand command mapping (e.g. dash -> dashboard, exp -> export).
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const Logger = require('../utils/logger');

class AliasesManager {
  constructor() {
    this.aliasesFilePath = path.join(os.homedir(), '.flower-ai-aliases.json');
    this.defaultAliases = {
      'dash': 'dashboard',
      'stat': 'analytics',
      'chat': 'chatbot',
      'usr': 'users',
      'flw': 'flowers',
      'set': 'settings',
      'exp': 'export',
      'srch': 'search',
      'rep': 'report',
      'ref': 'refresh',
      'rel': 'reload'
    };
    this.aliases = this.loadAliases();
  }

  loadAliases() {
    try {
      if (fs.existsSync(this.aliasesFilePath)) {
        const data = fs.readFileSync(this.aliasesFilePath, 'utf8');
        return { ...this.defaultAliases, ...JSON.parse(data) };
      }
    } catch (err) {
      // Fallback
    }
    return { ...this.defaultAliases };
  }

  saveAliases() {
    try {
      fs.writeFileSync(this.aliasesFilePath, JSON.stringify(this.aliases, null, 2), 'utf8');
    } catch (err) {
      // Ignore
    }
  }

  resolve(aliasKey) {
    if (!aliasKey) return aliasKey;
    const lowerKey = aliasKey.toLowerCase().trim();
    return this.aliases[lowerKey] || aliasKey;
  }

  setAlias(aliasKey, targetCommand) {
    this.aliases[aliasKey.toLowerCase().trim()] = targetCommand.trim();
    this.saveAliases();
    Logger.success(`Alias created: "${aliasKey}" -> "${targetCommand}"`);
  }

  listAliases() {
    const rows = Object.entries(this.aliases).map(([alias, target]) => [alias, target]);
    Logger.table(['Alias (Shorthand)', 'Mapped Command'], rows);
  }
}

module.exports = new AliasesManager();
