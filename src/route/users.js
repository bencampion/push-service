const {body} = require('express-validator/check')
const {matchedData} = require('express-validator/filter')
const storage = require('../service/storage')
const validate = require('../middleware/validate')

function list(req, res, next) {
  res.json(storage.getAllUsers())
}

function add(req, res, next) {
  if (storage.getUserByName(req.body.username)) {
    return res.status(409).json({error: 'User already exists'})
  }
  const user = matchedData(req)
  user.creationTime = new Date(),
  user.numOfNotificationsPushed = 0
  storage.saveUser(user)
  res.json(user)
}

exports.list = list
exports.add = [
  body('username').exists(),
  body('accessToken').exists(),
  validate,
  add
]
