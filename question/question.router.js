const express = require('express');
const questionController = require('./question.controller');

const router = express.Router();

router.post('/publish', async (req, res) => {
  const publishedQuestion = await questionController.publishQuestion(req.body);
  res.json(publishedQuestion);
});

router.get('/initialize', async (req, res) => {
  const initializedQuestion = await questionController.initQuestion();
  res.json(initializedQuestion);
});

router.get('/:questionId', async (req, res) => {
  const fetchedQuestions = await questionController.fetchQuestion(req.params.questionId);
  res.json(fetchedQuestions);
});


module.exports = router;
