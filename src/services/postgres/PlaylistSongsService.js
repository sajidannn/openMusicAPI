const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSong(playlistId, songId) {
    const id = `playlist-song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Failed to add playlist song');
    }
  }

  async getPlaylistSongs(playlistId) {
    const playlistQuery = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists
      LEFT JOIN users ON users.id = playlists.owner
      WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const playlistResult = await this._pool.query(playlistQuery);
    if (!playlistResult.rowCount) {
      throw new NotFoundError('Playlist not found');
    }

    const playlist = playlistResult.rows[0];

    const songsQuery = {
      text: `SELECT songs.id, songs.title, songs.performer FROM playlists 
        JOIN playlist_songs ON  playlist_songs.playlist_id = playlists.id
        JOIN songs ON songs.id = playlist_songs.song_id
        WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const songsResult = await this._pool.query(songsQuery);

    playlist.songs = songsResult.rows;

    return playlist;
  }

  async deletePlaylistSong(palylistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [palylistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Failed to delete playlist song, playlist or song not found');
    }
  }
}

module.exports = PlaylistSongsService;
