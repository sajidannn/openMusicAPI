const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistSongs',
  version: '1.0.0',
  register: async (server, {
    songsService, playlistsService, playlistSongsService, playlistSongsActivitiesService, validator,
  }) => {
    const playlistSongsHandler = new PlaylistSongsHandler(
      songsService,
      playlistsService,
      playlistSongsService,
      playlistSongsActivitiesService,
      validator,
    );
    server.route(routes(playlistSongsHandler));
  },
};
