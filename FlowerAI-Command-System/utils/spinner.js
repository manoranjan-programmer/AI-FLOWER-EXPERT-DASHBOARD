/**
 * Loading Spinner Utility for CLI execution feedback
 */

const Logger = require('./logger');

class Spinner {
  constructor(text = 'Processing...') {
    this.text = text;
    this.frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    this.interval = null;
    this.currentFrame = 0;
  }

  start(text) {
    if (text) this.text = text;
    this.currentFrame = 0;
    process.stdout.write('\x1B[?25l'); // Hide cursor

    this.interval = setInterval(() => {
      const frame = this.frames[this.currentFrame % this.frames.length];
      const cyanFrame = Logger.color(frame, 'brightCyan.bold');
      process.stdout.write(`\r ${cyanFrame} ${this.text}   `);
      this.currentFrame++;
    }, 80);

    return this;
  }

  update(text) {
    this.text = text;
  }

  stop(successMsg, isError = false) {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    process.stdout.write('\r\x1B[K'); // Clear current line
    process.stdout.write('\x1B[?25h'); // Show cursor

    if (isError) {
      Logger.error(successMsg || 'Operation failed.');
    } else if (successMsg) {
      Logger.success(successMsg);
    }
  }

  succeed(msg) {
    this.stop(msg, false);
  }

  fail(msg) {
    this.stop(msg, true);
  }
}

module.exports = Spinner;
