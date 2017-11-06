const express = require('express');

const router = express.Router();
const historyController = require('./history.controller');

router.get('/:questionId', async (req, res, next) => {
  try {
    const fetchedChangeSets = await historyController.fetchChanges(req.params.questionId);
    res.json(fetchedChangeSets);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
