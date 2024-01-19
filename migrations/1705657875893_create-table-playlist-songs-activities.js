exports.up = (pgm) => {
  pgm.createTable('playlist_songs_activities', {
    id: {
      type: 'VARCHAR(25)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(30)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(25)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(25)',
      notNull: true,
    },
    action: {
      type: 'VARCHAR(25)',
      notNull: true,
    },
    time: {
      type: 'VARCHAR(30)',
      notNull: true,
    },
  });

  pgm.addConstraint(
    'playlist_songs_activities',
    'fk_playlist_songs_activities.playlist_id_playlists.id',
    'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.playlist_id_playlists.id');

  pgm.dropTable('playlist_songs');
};
