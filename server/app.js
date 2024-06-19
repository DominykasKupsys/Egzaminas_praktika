var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
var cors = require("cors");

var usersRouter = require("./routes/users");
const categoryRouter = require("./routes/category");
var app = express();

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", usersRouter);
app.use("/category", categoryRouter);

const port = 3002;
app.listen(port, () => {
  console.log(`Server listening on: http://localhost:${port}`);
});

module.exports = app;
