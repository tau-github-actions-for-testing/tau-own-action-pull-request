const core = require('@actions/core');
const github = require('@actions/github');

const main = async () => {
  try {
    // In from GitHub Pull Request
    const owner = core.getInput('owner', { required: true });
    const repo = core.getInput('repo', { required: true });
    const pr_number = core.getInput('pr_number', { required: true });
    const token = core.getInput('token', { required: true });

    // GitHub's REST API endpoints.
    const octokit = new github.getOctokit(token);

    // fetch the list of files that were changes in the Pull Request
    const { data: changedFiles } = await octokit.rest.pulls.listFiles({
      owner,
      repo,
      pull_number: pr_number,
    });

    let diffData = {
      additions: 0,
      deletions: 0,
      changes: 0,
    };

    diffData = changedFiles.reduce((acc, file) => {
      acc.additions += file.additions;
      acc.deletions += file.deletions;
      acc.changes += file.changes;
      return acc;
    }, diffData);

    for (const file of changedFiles) {
      // Add labels according to file types.
      const fileExtension = file.filename.split('.').pop();
      switch (fileExtension) {
        case 'md':
          await octokit.rest.issues.addLabels({
            owner,
            repo,
            issue_number: pr_number,
            labels: ['markdown'],
          });
          break;
        case 'js':
          await octokit.rest.issues.addLabels({
            owner,
            repo,
            issue_number: pr_number,
            labels: ['javascript'],
          });
          break;
        case 'ts':
          await octokit.rest.issues.addLabels({
            owner,
            repo,
            issue_number: pr_number,
            labels: ['typescript'],
          });
          break;
        case 'java':
          await octokit.rest.issues.addLabels({
            owner,
            repo,
            issue_number: pr_number,
            labels: ['java'],
          });
          break;
        case 'yml':
        case 'yaml':
          await octokit.rest.issues.addLabels({
            owner,
            repo,
            issue_number: pr_number,
            labels: ['yaml'],
          });
          break;
        default:
          await octokit.rest.issues.addLabels({
            owner,
            repo,
            issue_number: pr_number,
            labels: ['other'],
          });
      }
    }

    // add a comment to the PR what has changed
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: pr_number,
      body: `
        Pull Request #${pr_number} has been updated with: \n
        - ${diffData.changes} changes \n
        - ${diffData.additions} additions \n
        - ${diffData.deletions} deletions \n
      `,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
};

main();
