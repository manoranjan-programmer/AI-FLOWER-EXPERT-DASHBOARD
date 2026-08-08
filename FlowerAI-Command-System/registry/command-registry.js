/**
 * Central Command Registry
 * Defines, stores, and organizes all CLI commands and options.
 */

const Logger = require('../utils/logger');
const BrowserService = require('../services/browser-service');
const ExportService = require('../services/export-service');
const ReportService = require('../services/report-service');
const ApiService = require('../services/api-service');
const historyManager = require('../command-engine/history');
const aliasesManager = require('../command-engine/aliases');
const configManager = require('../config/config-manager');

class CommandRegistry {
  constructor() {
    this.commands = new Map();
    this.registerCoreCommands();
  }

  register(commandDef) {
    if (!commandDef.name || typeof commandDef.handler !== 'function') {
      throw new Error(`Invalid command definition for ${commandDef.name || 'unknown'}`);
    }
    this.commands.set(commandDef.name.toLowerCase(), commandDef);
  }

  get(name) {
    if (!name) return null;
    const cleanName = name.toLowerCase().trim();
    // Resolve alias first
    const resolvedName = aliasesManager.resolve(cleanName);
    return this.commands.get(resolvedName) || null;
  }

  getAll() {
    return Array.from(this.commands.values());
  }

  registerCoreCommands() {
    // Navigation Commands
    const navRoutes = [
      { name: 'dashboard', desc: 'Open Flower AI main dashboard interface', aliases: ['dash'] },
      { name: 'analytics', desc: 'Open real-time system & flower analytics', aliases: ['stat', 'stats'] },
      { name: 'chatbot', desc: 'Open AI chatbot assistant interface', aliases: ['chat'] },
      { name: 'users', desc: 'Open user management directory', aliases: ['usr'] },
      { name: 'flowers', desc: 'Open flower catalog statistics & species data', aliases: ['flw', 'flora'] },
      { name: 'settings', desc: 'Open system settings & preferences', aliases: ['set', 'config-ui'] }
    ];

    navRoutes.forEach(route => {
      this.register({
        name: route.name,
        category: 'Navigation',
        description: route.desc,
        aliases: route.aliases,
        handler: async () => {
          return await BrowserService.openRoute(route.name);
        }
      });
    });

    // Operation Commands
    this.register({
      name: 'search',
      category: 'Data & Intelligence',
      description: 'Search flower catalog or species details (e.g. flower-ai search sunflower)',
      usage: 'flower-ai search <query>',
      aliases: ['find', 'lookup'],
      handler: async (args) => {
        const query = args.join(' ') || 'sunflower';
        return await ApiService.searchFlower(query);
      }
    });

    this.register({
      name: 'report',
      category: 'Data & Intelligence',
      description: 'Generate analytical system report (e.g. flower-ai report [daily|monthly|annual])',
      usage: 'flower-ai report [type]',
      aliases: ['rep'],
      handler: async (args) => {
        const type = args[0] || 'monthly';
        return await ReportService.generateReport(type);
      }
    });

    this.register({
      name: 'export',
      category: 'Data & Intelligence',
      description: 'Export telemetry data to file (e.g. flower-ai export pdf|excel|csv [topic])',
      usage: 'flower-ai export <format> [topic]',
      aliases: ['exp'],
      handler: async (args) => {
        const format = args[0] || 'pdf';
        const topic = args[1] || 'flower-catalog';
        return await ExportService.exportData(format, topic);
      }
    });

    this.register({
      name: 'refresh',
      category: 'System Control',
      description: 'Refresh cached data and ping backend server connectivity',
      aliases: ['ref', 'ping'],
      handler: async () => {
        Logger.info('Refreshing active cache and pinging backend...');
        ApiService.pingApi();
        Logger.success('Cache cleared and connections refreshed successfully!');
        return { success: true };
      }
    });

    this.register({
      name: 'reload',
      category: 'System Control',
      description: 'Reload command system configuration and aliases',
      aliases: ['rel'],
      handler: async () => {
        Logger.info('Reloading configuration & aliases...');
        configManager.loadConfig();
        Logger.success('Command engine reloaded cleanly!');
        return { success: true };
      }
    });

    // Management & Support Commands
    this.register({
      name: 'history',
      category: 'Management',
      description: 'View execution history log of CLI commands',
      aliases: ['hist', 'logs'],
      handler: async (args) => {
        if (args[0] === 'clear') {
          historyManager.clear();
        } else {
          const limit = parseInt(args[0], 10) || 10;
          historyManager.showRecent(limit);
        }
        return { success: true };
      }
    });

    this.register({
      name: 'aliases',
      category: 'Management',
      description: 'View or add custom shorthand aliases',
      usage: 'flower-ai aliases [set <alias> <targetCommand>]',
      handler: async (args) => {
        if (args[0] === 'set' && args[1] && args[2]) {
          aliasesManager.setAlias(args[1], args[2]);
        } else {
          aliasesManager.listAliases();
        }
        return { success: true };
      }
    });

    this.register({
      name: 'config',
      category: 'Management',
      description: 'Get or set CLI configurations (e.g. flower-ai config set baseUrl http://localhost:3000)',
      usage: 'flower-ai config [get|set|reset] [key] [value]',
      handler: async (args) => {
        const action = args[0] || 'get';
        if (action === 'get') {
          const val = configManager.get(args[1]);
          Logger.info(`Config [${args[1] || 'all'}]:`);
          console.log(JSON.stringify(val, null, 2));
        } else if (action === 'set' && args[1] && args[2]) {
          configManager.set(args[1], args[2]);
          Logger.success(`Config set: ${args[1]} = ${args[2]}`);
        } else if (action === 'reset') {
          configManager.reset();
          Logger.success('Configuration reset to defaults.');
        }
        return { success: true };
      }
    });

    this.register({
      name: 'help',
      category: 'System Control',
      description: 'Display interactive help screen and available command list',
      aliases: ['h', '-h', '--help'],
      handler: async () => {
        this.showHelp();
        return { success: true };
      }
    });
  }

  showHelp() {
    Logger.banner();
    console.log(` ${Logger.color('USAGE:', 'bold.brightYellow')}`);
    console.log(`   $ ${Logger.color('flower-ai', 'brightGreen')} <command> [options]`);
    console.log(`   $ ${Logger.color('flower-ai', 'brightGreen')} "<natural language instruction>"\n`);

    console.log(` ${Logger.color('EXAMPLES:', 'bold.brightYellow')}`);
    console.log(`   $ flower-ai ${Logger.color('dashboard', 'brightCyan')}`);
    console.log(`   $ flower-ai ${Logger.color('search sunflower', 'brightCyan')}`);
    console.log(`   $ flower-ai ${Logger.color('export pdf', 'brightCyan')}`);
    console.log(`   $ flower-ai ${Logger.color('"Show today\'s analytics"', 'brightCyan')}`);
    console.log(`   $ flower-ai ${Logger.color('"Open flower statistics"', 'brightCyan')}\n`);

    const categories = {};
    this.getAll().forEach(cmd => {
      const cat = cmd.category || 'General';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(cmd);
    });

    console.log(` ${Logger.color('AVAILABLE COMMANDS:', 'bold.brightYellow')}`);

    Object.entries(categories).forEach(([category, cmdList]) => {
      console.log(`\n ${Logger.color(`■ ${category}`, 'bold.brightCyan')}`);
      const rows = cmdList.map(c => [
        Logger.color(c.name, 'brightGreen.bold'),
        (c.aliases && c.aliases.length > 0) ? Logger.color(`[${c.aliases.join(', ')}]`, 'dim') : '',
        c.description
      ]);
      Logger.table(['Command', 'Aliases', 'Description'], rows);
    });
  }
}

module.exports = new CommandRegistry();
