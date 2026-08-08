/**
 * Logger Utility for FlowerAI Command System
 * Provides rich terminal colors, custom badges, banners, and formatted output.
 */

const ANSI = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',
  
  // Foreground Colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',

  // Background Colors
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgGreen: '\x1b[42m',
  bgRed: '\x1b[41m',
  bgYellow: '\x1b[43m',
};

class Logger {
  static color(text, styleStr) {
    const codes = styleStr.split('.').map(s => ANSI[s] || '').join('');
    return `${codes}${text}${ANSI.reset}`;
  }

  static banner() {
    console.log(ANSI.brightCyan + ANSI.bold + `
  ███████╗██╗      ██████╗ ██╗    ██╗███████╗██████╗      █████╗ ██╗
  ██╔════╝██║     ██╔═══██╗██║    ██║██╔════╝██╔══██╗    ██╔══██╗██║
  █████╗  ██║     ██║   ██║██║ █╗ ██║█████╗  ██████╔╝    ███████║██║
  ██╔══╝  ██║     ██║   ██║██║███╗██║██╔══╝  ██╔══██╗    ██╔══██║██║
  ██║     ███████╗╚██████╔╝╚███╔███╔╝███████╗██║  ██║    ██║  ██║██║
  ╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝    ╚═╝  ╚═╝╚═╝
` + ANSI.reset);
    console.log(ANSI.dim + `  -------------------------------------------------------------` + ANSI.reset);
    console.log(`  ${ANSI.bold}${ANSI.brightGreen}🌸 Flower AI Command System${ANSI.reset} ${ANSI.dim}v1.0.0${ANSI.reset} | ${ANSI.cyan}Enterprise CLI Engine${ANSI.reset}`);
    console.log(ANSI.dim + `  -------------------------------------------------------------\n` + ANSI.reset);
  }

  static info(msg) {
    console.log(` ${ANSI.bgBlue}${ANSI.white}${ANSI.bold} INFO ${ANSI.reset} ${msg}`);
  }

  static success(msg) {
    console.log(` ${ANSI.bgGreen}${ANSI.black}${ANSI.bold} SUCCESS ${ANSI.reset} ${ANSI.brightGreen}${msg}${ANSI.reset}`);
  }

  static warn(msg) {
    console.log(` ${ANSI.bgYellow}${ANSI.black}${ANSI.bold} WARN ${ANSI.reset} ${ANSI.yellow}${msg}${ANSI.reset}`);
  }

  static error(msg) {
    console.log(` ${ANSI.bgRed}${ANSI.white}${ANSI.bold} ERROR ${ANSI.reset} ${ANSI.red}${msg}${ANSI.reset}`);
  }

  static ai(msg) {
    console.log(` ${ANSI.bgMagenta}${ANSI.white}${ANSI.bold} AI PARSER ${ANSI.reset} ${ANSI.brightMagenta}${msg}${ANSI.reset}`);
  }

  static step(stepNum, totalSteps, title) {
    console.log(` ${ANSI.bold}${ANSI.cyan}[${stepNum}/${totalSteps}]${ANSI.reset} ${ANSI.bold}${title}${ANSI.reset}`);
  }

  static box(title, contentLines) {
    const width = 64;
    const border = '═'.repeat(width - 2);
    console.log(`\n${ANSI.cyan}╔${border}╗${ANSI.reset}`);
    console.log(`${ANSI.cyan}║${ANSI.reset} ${ANSI.bold}${title.padEnd(width - 4)}${ANSI.reset} ${ANSI.cyan}║${ANSI.reset}`);
    console.log(`${ANSI.cyan}╠${border}╣${ANSI.reset}`);
    contentLines.forEach(line => {
      console.log(`${ANSI.cyan}║${ANSI.reset} ${line.padEnd(width - 4)} ${ANSI.cyan}║${ANSI.reset}`);
    });
    console.log(`${ANSI.cyan}╚${border}╝${ANSI.reset}\n`);
  }

  static table(headers, rows) {
    if (!rows || rows.length === 0) return;
    
    // Calculate col widths
    const colWidths = headers.map((h, i) => {
      let max = h.length;
      rows.forEach(row => {
        const val = String(row[i] || '');
        // remove ansi codes for length calc
        const cleanVal = val.replace(/\x1b\[[0-9;]*m/g, '');
        if (cleanVal.length > max) max = cleanVal.length;
      });
      return max + 2;
    });

    const renderRow = (arr, isHeader = false) => {
      return arr.map((cell, i) => {
        const cleanCell = String(cell || '').replace(/\x1b\[[0-9;]*m/g, '');
        const padLen = colWidths[i] - cleanCell.length;
        const cellStr = String(cell || '') + ' '.repeat(padLen > 0 ? padLen : 0);
        return isHeader ? `${ANSI.bold}${ANSI.brightCyan}${cellStr}${ANSI.reset}` : cellStr;
      }).join(' │ ');
    };

    const separator = colWidths.map(w => '─'.repeat(w)).join('─┼─');

    console.log('\n ' + renderRow(headers, true));
    console.log(' ' + ANSI.dim + separator + ANSI.reset);
    rows.forEach(row => {
      console.log(' ' + renderRow(row));
    });
    console.log('');
  }
}

module.exports = Logger;
