const Draft = require('./draft.model');

const draftQuestion = async (draft) => {
  const draftedQuestion = await Draft.draft(draft);
  return draftedQuestion;
};

const fetchDrafts = async (query = {}, page = 1, limit = 50) => {
  const drafts = await Draft.fetch(query, page, limit);
  return drafts;
};

const deleteDrafts = async (drafts) => {
  const draftIds = drafts.map(draft => draft.id);
  const draftedQuestions = await Draft.deleteDrafts(draftIds);
  return draftedQuestions;
};

module.exports = {
  draftQuestion,
  fetchDrafts,
  deleteDrafts,
};
