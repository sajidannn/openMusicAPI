const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class UserAlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addLikeAlbum(albumId, userId) {
    const checkQuery = {
      text: 'SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };
    const resultCheck = await this._pool.query(checkQuery);
    if (resultCheck.rowCount) {
      throw new InvariantError('You have already liked this album');
    }

    const id = `album-like${nanoid(16)}`;
    const addLikeQuery = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };
    const result = await this._pool.query(addLikeQuery);
    if (!result.rows[0].id) {
      throw new InvariantError('Failed to add like');
    }

    const updateLikesQuery = {
      text: 'UPDATE albums SET likes = COALESCE(likes, 0) + 1 WHERE id = $1',
      values: [albumId],
    };
    await this._pool.query(updateLikesQuery);
    await this._cacheService.del(`albumLikes:${albumId}`);
  }

  async getLikes(albumId) {
    try {
      const result = await this._cacheService.get(`albumLikes:${albumId}`);
      return {
        likes: JSON.parse(result),
        source: 'cache',
      };
    } catch (error) {
      const query = {
        text: 'SELECT likes FROM albums WHERE id = $1',
        values: [albumId],
      };
      const result = await this._pool.query(query);
      await this._cacheService.set(`albumLikes:${albumId}`, JSON.stringify(result.rows[0].likes));
      return {
        likes: result.rows[0].likes,
        source: 'database',
      };
    }
  }

  async deleteLikeAlbum(albumId, userId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Failed to delete like');
    }

    const updateLikesQuery = {
      text: 'UPDATE albums SET likes = COALESCE(likes, 0) - 1 WHERE id = $1',
      values: [albumId],
    };
    await this._pool.query(updateLikesQuery);
    await this._cacheService.del(`albumLikes:${albumId}`);
  }
}

module.exports = UserAlbumLikesService;
