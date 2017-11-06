const express = require('express');

const router = express.Router();
const DraftController = require('./draft.controller.js');

router.post('/', async (req, res) => {
  const draftedQuestion = await DraftController.draftQuestion(req.body);
  res.json(draftedQuestion);
});

router.get('/', async (req, res) => {
  const { limit, page } = req.query;
  const fetchedQuestions = await DraftController.fetchDrafts(limit, page);
  res.json(fetchedQuestions);
});

router.delete('/', async (req, res) => {
  const { body: drafts } = req;
  const deletedQuestions = await DraftController.deleteDrafts(drafts);
  res.json(deletedQuestions);
});

module.exports = router;
