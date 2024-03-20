const slug = require("slug");
const {
  totalGifs,
  getGifs,
  getGifsByTitle,
  createGif,
  getGifById,
  updateGif,
  deleteGif,
} = require("./gif.service");

module.exports = {
  getGifs: (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const pageSize = 6;

    if (req.query.query && req.query.query.length > 0) {
      try {
        totalGifs({ title: req.query.query }, (total) => {
          getGifsByTitle(
            {
              title: req.query.query,
              pageSize: pageSize,
              offset: pageSize * (page - 1),
            },
            (results) => {
              return res.json({
                message: "success",
                data: results,
                pagination: {
                  page: page,
                  pageSize: pageSize,
                  total: total.count,
                  totalPages: Math.ceil(total.count / pageSize),
                },
              });
            },
          );
        });
      } catch (err) {
        console.log("Error loading gifs", err);
      }
    } else {
      try {
        totalGifs({ title: "" }, (total) => {
          getGifs(
            { pageSize: pageSize, offset: pageSize * (page - 1) },
            (results) => {
              return res.json({
                message: "success",
                data: results,
                pagination: {
                  page: page,
                  pageSize: pageSize,
                  total: total.count,
                  totalPages: Math.ceil(total.count / pageSize),
                },
              });
            },
          );
        });
      } catch (err) {
        console.log("Error loading gifs", err);
      }
    }
  },
  showGif: (req, res) => {
    try {
      getGifById(req.params.id, (results) => {
        return res.json({
          message: "success",
          data: results,
        });
      });
    } catch (err) {
      console.log("Error loading gif", err);
    }
  },
  storeGif: (req, res) => {
    const body = {
      title: req.body.title,
      slug: slug(req.body.title),
      giphy_id: null,
      url: req.body.url, //TODO: set url
    };

    try {
      createGif(body, (results) => {
        return res.json({
          message: "success",
          data: results,
        });
      });
    } catch (err) {
      console.log("Error saving gif", err);
    }
  },
  updateGif: (req, res) => {
    const body = {
      title: req.body.title,
      slug: slug(req.body.title),
      giphy_id: null,
      url: req.body.url, //TODO: set url
    };

    try {
      updateGif(body, (results) => {
        return res.json({
          message: "success",
          data: results,
        });
      });
    } catch (err) {
      console.log("Error updating gif", err);
    }
  },
  deleteGif: (req, res) => {
    try {
      deleteGif(req.params.id, (results) => {
        return res.json({
          message: "success",
          data: results,
        });
      });
    } catch (err) {
      console.log("Error removing gif", err);
    }
  },
};
