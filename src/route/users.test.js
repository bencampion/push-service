const {matchedData} = require('express-validator/filter')
const mockDate = require('mockdate')
const storage = require('../service/storage')
const underTest = require('./users')

jest.mock('express-validator/filter')
jest.mock('../service/storage')

const req = {body: {username: 'username'}}
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis()
}
const next = jest.fn()

afterEach(() => {
  jest.clearAllMocks()
  mockDate.reset()
})

describe('list users', () => {

  const users = []

  it('sets json response to users array', async () => {
    storage.getAllUsers.mockReturnValue(users)
    underTest.list(req, res, next)
    expect(res.json.mock.calls[0][0]).toBe(users)
  })
})

describe('add user', () => {

  describe('user already exists', () => {

    beforeEach(() => {
      storage.getUserByName.mockReturnValue({})
    })

    it('sets status to 409', () => {
      underTest.add[3](req, res, next)
      expect(res.status.mock.calls[0][0]).toBe(409)
    })

    it('sets json response to error object', () => {
      underTest.add[3](req, res, next)
      expect(res.json.mock.calls[0][0]).toEqual({error: 'User already exists'})
    })
  })

  describe('user does not exist', () => {

    const currentDate = 1e12
    const validatedData = {username: 'username', accessToken: 'token'}
    const savedUser = {
      ...validatedData,
      numOfNotificationsPushed: 0,
      creationTime: new Date(currentDate)
    }

    beforeEach(() => {
      storage.getUserByName.mockReturnValue(null)
      matchedData.mockReturnValue(validatedData)
      mockDate.set(currentDate)
    })

    it('saves user with current date and numOfNotificationsPushed = 0', () => {
      underTest.add[3](req, res, next)
      expect(storage.saveUser.mock.calls[0][0]).toEqual(savedUser)
    })

    it('sets json response to user object', () => {
      underTest.add[3](req, res, next)
      expect(res.json.mock.calls[0][0]).toEqual(savedUser)
    })
  })
})
