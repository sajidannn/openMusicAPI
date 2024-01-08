const { songPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const songsValidator = {
  validateSongPayload: (payload) => {
    const validationResult = songPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.message);
    }
  },
};

module.exports = songsValidator;
