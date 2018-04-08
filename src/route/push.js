const {body, oneOf} = require('express-validator/check')
const {matchedData} = require('express-validator/filter')
const pushbullet = require('../service/pushbullet')
const storage = require('../service/storage')
const validate = require('../middleware/validate')

async function send(req, res, next) {
  const user = storage.getUserByName(req.params.username)
  if (!user) {
    return next()
  }
  const push = matchedData(req)
  try {
    await pushbullet.createPush(user.accessToken, push)
    user.numOfNotificationsPushed++
    res.json(push)
  } catch (err) {
    err.expose = true
    next(err)
  }
}

exports.send = [
  body('title').exists(),
  body('body').exists(),
  oneOf([
    [body('type').equals('note')],
    [body('type').equals('link'), body('url').isURL()]
  ]),
  validate,
  send
]
