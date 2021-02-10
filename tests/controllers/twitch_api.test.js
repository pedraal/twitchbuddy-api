/* eslint no-undef: 0 */

const request = require('supertest')
const app = require('../../src/app')
const { populateDatabase } = require('../fixtures/db')

beforeEach(populateDatabase)

test('test', async () => {
  request(app)
})
