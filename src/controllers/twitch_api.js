const { TwitchApi } = require('../modules/twitch_api')

const getClips = async (req) => {
  const api = new TwitchApi()
  await api.setupAxios()

  const params = req.query
  return await api.getAndPrepareClips(params)
}

const getReplays = async (req) => {
  const api = new TwitchApi()
  await api.setupAxios()

  const params = req.query
  const channels = params.channels.split(',')
  const broadcasters = await api.getChannelId(channels)
  const collections = await Promise.all(
    broadcasters.map(async (channel) => {
      const { data: replays } = await api.getReplays(channel.id)
      channel.videos = replays
      return channel
    })
  )

  return collections
}

module.exports = {
  getClips,
  getReplays
}
