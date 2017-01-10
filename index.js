const fs = require('fs')
const request = require('request')
const requestPromise = require('request-promise')
const cheerio = require('cheerio')

const getAvatarURIForGithubUsername = username => {
  return requestPromise({
    uri: `https://github.com/${username}`,
    transform: body => cheerio.load(body),
  })
  .then($ => {
    return $('.avatar').attr('src')
  })
}

const getAvatarImageForGithubUsername = username => {
  return getAvatarURIForGithubUsername(username).then(avatarUrl => {
    return requestPromise(avatarUrl)
  })
}



module.exports = {
  getAvatarURIForGithubUsername: getAvatarURIForGithubUsername,
  getAvatarImageForGithubUsername: getAvatarImageForGithubUsername,
}
