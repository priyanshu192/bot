const axios = require('axios');
const { Octokit } = require('@octokit/core');
const { PasteClient } = require('pastebin-api');

module.exports.config = {
    name: "test",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Your Name",
    description: "Apply the raw code from a Pastebin link to a file in your GitHub repository",
    commandCategory: "Admin",
    usages: "[pastebinLink] [repositoryOwner] [repositoryName] [filePath]",
    cooldowns: 0,
    dependencies: {}
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;

    // Check if the senderID matches the specific user's ID
 //   if (senderID !== "YOUR_USER_ID_HERE") return api.sendMessage("You do not have permission to use this command.", threadID, messageID);

    const pastebinLink = args[0];
    const repoOwner = args[1];
    const repoName = args[2];
    const filePath = args[3];

    if (!pastebinLink || !repoOwner || !repoName || !filePath) return api.sendMessage("Please provide a Pastebin link, repository owner, repository name, and file path.", threadID, messageID);

    try {
        const client = new PasteClient("R02n6-lNPJqKQCd5VtL4bKPjuK6ARhHb");
        const octokit = new Octokit({ auth: "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" });

        const rawCode = await axios.get(pastebinLink).then(res => res.data);

        // Check if the file exists in the GitHub repository
        let fileData;
        try {
            fileData = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
                owner: repoOwner,
                repo: repoName,
                path: filePath
            });
        } catch (error) {
            // If the file is not found, set fileData to null
            fileData = null;
        }

        // If the file exists, update its content; otherwise, create a new file
        const sha = fileData ? fileData.data.sha : null;
        const encodedContent = Buffer.from(rawCode).toString('base64');
        const commitMessage = "Apply raw code from Pastebin";

        const requestOptions = {
            owner: repoOwner,
            repo: repoName,
            path: filePath,
            message: commitMessage,
            content: encodedContent,
            sha: sha
        };

        if (sha) {
            await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', requestOptions);
        } else {
            await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
                ...requestOptions,
                branch: "main" // Change the branch as needed
            });
        }

        api.sendMessage("Raw code applied successfully.", threadID, messageID);
    } catch (error) {
        console.error("Error:", error);
        api.sendMessage("An error occurred while applying raw code from Pastebin to the file.", threadID, messageID);
    }
}
