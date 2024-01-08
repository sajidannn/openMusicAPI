const { albumPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const albumsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = albumPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.message);
    }
  },
};

module.exports = albumsValidator;
