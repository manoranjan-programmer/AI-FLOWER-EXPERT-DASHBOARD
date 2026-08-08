/**
 * CLI Argument Parser
 * Parses command line arguments, flags (--format pdf), and positional args.
 */

class CliParser {
  static parse(argv) {
    const rawArgs = argv.slice(2);
    if (rawArgs.length === 0) {
      return { isInteractive: true, raw: '' };
    }

    // Check if user passed a single string or natural language query
    const fullInput = rawArgs.join(' ').trim();
    
    // Check if input is enclosed in quotes or contains spaces without standard CLI flags
    const firstArg = rawArgs[0];
    const isNaturalLanguage = (
      rawArgs.length === 1 && (firstArg.includes(' ') || firstArg.startsWith('"') || firstArg.startsWith("'"))
    ) || (
      !firstArg.startsWith('-') &&
      ['open', 'show', 'generate', 'export', 'search', 'get', 'fetch', 'display', 'launch'].includes(firstArg.toLowerCase()) &&
      rawArgs.length > 1 &&
      !['pdf', 'excel', 'csv'].includes(rawArgs[1].toLowerCase())
    );

    const flags = {};
    const positionals = [];

    for (let i = 0; i < rawArgs.length; i++) {
      const arg = rawArgs[i];
      if (arg.startsWith('--')) {
        const key = arg.slice(2);
        const nextArg = rawArgs[i + 1];
        if (nextArg && !nextArg.startsWith('-')) {
          flags[key] = nextArg;
          i++;
        } else {
          flags[key] = true;
        }
      } else if (arg.startsWith('-')) {
        const key = arg.slice(1);
        flags[key] = true;
      } else {
        positionals.push(arg);
      }
    }

    return {
      isNaturalLanguage,
      raw: fullInput,
      commandName: positionals[0] || '',
      args: positionals.slice(1),
      flags
    };
  }
}

module.exports = CliParser;
