const router = require("express").Router();
const {
  getGifs,
  showGif,
  storeGif,
  updateGif,
  deleteGif,
} = require("./gif.controller");

router.get("/", getGifs);
router.post("/", storeGif);
router.get("/:id", showGif);
router.patch("/:id", updateGif);
router.delete("/:id", deleteGif);

module.exports = router;
