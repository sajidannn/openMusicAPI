const { Pool } = require('pg');
const { nanoid } = require('nanoid');

class PlaylistSongsActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSongsActivities(playlistId, {
    songId, userId, action, time,
  }) {
    const id = `activity-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs_activities VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, playlistId, songId, userId, action, time],
    };

    await this._pool.query(query);
  }

  async getPlaylistSongsActivities(playlistId) {
    const query = {
      text: `SELECT B.username, C.title, A.action, A.time FROM playlist_songs_activities A
        LEFT JOIN users B ON B.id = A.user_id
        LEFT JOIN songs C ON C.id = A.song_id
        WHERE A.playlist_id = $1
        ORDER BY A.action`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return {
      playlistId, activities: result.rows,
    };
  }
}

module.exports = PlaylistSongsActivitiesService;
