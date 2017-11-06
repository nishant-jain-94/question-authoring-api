const express = require('express');

const router = express.Router();
const historyController = require('./history.controller');

router.get('/:questionId', async (req, res) => {
  const fetchedChangeSets = await historyController.fetchChanges(req.params.questionId);
  res.json(fetchedChangeSets);
});

module.exports = router;
