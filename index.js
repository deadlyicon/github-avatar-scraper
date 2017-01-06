const fs = require('fs')
const request = require('request')
const requestPromise = require('request-promise')
const cheerio = require('cheerio')

const getAvatarURIForGithubUsername = username => {
  return requestPromise({
    uri: `https://github.com/${username}`,
    transform: body => cheerio.load(body),
  })
  .then($ => $('.avatar').attr('src'))
    // const avatar = $('.avatar').attr('src')
    // console.log(`${username}:`)
    // catImage(avatar)
    // return {username, avatar}
  // })
}

const getAvatarImageForGithubUsername = username => {
  return getAvatarURIForGithubUsername(username).then(request)
}



module.exports = {
  getAvatarURIForGithubUsername: getAvatarURIForGithubUsername,
  getAvatarImageForGithubUsername: getAvatarImageForGithubUsername,
}
