const express = require('express');
const questionController = require('./question.controller');

const router = express.Router();

router.post('/publish', async(req, res, next) => {
  const publishedQuestion = await questionController.publishQuestion(req.body);
  res.json(publishedQuestion);
});

router.get('/initialize', async(req, res, next) => {
  const initializedQuestion = await questionController.initQuestion();
  res.json(initializedQuestion);
});

router.get('/:questionId', async(req, res, next) => {
  const fetchedQuestions = await questionController.fetchQuestion(req.params.questionId);
  res.json(fetchedQuestions);
});


module.exports = router;
