#!/usr/bin/env node

const executor = require('../command-engine/executor');

(async () => {
  try {
    await executor.execute(process.argv);
  } catch (err) {
    console.error(`\x1b[31mFatal Error in flower-ai CLI: ${err.message}\x1b[0m`);
    process.exit(1);
  }
})();
