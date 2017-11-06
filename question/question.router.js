const express = require('express');
const questionController = require('./question.controller');
const _ = require('lodash');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const publishedQuestion = await questionController.publish(req.body);
    req.log.info(publishedQuestion);
    res.json(publishedQuestion);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const query = _.omit(req.query, 'limit', 'page');
    const publishedQuestions = await questionController.fetch(
      query,
      req.query.limit,
      req.query.page,
    );
    req.log.info(publishedQuestions);
    res.json(publishedQuestions);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
