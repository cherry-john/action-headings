const { getOctokit, context } = require('@actions/github');
const crypto = require('crypto');

async function createBranch(branchName) {
    const toolkit = getOctokit(process.env.GITHUB_TOKEN);

    let ref = "refs/heads/"+branchName;
    let hasher = crypto.createHash('sha1');
    hasher.update(ref);
    let hash = hasher.digest('hex');

    toolkit.rest.git.createRef({
        owner: "",
        repo: context.repo,
        ref: ref,
        sha: hash        
    });
}

module.exports = { createBranch }