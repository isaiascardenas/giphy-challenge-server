const router = require("express").Router();
const multer = require("multer");
const {
  getGifs,
  showGif,
  storeGif,
  updateGif,
  deleteGif,
} = require("./gif.controller");

const upload = multer();

router.get("/", getGifs);
router.post(
  "/",
  upload.fields([{ name: "file-input" }, { name: "title" }]),
  storeGif,
);
router.patch(
  "/:id",
  upload.fields([
    { name: "file-input" },
    { name: "title" },
    { name: "url" },
    { name: "giphy_id" },
    { name: "slug" },
    { name: "id" },
  ]),
  updateGif,
);
router.get("/:id", showGif);
router.delete("/:id", deleteGif);

module.exports = router;
