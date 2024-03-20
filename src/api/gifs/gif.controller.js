const slug = require("slug");
const fs = require("fs");
const multerS3 = require("multer-s3");
const multer = require("multer");
const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const {
  totalGifs,
  getGifs,
  getGifsByTitle,
  createGif,
  getGifById,
  updateGif,
  deleteGif,
} = require("./gif.service");
const { tmpdir } = require("os");

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
    const requestTitle = req.body.title;
    const requestFile = req.files["file-input"][0];

    const s3 = new AWS.S3({
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
      region: process.env.S3_REGION,
    });

    tmp_path = uuidv4() + "." + requestFile.originalname.split(".").pop();

    var uploadParams = {
      Bucket: process.env.S3_BUCKET,
      Key: tmp_path,
      Body: requestFile.buffer,
    };

    s3.upload(uploadParams, function (err, data) {
      if (err) {
        return res.status(500).json({
          message: "error",
          data: { message: err.message },
        });
      }
      if (data) {
        const body = {
          title: requestTitle,
          slug: slug(requestTitle),
          giphy_id: null,
          url: data.Location,
        };

        try {
          createGif(body, (results) => {
            return res.json({
              message: "success",
              data: results,
            });
          });
        } catch (err) {
          return res.status(500).json({
            message: "error",
            data: { message: err.message },
          });
        }
      }
    });
  },
  updateGif: (req, res) => {
    const requestTitle = req.body.title;
    const requestUrl = req.body.url;
    const requestId = req.body.id;
    console.log("requestTitle-> ", requestTitle);
    console.log("requestUrl -> ", requestUrl);

    if (requestUrl && requestUrl.length > 0) {
      const body = {
        id: requestId,
        title: requestTitle,
        slug: slug(requestTitle),
        url: requestUrl,
        giphy_id: null,
      };

      try {
        updateGif(body, (results) => {
          return res.json({
            message: "success",
            data: results,
          });
        });
      } catch (err) {
        return res.status(500).json({
          message: "error",
          data: { message: err.message },
        });
      }
    } else {
      const requestFile = req.files["file-input"][0];

      const s3 = new AWS.S3({
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
        region: process.env.S3_REGION,
      });

      tmp_path = uuidv4() + "." + requestFile.originalname.split(".").pop();

      var uploadParams = {
        Bucket: process.env.S3_BUCKET,
        Key: tmp_path,
        Body: requestFile.buffer,
      };

      s3.upload(uploadParams, function (err, data) {
        if (err) {
          return res.status(500).json({
            message: "error",
            data: { message: err.message },
          });
        }
        if (data) {
          const body = {
            title: requestTitle,
            slug: slug(requestTitle),
            giphy_id: null,
            url: data.Location,
          };

          try {
            updateGif(body, (results) => {
              return res.json({
                message: "success",
                data: results,
              });
            });
          } catch (err) {
            return res.status(500).json({
              message: "error",
              data: { message: err.message },
            });
          }
        }
      });
    }

    ////[]
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
