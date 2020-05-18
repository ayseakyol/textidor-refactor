// require the handlers
const handlers = require("./handlers.js");
const express = require("express");

// build the router
const router = express.Router();

router.use((req, res, next) => {
  console.log("routes!");
  next();
});

router.get("/", (req, res) => {
  res.send("files API!");
});

router.get("/files", handlers.getFiles);

// read a file
//  called by action: fetchAndLoadFile
router.get("/files/:name", handlers.readFile);

// write a file
//  called by action: saveFile
router.post("/files/:name", handlers.writeFile);

// delete a file
//  called by action: deleteFile
router.delete("/files/:name", handlers.deleteFile);

// add routes to router

// export the router
module.exports = router;
