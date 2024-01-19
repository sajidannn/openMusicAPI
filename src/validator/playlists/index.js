const { PlaylistPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const playlistsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.message);
    }
  },
};

module.exports = playlistsValidator;
