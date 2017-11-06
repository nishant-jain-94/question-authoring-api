const express = require('express');

const router = express.Router();
const DraftController = require('./draft.controller.js');

router.post('/', async (req, res, next) => {
  try {
    const draftedQuestion = await DraftController.draftQuestion(req.body);
    res.json(draftedQuestion);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { limit, page } = req.query;
    const fetchedQuestions = await DraftController.fetchDrafts(limit, page);
    res.json(fetchedQuestions);
  } catch (error) {
    next(error);
  }
});

router.delete('/', async (req, res, next) => {
  try {
    const { body: drafts } = req;
    const deletedQuestions = await DraftController.deleteDrafts(drafts);
    res.json(deletedQuestions);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
