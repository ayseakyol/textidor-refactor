const fs = require("fs");
const path = require("path");
const util = require("util");
const config = require("../config");

const readDir = util.promisify(fs.readdir);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const deleteFile = util.promisify(fs.unlink);

// define FILES_DIR
const FILES_DIR = path.join(__dirname, '../', config.FILES_DIR );

// declare the handlers

const handlers = {
  getFiles: async (req, res, next) => {
    try {
      const list = await readDir(FILES_DIR);
      res.json(list);
    } catch (err) {
      if (err && err.code === "ENOENT") {
        res.status(404).end();
        return;
      }
      if (err) {
        next(err);
        return;
      }
    }
  },
  readFile: async (req, res, next) => {
    const fileName = req.params.name;
    try {
      const fileText = await readFile(`${FILES_DIR}/${fileName}`, "utf-8");
      const responseData = {
        name: fileName,
        text: fileText,
      };
      res.json(responseData);
    } catch (err) {
      if (err && err.code === "ENOENT") {
        res.status(404).end();
        return;
      }
      if (err) {
        next(err);
        return;
      }
    }
  },

  writeFile: async (req, res, next) => {
    const fileName = req.params.name;
    const fileText = req.body.text;
    try {
      await writeFile(`${FILES_DIR}/${fileName}`, fileText);
      // refactor hint:
      res.redirect(303, "/api/files");
    } catch (err) {
      if (err && err.code === "ENOENT") {
        res.status(404).end();
        return;
      }
      if (err) {
        next(err);
        return;
      }

      // handlers.getFiles(req, res, next);
    }
  },
  deleteFile: async (req, res, next) => {
    const fileName = req.params.name;
    try {
      await deleteFile(`${FILES_DIR}/${fileName}`);
      // refactor hint:
      res.redirect(303, "/api/files");
    } catch (err) {
      if (err && err.code === "ENOENT") {
        res.status(404).end();
        return;
      }
      if (err) {
        next(err);
        return;
      }
    }
    // handlers.getFiles(req, res, next);
  },
};

// export the handlers
module.exports = handlers;
