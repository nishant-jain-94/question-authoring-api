const express = require('express');
const csvController = require('./csv.controller');

const router = express.Router();

router.get('/csvUpload', (req, res) => {
  const publishedQuestion = csvController.readAndPublish();
  res.json(publishedQuestion);
});

module.exports = router;
