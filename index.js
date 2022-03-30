const core = require('@actions/core');
const { updateAllHeadings } = require('./src/headings');


// most @actions toolkit packages have async methods
async function run() {
  try {
    updateAllHeadings();
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
