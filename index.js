const core = require('@actions/core');
const { updateAllHeadings } = require('./src/headings');
const { createBranch } = require('./src/githubBranch');


// most @actions toolkit packages have async methods
async function run() {
  try {
    updateAllHeadings();
    createBranch(String(new Date().getTime()));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
