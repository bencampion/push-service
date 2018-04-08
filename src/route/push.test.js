const {matchedData} = require('express-validator/filter')
const pushbullet = require('../service/pushbullet')
const storage = require('../service/storage')
const underTest = require('./push')

jest.mock('express-validator/filter')
jest.mock('../service/pushbullet')
jest.mock('../service/storage')

const req = {params: {username: 'username'}}
const res = {json: jest.fn()}
const next = jest.fn()

afterEach(() => {
  jest.clearAllMocks()
})

describe('user does not exist', () => {

  it('calls next', async () => {
    storage.getUserByName.mockReturnValue(null)
    await underTest.send[4](req, res, next)
    expect(next.mock.calls.length).toBe(1)
  })
})

describe('create push succeeds', () => {

  const push = {title: 'title', body: 'body'}
  const accessToken = 'token'
  let user

  beforeEach(() => {
    user = {accessToken, numOfNotificationsPushed: 0}
    storage.getUserByName.mockReturnValue(user)
    pushbullet.createPush.mockResolvedValue()
    matchedData.mockReturnValue(push)
  })

  it('increments numOfNotificationsPushed', async () => {
    await underTest.send[4](req, res, next)
    expect(user.numOfNotificationsPushed).toBe(1)
  })

  it('sets json response to push object', async () => {
    await underTest.send[4](req, res, next)
    expect(res.json.mock.calls[0][0]).toBe(push)
  })
})

describe('create push fails', () => {

  const error = new Error()

  it('calls next with error', async () => {
    storage.getUserByName.mockReturnValue({})
    pushbullet.createPush.mockRejectedValue(error)
    await underTest.send[4](req, res, next)
    expect(next.mock.calls[0][0]).toBe(error)
  })
})
