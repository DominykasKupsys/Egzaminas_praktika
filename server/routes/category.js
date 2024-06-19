var express = require("express");
var router = express.Router();
const CategoryController = require("../controller/Category");
const authToken = require("../auth/authToken");

/* GET users listing. */
router.post("/create", authToken, async (req, res) => {
  await CategoryController.CreateCategory(req, res);
});

router.get("/all", async (req, res) => {
  await CategoryController.GetCategories(req, res);
});

module.exports = router;
