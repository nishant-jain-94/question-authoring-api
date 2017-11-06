const express = require('express');
const questionController = require('./question.controller');
const _ = require('lodash');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const publishedQuestion = await questionController.publish(req.body);
    res.json(publishedQuestion);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get('/', async (req, res) => {
  try {
    const query = _.omit(req.query, 'limit', 'page');
    const publishedQuestions = await questionController.fetch(
      query,
      req.query.limit,
      req.query.page,
    );
    res.json(publishedQuestions);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
