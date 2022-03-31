const { simpleGit } = require('simple-git');
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
}

/**
 * 
 * @param {simpleGit} git 
 */
const commitAndPush = async (git) => {
    await git
        .commit("Correct HTML Headings", "")
        .then(() => {
            core.info("Commit Created");
        })
        .catch((err) => {
            core.error(err);
        });
    await git
        .push()
        .catch((err) => {
            core.error(err);
        })
}

const gitConnect = async () => {
    const git = simpleGit(".");
    //add all changes
    git.add(".");
    createBranch(git, "Test");
    commitAndPush(git);
}

module.exports = { gitConnect }