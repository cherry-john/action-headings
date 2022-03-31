const { simpleGit } = require('simple-git');
const core = require('@actions/core');

const gitConnect = async () => {
    const git = simpleGit(".");
    const branchName = "test";
    //add all changes
    git.add(".");
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
        });
}

module.exports = { gitConnect }