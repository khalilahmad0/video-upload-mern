const express = require("express");
const router = express.Router();
const multer = require("multer");
const jwt = require("jsonwebtoken");
const { secretOrKey } = require("../../helpers/keys");
const Video = require("../../models/Video");

const videoStorage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const videoUpload = multer({
  storage: videoStorage,
  limits: {
    fileSize: 10000000, // 10000000 Bytes = 10 MB
  },
  fileFilter(req, file, cb) {
    // upload only mp4 and mkv format
    if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) {
      return cb(new Error("Please upload a video."));
    }
    cb(undefined, true);
  },
});

function validateToken(req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];
  if (token == null) res.sendStatus(400).send({ error: "Token not present" });
  jwt.verify(token, secretOrKey, (err, user) => {
    if (err) {
      res.status(403).send({ error: "Invalid token" });
    } else {
      req.user = user;
      videoCreated = new Video({owner: user}); // Populate video 
      res.send(req.file);
    }
  });
}

router.post(
  "/upload",
  videoUpload.single("video"),
  (req, res) => {
    validateToken(req, res);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete(
  "/delete/:id",
  (req, res) => {
    validateToken(req, res);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);


module.exports = router;
