/**
 * Interactive Command Shell (REPL Mode)
 * Provides interactive prompt with live command execution and suggestions.
 */

const readline = require('readline');
const Logger = require('../utils/logger');
const registry = require('../registry/command-registry');

class InteractiveShell {
  static async start() {
    Logger.banner();
    console.log(` ${Logger.color('Welcome to FlowerAI Interactive Shell Mode!', 'brightGreen.bold')}`);
    console.log(` Type commands or natural instructions (e.g. ${Logger.color('dashboard', 'brightCyan')}, ${Logger.color('"Export PDF"', 'brightCyan')}, ${Logger.color('help', 'brightCyan')}, or ${Logger.color('exit', 'brightRed')}).\n`);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: `${Logger.color('flower-ai', 'brightGreen.bold')} 🌸 > `
    });

    rl.prompt();

    rl.on('line', async (line) => {
      const input = line.trim();
      if (!input) {
        rl.prompt();
        return;
      }

      if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
        Logger.info('Exiting FlowerAI Command System.');
        rl.close();
        process.exit(0);
      }

      const executor = require('../command-engine/executor');
      // Format simulated argv
      const simulatedArgv = ['node', 'flower-ai', ...this.splitArgs(input)];
      await executor.execute(simulatedArgv);

      console.log('');
      rl.prompt();
    });

    rl.on('close', () => {
      process.exit(0);
    });
  }

  static splitArgs(str) {
    const regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
    const args = [];
    let match;
    while ((match = regex.exec(str)) !== null) {
      args.push(match[1] || match[2] || match[0]);
    }
    return args;
  }
}

module.exports = InteractiveShell;
