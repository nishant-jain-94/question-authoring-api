const express = require('express');
const router = express.Router();
const historyController = require('./history.controller');

router.get(':questionId', async(req, res, next) => {
  const fetchedChangeSets = await historyController.fetchQuestion(req.params.questionId);
  res.json(fetchedChangeSets);
});

module.exports = router;
