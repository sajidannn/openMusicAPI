const autoBind = require('auto-bind');

class UserAlbumLikesHandler {
  constructor(userAlbumLikesService, albumsService) {
    this._userAlbumLikesService = userAlbumLikesService;
    this._albumsService = albumsService;

    autoBind(this);
  }

  async postAlbumLikeHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._albumsService.getAlbumById(id);
    await this._userAlbumLikesService.addLikeAlbum(id, credentialId);
    return h.response({
      status: 'success',
      message: 'Success to like this album',
    }).code(201);
  }

  async getAlbumLikesHandler(request, h) {
    const { id } = request.params;
    await this._albumsService.getAlbumById(id);
    const result = await this._userAlbumLikesService.getLikes(id);
    const response = h.response({
      status: 'success',
      data: {
        likes: result.likes,
      },
    });
    // response.code(200);
    response.header('X-Data-Source', result.source);
    return response;
  }

  async deleteAlbumLikesHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._albumsService.getAlbumById(id);
    await this._userAlbumLikesService.deleteLikeAlbum(id, credentialId);
    return h.response({
      status: 'success',
      message: 'Cancel like on this album',
    }).code(200);
  }
}

module.exports = UserAlbumLikesHandler;
