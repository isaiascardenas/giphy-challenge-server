const {
  getGifs,
} = require("./gif.service");

module.exports = {
  getGifs: (_, res) => {
    getGifs((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        message: 'success',
        data: results
      });
    });
  },
};
