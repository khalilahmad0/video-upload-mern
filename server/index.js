const express = require("express");
const app = express();
const PORT = 5000;
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");
const MONGOURL = require("./helpers/keys").MONGOURL;
const users = require("./routes/api/users");
const videos = require("./routes/api/videos");
const multer = require("multer");

mongoose
  .connect(MONGOURL, { useNewUrlParser: true })
  .then(() => console.log("DB successfully connected"))
  .catch((err) => console.log(err));

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// Passport 
app.use(passport.initialize());
require("./helpers/passport")(passport);

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use("/api/users", users);
app.use("/api/videos", videos);

app.listen(PORT, () => {
  console.log("Server is running on", PORT);
});
