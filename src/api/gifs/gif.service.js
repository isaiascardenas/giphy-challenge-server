const pool = require("../../config/database");

module.exports = {
  totalGifs: (data, callBack) => {
    pool.query(
      `SELECT COUNT(*) AS count FROM gifs WHERE slug LIKE ?`,
      ["%" + data.title + "%"],
      (error, results, _) => {
        if (error) {
          throw error;
        }
        return callBack(results[0]);
      },
    );
  },
  getGifs: (data, callBack) => {
    pool.query(
      `SELECT id, title, giphy_id, slug, url, created_at, updated_at FROM gifs ORDER BY id DESC LIMIT ? OFFSET ?`,
      [data.pageSize, data.offset],
      (error, results, _) => {
        if (error) {
          throw error;
        }
        return callBack(results);
      },
    );
  },
  getGifsByTitle: (data, callBack) => {
    pool.query(
      `SELECT id, title, giphy_id, slug, url, created_at, updated_at FROM gifs WHERE slug LIKE ? LIMIT ? OFFSET ?`,
      ["%" + data.title + "%", data.pageSize, data.offset],
      (error, results, _) => {
        if (error) {
          throw error;
        }
        return callBack(results);
      },
    );
  },
  getGifById: (id, callBack) => {
    pool.query(
      `SELECT id, title, giphy_id, slug, url, created_at, updated_at FROM gifs WHERE id = ? LIMIT 1`,
      [id],
      (error, results, _) => {
        if (error) {
          throw error;
        }
        return callBack(results);
      },
    );
  },
  createGif: (data, callBack) => {
    pool.query(
      `INSERT INTO gifs(title, giphy_id, slug, url) VALUES (?,?,?,?)`,
      [data.title, data.giphy_id, data.slug, data.url],
      (error, results, _) => {
        if (error) {
          throw error;
        }
        return callBack(results);
      },
    );
  },
  updateGif: (data, callBack) => {
    pool.query(
      `UPDATE gifs SET title=?, giphy_id=?, slug=?, url=? WHERE id = ?`,
      [data.title, data.giphy_id, data.slug, data.url, data.id],
      (error, results, _) => {
        if (error) {
          throw error;
        }
        return callBack(results);
      },
    );
  },
  deleteGif: (id, callBack) => {
    pool.query(`DELETE FROM gifs WHERE id = ?`, [id], (error, results, _) => {
      if (error) {
        throw error;
      }
      return callBack(results);
    });
  },
  //
  updateUser: (data, callBack) => {
    pool.query(
      `update registration set firstName=?, lastName=?, gender=?, email=?, password=?, number=? where id = ?`,
      [
        data.first_name,
        data.last_name,
        data.gender,
        data.email,
        data.password,
        data.number,
        data.id,
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      },
    );
  },
};
