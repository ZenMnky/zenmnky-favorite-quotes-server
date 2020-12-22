const FavoriteQuotesServices = {
  getAllQuotes(db) {
    return db
      .select('*')
      .from('favorite_quotes');
  },
  insertQuote(db, newQuote) {
    return db
      .insert(newQuote)
      .into('favorite_quotes')
      .returning('*')
      .then(rows => {
        return rows[0];
      });
  },
  getById(db, id) {
    return db
      .select('*')
      .from('favorite_quotes')
      .where({ id: id })
      .first();
  },
  deleteQuote(db, id) {
    return db
      .from('favorite_quotes')
      .where({ id })
      .delete();
  },
  updateQuote(db, id, newData) {
    return db
      .from('favorite_quotes')
      .where({ id })
      .update(newData);
  }
};

module.exports = FavoriteQuotesServices;