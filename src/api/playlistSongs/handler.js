const autoBind = require('auto-bind');

class PlaylistSongsHandler {
  constructor(
    songsService,
    playlistsService,
    playlistSongsService,
    playlistSongsActivitiesService,
    validator,
  ) {
    this._songsService = songsService;
    this._playlistsService = playlistsService;
    this._playlistSongsService = playlistSongsService;
    this._playlistSongsActivitiesService = playlistSongsActivitiesService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongsPayload(request.payload);
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params; // playlistId

    await this._songsService.getSongById(songId);
    await this._playlistsService.verifyPlaylistAccess(id, credentialId);

    await this._playlistSongsService.addPlaylistSong(id, songId);

    const action = 'add';
    const time = new Date().toISOString();
    await this._playlistSongsActivitiesService.addPlaylistSongsActivities(id, {
      songId,
      userId: credentialId,
      action,
      time,
    });

    const response = h.response({
      status: 'success',
      message: 'Playlist song successfully added',
    });

    response.code(201);
    return response;
  }

  async getPlaylistSongsHandler(request, h) {
    const { id } = request.params; // playlistId
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);
    const playlist = await this._playlistSongsService.getPlaylistSongs(id);

    const response = h.response({
      status: 'success',
      data: {
        playlist,
      },
    });

    return response;
  }

  async deletePlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongsPayload(request.payload);
    const { id } = request.params; // playlistId
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);
    await this._playlistSongsService.deletePlaylistSong(id, songId);

    const action = 'delete';
    const time = new Date().toISOString();
    await this._playlistSongsActivitiesService.addPlaylistSongsActivities(id, {
      songId,
      userId: credentialId,
      action,
      time,
    });

    const response = h.response({
      status: 'success',
      message: 'Playlist song successfully deleted',
    });

    return response;
  }
}

module.exports = PlaylistSongsHandler;
