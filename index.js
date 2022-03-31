const core = require('@actions/core');
const { updateAllHeadings } = require('./src/headings');
const { gitConnect } = require('./src/githubBranch');


// most @actions toolkit packages have async methods
async function run() {
  try {
    updateAllHeadings();
    gitConnect();
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
