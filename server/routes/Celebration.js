var express = require("express");
var router = express.Router();
const celebrationController = require("../controller/Celebration");
const authToken = require("../auth/authToken");
const upload = require("../multer/multer");

router.post("/create", upload.single("image"), authToken, async (req, res) => {
  await celebrationController.CreatePost(req, res);
});

router.get("/all", async (req, res) => {
  await celebrationController.GetPosts(req, res);
});

router.get("/all/notverified", async (req, res) => {
  await celebrationController.GetNotVerifiedPosts(req, res);
});
router.put("/:id", upload.single("image"), authToken, async (req, res) => {
  await celebrationController.UpdatePost(req, res);
});

router.put("/verify/:id", authToken, async (req, res) => {
  await celebrationController.VerifyPosts(req, res);
});

router.delete("/:id", authToken, async (req, res) => {
  await celebrationController.DeletePost(req, res);
});

router.get("/:id", async (req, res) => {
  await celebrationController.GetPostById(req, res);
});

router.get("/:id/profile", async (req, res) => {
  await celebrationController.GetUserPosts(req, res);
});

module.exports = router;
