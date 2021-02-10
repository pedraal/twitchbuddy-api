/* eslint no-undef: 0 */
const request = require('supertest')
const app = require('../../src/app')
const { TwitchApi } = require('../../src/modules/twitch_api')
const ApiToken = require('../../src/models/api_token')
const { populateDatabase } = require('../fixtures/db')

request(app)
beforeEach(populateDatabase)

test('should get oauth token', async () => {
  const api = new TwitchApi()
  await api.getOauthToken()

  const tokensCount = await ApiToken.countDocuments()
  expect(tokensCount).toBe(1)
})

test('should validate api token', async () => {
  const api = new TwitchApi()
  await api.getOauthToken()

  const { token } = await ApiToken.findOne()
  const valid = await api.validateToken(token)
  expect(valid).toBeTruthy()
})

test('should not validate wrong api token', async () => {
  const api = new TwitchApi()

  const valid = await api.validateToken('not valid token')
  expect(valid).toBeFalsy()
})

test('should prepare axios api instance', async () => {
  const api = new TwitchApi()
  await api.setupAxios()

  const { token } = await ApiToken.findOne()

  expect(api.axios.defaults.headers.common.Authorization).toBe(`Bearer ${token}`)
})

test('should prepare axios api instance using existing token', async () => {
  const api = new TwitchApi()
  await api.getOauthToken()

  const { token } = await ApiToken.findOne()
  await api.setupAxios()
  expect(api.axios.defaults.headers.common.Authorization).toBe(`Bearer ${token}`)
})

test('should return clips', async () => {
  const api = new TwitchApi()
  await api.setupAxios()

  const { data } = await api.getAndPrepareClips({ channel: 'zerator' })
  expect(data.length).toBeGreaterThan(0)
})

test('should return replays', async () => {
  const api = new TwitchApi()
  await api.setupAxios()
  const channelId = await api.getChannelId('zerator')
  const { data } = await api.getReplays(channelId)
  expect(data.length).toBeGreaterThan(0)
})
