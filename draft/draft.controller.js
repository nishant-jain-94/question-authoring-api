const Draft = require('./draft.model');

const draftQuestion = async (draft) => {
  try {
    const draftedQuestion = await Draft.draft(draft);
    return draftedQuestion;
  } catch (error) {
    throw error;
  }
};

const fetchDrafts = async (query = {}, page = 1, limit = 50) => {
  try {
    const drafts = await Draft.fetch(query, page, limit);
    return drafts;
  } catch (error) {
    throw error;
  }
};

const deleteDrafts = async (drafts) => {
  try {
    const draftIds = drafts.map(draft => draft.id);
    const draftedQuestions = await Draft.deleteDrafts(draftIds);
    return draftedQuestions;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  draftQuestion,
  fetchDrafts,
  deleteDrafts,
};
