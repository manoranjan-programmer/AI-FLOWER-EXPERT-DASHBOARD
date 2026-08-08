/**
 * Command Executor Pipeline
 * Orchestrates parsing, validation, plugin loading, execution timing, and history logging.
 */

const Logger = require('../utils/logger');
const registry = require('../registry/command-registry');
const cliParser = require('../parser/cli-parser');
const aiParser = require('../parser/ai-parser');
const historyManager = require('./history');
const aliasesManager = require('./aliases');
const AutocompleteEngine = require('../utils/autocomplete');

class CommandExecutor {
  constructor() {
    this.autocomplete = new AutocompleteEngine(registry.getAll());
  }

  async execute(argv) {
    const parsed = cliParser.parse(argv);

    if (parsed.isInteractive) {
      const interactiveShell = require('../cli/interactive-shell');
      return await interactiveShell.start();
    }

    const startTime = Date.now();
    let commandLineStr = parsed.raw;

    try {
      let commandObj = null;
      let targetArgs = parsed.args || [];
      let targetName = parsed.commandName;

      if (parsed.isNaturalLanguage) {
        const aiResult = aiParser.parse(parsed.raw);
        if (aiResult && aiResult.matched) {
          commandObj = aiResult.commandObj;
          targetArgs = aiResult.args;
          targetName = aiResult.commandName;
        }
      }

      if (!commandObj && targetName) {
        // Resolve alias first
        const resolvedName = aliasesManager.resolve(targetName);
        commandObj = registry.get(resolvedName);
      }

      if (!commandObj) {
        Logger.error(`Unknown command or instruction: "${parsed.raw}"`);
        
        // Suggest close matches
        const suggestions = this.autocomplete.suggest(parsed.raw);
        if (suggestions.length > 0) {
          console.log(`\n ${Logger.color('Did you mean one of these?', 'brightYellow.bold')}`);
          suggestions.slice(0, 3).forEach(s => {
            console.log(`   $ flower-ai ${Logger.color(s.cmd, 'brightGreen')} ${Logger.color(s.description, 'dim')}`);
          });
          console.log('');
        }

        console.log(` Run ${Logger.color('flower-ai help', 'brightCyan')} to view available commands.\n`);
        historyManager.record(commandLineStr, 'failed', Date.now() - startTime);
        return false;
      }

      // Execute command handler
      const result = await commandObj.handler(targetArgs, parsed.flags);
      const duration = Date.now() - startTime;

      historyManager.record(commandLineStr, 'success', duration);
      return result;

    } catch (err) {
      const duration = Date.now() - startTime;
      Logger.error(`Execution error: ${err.message}`);
      if (process.env.DEBUG) {
        console.error(err.stack);
      }
      historyManager.record(commandLineStr, 'failed', duration);
      return false;
    }
  }
}

module.exports = new CommandExecutor();
