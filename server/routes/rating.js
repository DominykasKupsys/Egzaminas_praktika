var express = require("express");
var router = express.Router();
const authToken = require("../auth/authToken");
const RatingController = require("../controller/Rating");

router.post("/create", authToken, async (req, res) => {
  await RatingController.CreateRating(req, res);
});

router.delete("/delete", authToken, async (req, res) => {
  await RatingController.DeleteRating(req, res);
});

module.exports = router;
