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

test('Should retrieve channel id', async () => {
  const api = new TwitchApi()
  await api.setupAxios()
  const id = await api.getChannelId('zerator')
  expect(id.length).toBeGreaterThan(0)
})

test('Should retrieve channel ids', async () => {
  const api = new TwitchApi()
  await api.setupAxios()
  const users = await api.getChannelId(['toneeuw', 'woodspices'])
  expect(users.length).toBeGreaterThan(0)
  expect(users[0].id.length).toBeDefined()
})

test('Should retrieve clips', async () => {
  const api = new TwitchApi()
  await api.setupAxios()
  const channelId = await api.getChannelId('zerator')
  const { data: clips, pagination } = await api.getClips({ broadcaster_id: channelId })
  expect(clips.length).toBeGreaterThan(0)
  expect(pagination).toBeDefined()
})

test('Should retrieve games', async () => {
  const api = new TwitchApi()
  await api.setupAxios()
  const channelId = await api.getChannelId('zerator')
  const { data: clips } = await api.getClips({ broadcaster_id: channelId })
  const gameIds = clips.map(clip => clip.game_id)
  const games = await api.getGames(gameIds)
  expect(games.length).toBeGreaterThan(0)
  expect(games[0].name).toBeDefined()
})

test('Should retrieve and prepare clips', async () => {
  const api = new TwitchApi()
  await api.setupAxios()
  const { data: clips, pagination } = await api.getAndPrepareClips({ channel: 'zerator' })
  expect(clips.length).toBeGreaterThan(0)
  expect(clips[0].title).toBeDefined()
  expect(clips[0].downloadLink).toBeDefined()
  expect(clips[0].category).toBeDefined()
  expect(pagination).toBeDefined()
})

test('Should retrieve replays', async () => {
  const api = new TwitchApi()
  await api.setupAxios()
  const channelId = await api.getChannelId('zerator')
  const { data: replays } = await api.getReplays(channelId)
  expect(replays.length).toBeGreaterThan(0)
  expect(replays[0].ended_at).toBeDefined()
})
