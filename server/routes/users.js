var express = require("express");
var router = express.Router();
const UserController = require("../controller/User");

/* GET users listing. */
router.post("/", UserController.Register);
router.post("/", UserController.Login);

module.exports = router;
