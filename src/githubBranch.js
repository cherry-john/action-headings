const simpleGit = require('simple-git');
const core = require('@actions/core');

/**
 * 
 * @param {simpleGit} git 
 * @param {String} branchName 
 */
const createBranch = async (git, branchName) => {
    //check if branch already exists
    await git
        .checkout(branchName)
        .then (() => {
            //checked out so branch exists
            core.info(branchName + " already exists, creating PR on this branch");
        })
        .catch(() => {
            //doesn't exist so create
            core.info("Creating branch " + branchName);
            return git.checkoutLocalBranch(branchName);
        });

    await git
        .commit("Correct HTML Headings")
        .then(() => {
            core.info("Commit Created");
        })
        .catch((err) => {
            core.setFailed(err);
        });
    await git
        .push("origin", branchName, { '--set-upstream': null })
        .catch((err) => {
            core.setFailed(err);
        });
}

const gitConnect = async () => {
    const git = simpleGit(".");
    //set user config to github bot
    await git
        .addConfig('user.name', "github-actions[bot]")
        .addConfig('user.email', "github-actions[bot]@users.noreply.github.com");
    //add all changes
    git.add(".");
    createBranch(git, "Test" );
}

module.exports = { gitConnect }