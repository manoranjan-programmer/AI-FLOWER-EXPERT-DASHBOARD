/**
 * Browser Service
 * Handles launching URLs in default web browser using native OS commands.
 */

const { exec } = require('child_process');
const Logger = require('../utils/logger');
const config = require('../config/config-manager');

class BrowserService {
  static openUrl(url, routeName = '') {
    return new Promise((resolve) => {
      const platform = process.platform;
      let command = '';

      if (platform === 'win32') {
        command = `start "" "${url}"`;
      } else if (platform === 'darwin') {
        command = `open "${url}"`;
      } else {
        command = `xdg-open "${url}"`;
      }

      const label = routeName ? `[Route: ${routeName}] ` : '';
      Logger.info(`Opening ${label}${Logger.color(url, 'brightCyan.underline')}`);

      exec(command, (error) => {
        if (error) {
          Logger.warn(`Could not open browser automatically: ${error.message}`);
          Logger.info(`You can open the URL manually in your browser: ${url}`);
          resolve({ success: false, url, error: error.message });
        } else {
          Logger.success(`Browser opened successfully!`);
          resolve({ success: true, url });
        }
      });
    });
  }

  static openRoute(routeName) {
    const targetUrl = config.getRouteUrl(routeName);
    return this.openUrl(targetUrl, routeName);
  }
}

module.exports = BrowserService;
