/**
 * Natural Language AI Parser Engine
 * Maps English phrases, intents, and keywords to registered CLI commands & parameters.
 */

const Logger = require('../utils/logger');
const registry = require('../registry/command-registry');

class AiParser {
  constructor() {
    this.intentRules = [
      // Navigation Intents
      {
        intent: 'dashboard',
        keywords: ['dashboard', 'main view', 'home screen', 'overview', 'control center'],
        action: 'dashboard'
      },
      {
        intent: 'analytics',
        keywords: ['analytics', 'metrics', 'stats', 'statistics', 'charts', 'telemetry', 'today\'s analytics'],
        action: 'analytics'
      },
      {
        intent: 'chatbot',
        keywords: ['chatbot', 'chat assistant', 'ai chat', 'bot', 'conversations'],
        action: 'chatbot'
      },
      {
        intent: 'users',
        keywords: ['users', 'user list', 'user management', 'accounts', 'members'],
        action: 'users'
      },
      {
        intent: 'flowers',
        keywords: ['flower statistics', 'flowers', 'flora', 'botanical data', 'species list', 'flower catalog'],
        action: 'flowers'
      },
      {
        intent: 'settings',
        keywords: ['settings', 'preferences', 'configuration', 'config ui'],
        action: 'settings'
      },

      // Operation Intents
      {
        intent: 'export',
        keywords: ['export', 'download', 'save report', 'generate file'],
        action: 'export',
        extractArgs: (text) => {
          const lower = text.toLowerCase();
          let format = 'pdf';
          if (lower.includes('excel') || lower.includes('xlsx')) format = 'excel';
          if (lower.includes('csv')) format = 'csv';
          if (lower.includes('pdf')) format = 'pdf';
          return [format];
        }
      },
      {
        intent: 'report',
        keywords: ['generate monthly report', 'report', 'summary report', 'executive report', 'generate report'],
        action: 'report',
        extractArgs: (text) => {
          const lower = text.toLowerCase();
          if (lower.includes('daily')) return ['daily'];
          if (lower.includes('annual') || lower.includes('yearly')) return ['annual'];
          return ['monthly'];
        }
      },
      {
        intent: 'search',
        keywords: ['search', 'find', 'lookup', 'species'],
        action: 'search',
        extractArgs: (text) => {
          const lower = text.toLowerCase();
          // Extract term after "search" or target plant name
          const match = lower.match(/search\s+([a-z0-9_\-\s]+)/i);
          if (match && match[1]) {
            return [match[1].trim()];
          }
          if (lower.includes('sunflower')) return ['sunflower'];
          if (lower.includes('lotus')) return ['lotus'];
          if (lower.includes('rose')) return ['rose'];
          return ['sunflower'];
        }
      },
      {
        intent: 'refresh',
        keywords: ['refresh', 'reload cache', 'ping server', 'sync'],
        action: 'refresh'
      }
    ];
  }

  parse(nlInput) {
    if (!nlInput || typeof nlInput !== 'string') return null;

    const query = nlInput.replace(/["']/g, '').trim().toLowerCase();
    Logger.ai(`Parsing natural language query: "${Logger.color(query, 'brightMagenta.bold')}"`);

    let bestMatch = null;
    let highestScore = 0;

    for (const rule of this.intentRules) {
      let score = 0;
      for (const kw of rule.keywords) {
        if (query === kw) {
          score += 100;
        } else if (query.includes(kw)) {
          score += 50 + kw.length;
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = rule;
      }
    }

    if (bestMatch && highestScore > 0) {
      const commandObj = registry.get(bestMatch.action);
      const args = bestMatch.extractArgs ? bestMatch.extractArgs(query) : [];

      Logger.ai(
        `Intent matched: ${Logger.color(bestMatch.intent.toUpperCase(), 'brightCyan.bold')} -> Executing [${Logger.color(bestMatch.action, 'brightGreen')} ${args.join(' ')}]`
      );

      return {
        matched: true,
        commandName: bestMatch.action,
        commandObj,
        args,
        confidence: Math.min(100, highestScore)
      };
    }

    // Direct search fallback if query mentions specific keywords
    if (query.length > 2) {
      Logger.ai(`No explicit intent rule triggered. Defaulting to knowledge search for "${query}"`);
      return {
        matched: true,
        commandName: 'search',
        commandObj: registry.get('search'),
        args: [query],
        confidence: 60
      };
    }

    return null;
  }
}

module.exports = new AiParser();
