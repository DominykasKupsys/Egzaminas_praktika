var express = require("express");
var router = express.Router();
const UserController = require("../controller/User");

/* GET users listing. */
router.post("/register", UserController.Register);
router.post("/login", UserController.Login);

module.exports = router;
