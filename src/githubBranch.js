const simpleGit = require('simple-git');
const core = require('@actions/core');
const github = require('@actions/github');
const { context } = require('@actions/github');

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
            core.info(branchName + " already exists, creating commit on this branch");
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

const createPR = async (branchName) => {
    const octokit = github.getOctokit(core.getInput('githubToken'));
    core.info(context.owner);
    core.info(context.repo);
    await octokit.rest.pulls.create({
        owner: context.owner,
        repo: context.repo,
        head: branchName,
        base: core.getInput('defaultBranch'),
        title: "Merge HTML Heading Changes"
    })
    .then((data) => {
        core.setOutput("pull", data.url);
    })
    .catch((err) => {
        core.setFailed(err);
    });
}

const gitConnect = async () => {
    const git = simpleGit(".");
    const branchName = "test" + String(new Date().getTime());
    //set user config to github bot
    await git
        .addConfig('user.name', "github-actions[bot]")
        .addConfig('user.email', "github-actions[bot]@users.noreply.github.com");
    //add all changes
    git.add(".");
    if ((await git.diffSummary(['--cached'])).files.length > 0 ){
        //There are changed files so commit them
        await createBranch(git, branchName);
        //generate the PR for this branch
        await createPR(branchName);
    } else {
        //no changes, just log and return
        core.log("No changes to files!");
    }
}

module.exports = { gitConnect }