const {validationResult} = require('express-validator/check')

function validate(req, res, next) {
  const errors = validationResult(req).formatWith(errorFormatter)
  if (errors.isEmpty()) {
    return next()
  }
  res.status(400).json({error: errors.array().join('; ')})
}

function errorFormatter({param, msg, nestedErrors}) {
  return nestedErrors ? msg : `${param}: ${msg}`
}

module.exports = validate
