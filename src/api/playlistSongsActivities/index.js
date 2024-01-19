const PlaylistSongsActivitiesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistSongsActivities',
  version: '1.0.0',
  register: async (server, { playlistsService, playlistSongsActivitiesService }) => {
    const playlistSongsActivitiesHandler = new PlaylistSongsActivitiesHandler(
      playlistsService,
      playlistSongsActivitiesService,
    );
    server.route(routes(playlistSongsActivitiesHandler));
  },
};
