const autoBind = require('auto-bind');

class PlaylistSongsActivitiesHandler {
  constructor(playlistsService, playlistSongsActivitiesService) {
    this._playlistsService = playlistsService;
    this._playlistSongsActivitiesService = playlistSongsActivitiesService;

    autoBind(this);
  }

  async getPlaylistSongsActivitiesHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(id, credentialId);
    const { playlistId, activities } = await this._playlistSongsActivitiesService
      .getPlaylistSongsActivities(id);

    const response = h.response({
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    });

    return response;
  }
}

module.exports = PlaylistSongsActivitiesHandler;
