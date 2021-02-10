module.exports = {
  updateFavorites: async (req) => {
    req.user.favorites = req.body
    await req.user.save()

    return req.user.favorites
  }
}
