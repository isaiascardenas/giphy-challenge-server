const router = require("express").Router();
const {
  getGifs,
} = require("./gif.controller");

router.get("/", getGifs);

module.exports = router;
