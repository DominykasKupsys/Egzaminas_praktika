var express = require("express");
var router = express.Router();
const UserController = require("../controller/User");
const authToken = require("../auth/authToken");
/* GET users listing. */
router.post("/register", UserController.Register);
router.post("/login", UserController.Login);
router.get("/data", authToken, UserController.getUserData);
router.get("/all", UserController.getUsers);
router.put("/update/:id", authToken, UserController.updateUser);

module.exports = router;
