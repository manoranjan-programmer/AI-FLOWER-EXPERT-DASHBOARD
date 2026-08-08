/**
 * Autocomplete & Fuzzy Suggestion Engine for CLI
 */

class AutocompleteEngine {
  constructor(commands = []) {
    this.commands = commands;
  }

  setCommands(commands) {
    this.commands = commands;
  }

  /**
   * Find closest command matching input string using Levenshtein Distance & Substring match
   */
  suggest(input) {
    if (!input || typeof input !== 'string') return [];
    const query = input.trim().toLowerCase();

    const matches = [];

    this.commands.forEach(cmd => {
      const name = cmd.name.toLowerCase();
      const aliases = (cmd.aliases || []).map(a => a.toLowerCase());

      // Direct prefix / substring match
      if (name.startsWith(query) || name.includes(query)) {
        matches.push({ cmd: cmd.name, score: 100, description: cmd.description });
        return;
      }

      for (const alias of aliases) {
        if (alias.startsWith(query) || alias.includes(query)) {
          matches.push({ cmd: cmd.name, score: 90, description: `(alias: ${alias}) ${cmd.description}` });
          return;
        }
      }

      // Calculate fuzzy distance
      const distance = this.levenshtein(query, name);
      if (distance <= 3) {
        matches.push({ cmd: cmd.name, score: 80 - (distance * 10), description: cmd.description });
      }
    });

    return matches.sort((a, b) => b.score - a.score);
  }

  levenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }
}

module.exports = AutocompleteEngine;
