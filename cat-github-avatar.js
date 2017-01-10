#!/usr/bin/env node

const fs = require('fs')
const request = require('request')
const getAvatarURIForGithubUsername = require('.').getAvatarURIForGithubUsername
const spawn = require('child_process').spawn
const usernames = process.argv.slice(2)
const chalk = require('chalk')

const catImage = function(filePath){
  return new Promise((resolve, reject) => {
    spawn('catimg', [filePath], {stdio: 'inherit'})
    .on('close', (exitCode) => {
      exitCode > 0
        ? reject(`catimg closed with ${exitCode}`)
        : resolve(filePath)
    })
  })
};

const saveImage = function(username, avatarURI){
  return new Promise((resolve, reject) => {
    const path = `${__dirname}/avatars/${username}.png`
    const file = fs.createWriteStream(path)
    request.get(avatarURI)
      .pipe(file)
      .on('close', (error, result) => {
        error ? reject(error) : resolve(path)
      })
  })
}

Promise.all(
  usernames.map(username =>
    getAvatarURIForGithubUsername(username)
      .then(avatarURI => saveImage(username, avatarURI))
      .catch(error => false)
      .then(avatarPath => {
        avatarPath
          ? process.stdout.write(chalk.green("✓"))
          : process.stdout.write(chalk.red("X"))
        return avatarPath
      })
  )
).then(avatarPaths => {
  console.log()
  let promise = Promise.resolve()
  usernames.forEach((username, index) => {
    const avatarPath = avatarPaths[index]
    promise = promise.then(_ => {
      console.log(`${username}`)
      if (avatarPath){
        return catImage(avatarPath)
      }else{
        console.log(chalk.red(`FAILED to load avatar`))
        return catImage(__dirname+'/failwhale.png')
      }
    })
  })
  return promise
})
.catch(error => {
  console.error(error)
  process.exit(1)
})
