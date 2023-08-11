const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        //Get input
        const tag = process.env.TAG || process.env.INPUT_TAG || '';
        console.log(`Searching for tag: ${tag}`);

        // Get owner and repo from context of payload that triggered the action
        const { owner, repo } = github.context.repo
        console.log(owner);
        console.log(repo);
        //const github = new GitHub(process.env.GITHUB_TOKEN || core.getInput('github_token'));
        const octokit = github.getOctokit(process.env.GITHUB_TOKEN || core.getInput('github_token'));
        var exists = 'false';

        try {
            const getRefResponse = await octokit.rest.git.getRef({
                owner,
                repo,
                ref: `tags/${tag}`
            });

            if (getRefResponse.status === 200) {
                console.log("Tag was found");
                exists = 'true';
            }

        } catch(error) {
            console.log("Tag was not found");
            console.log(error);
        }

        core.setOutput('exists', exists);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();