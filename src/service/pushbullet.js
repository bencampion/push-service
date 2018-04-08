const got = require('got')

const pushbulletApi = {
  protocol: 'https:',
  host:'api.pushbullet.com',
  json: true
}

function createPush(accessToken, push) {
  const options = {
    ...pushbulletApi,
    method: 'POST',
    headers: {
      'Access-Token': accessToken
    },
    body: push
  }
  return got('/v2/pushes', options)
}

exports.createPush = createPush
