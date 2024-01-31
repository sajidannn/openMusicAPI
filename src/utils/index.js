/* eslint-disable camelcase */
const songDBToModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
});

const albumToModel = ({
  id, name, year, songs, cover,
}) => ({
  id, name, year, songs, coverUrl: cover,
});

module.exports = { songDBToModel, albumToModel };
