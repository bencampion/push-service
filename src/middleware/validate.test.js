const {validationResult} = require('express-validator/check')
const underTest = require('./validate')

jest.mock('express-validator/check')

const req = {}
const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis()
}
const next = jest.fn()

afterEach(() => {
  jest.clearAllMocks()
})

describe('no validation errors', () => {

  it('calls next', () => {
    validationResult.mockReturnValue({
      formatWith: jest.fn().mockReturnThis(),
      isEmpty: () => true
    })
    underTest(req, res, next)
    expect(next.mock.calls.length).toBe(1)
  })
})

describe('validation errors', () => {

  beforeEach(() => {
    validationResult.mockReturnValue({
      formatWith: jest.fn().mockReturnThis(),
      isEmpty: () => false,
      array: () => ['Error 1', 'Error 2']
    })
  })

  it('sets status to 400', () => {
    underTest(req, res, next)
    expect(res.status.mock.calls[0][0]).toBe(400)
  })

  it('sets json response to error object', () => {
    underTest(req, res, next)
    expect(res.json.mock.calls[0][0]).toEqual({error: 'Error 1; Error 2'})
  })
})
