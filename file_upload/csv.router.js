const express = require('express');
const csvController = require('./csv.controller');
const multer = require('multer');

const upload = multer({ dest: 'csvUploads/' });
const router = express.Router();

// TODO -- Change the "myFile" value of upload.single() method below
router.post('/', upload.single('myFile'), async (req, res, next) => {
  try {
    csvController.readAndPublish(req.file);
    res.json({ message: 'File is being processed' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
