// const drawInIterm = require('iterm2-image');
const getAvatarImageForGithubUsername = require('.').getAvatarImageForGithubUsername

const usernames = process.argv.slice(2)

const spawn = require('child_process').spawn

const catImage = function(avatar, filename){
  return new Promise((resolve, reject) => {
    const catimg = spawn('catimg', [], { stdio: ['pipe', 1, 2, 'ipc'] });
    avatar
      .pipe(catimg.stdin)
      .on('close', (error, result) => {
        error ? reject(error) : resolve(result)
      })
  })
};

usernames.forEach(username => {
  getAvatarImageForGithubUsername(username).then(catImage)
})


