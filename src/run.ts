import * as core from '@actions/core'
import * as github from '@actions/github'
// import * as Webhooks from '@octokit/webhooks'

export async function run(): Promise<void> {
  try {
    const pr = github.context.payload.pull_request
    if (!pr) {
      core.setFailed('github.context.payload.pull_request not exis')
      return
    }
    const token = core.getInput('repo-token')
    const message = core.getInput('message')
    core.debug(`message: ${message}`)

    const client = github.getOctokit(token)

    const owner = github.context.repo.owner
    const repo = github.context.repo.repo

    const response = await client.issues.createComment({
      owner,
      repo,
      issue_number: pr.number,
      body: message
    })
    core.debug(`create comment URL: ${response.data.html_url}`)

    core.setOutput('comment-url', response.data.html_url)
  } catch (error) {
    core.setFailed(error.message)
  }
}
