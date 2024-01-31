exports.up = (pgm) => {
  pgm.createTable('user_album_likes', {
    id: {
      type: 'varchar(30)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(25)',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
    album_id: {
      type: 'varchar(25)',
      notNull: true,
      references: '"albums"',
      onDelete: 'cascade',
    },
  });

  pgm.addColumn('albums', {
    likes: {
      type: 'INTEGER',
      notNull: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('user_album_likes');
  pgm.dropColumn('albums', 'cover');
};
