const users = new Map()

exports.getUserByName = username => users.get(username)
exports.getAllUsers = () => [...users.values()]
exports.saveUser = user => users.set(user.username, user)
