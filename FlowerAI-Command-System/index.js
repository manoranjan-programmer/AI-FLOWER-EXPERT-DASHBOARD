/**
 * FlowerAI Command System - Standalone Node Module Export
 */

const registry = require('./registry/command-registry');
const executor = require('./command-engine/executor');
const aiParser = require('./parser/ai-parser');
const cliParser = require('./parser/cli-parser');
const config = require('./config/config-manager');
const history = require('./command-engine/history');
const aliases = require('./command-engine/aliases');
const pluginLoader = require('./command-engine/plugin-loader');
const Logger = require('./utils/logger');
const Spinner = require('./utils/spinner');
const BrowserService = require('./services/browser-service');
const ExportService = require('./services/export-service');
const ReportService = require('./services/report-service');
const ApiService = require('./services/api-service');

module.exports = {
  registry,
  executor,
  aiParser,
  cliParser,
  config,
  history,
  aliases,
  pluginLoader,
  Logger,
  Spinner,
  services: {
    BrowserService,
    ExportService,
    ReportService,
    ApiService
  }
};
