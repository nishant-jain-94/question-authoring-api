/**
 * A controller handling operations related to publishing/published questions.
*/

const Question = require('./question.model');
const History = require('../history/history.controller');
const Ontology = require('./question.ontology');

const fetch = async (query, limit, page) => {
  try {
    const questions = await Question.fetch(query, limit, page);
    return questions;
  } catch (error) {
    throw Error(error);
  }
};

const publish = async (question) => {
  try {
    const fetchedQuestions = await Question.fetch({ _id: question.id });
    const oldQuestion = fetchedQuestions.length ? fetchedQuestions[0] : {};
    const publishedQuestion = await Question.publish(question);
    await History.calculateAndStoreDiffs(oldQuestion, publishedQuestion);
    await Ontology.createQuestionNode(publishedQuestion);
    return publishedQuestion;
  } catch (error) {
    throw Error(error);
  }
};

// TODO: Have to be removed in production
// Question-Authoring-API currently uses this to create nodes in graph database
// for the questions which have been already created in mongodb.
const initialGraphSetup = async () => {
  const questions = await fetch();
  questions.map(async (question) => {
    await Ontology.createQuestionNode(question);
  });
};

const fetchQuestionsBySkill = async (skill) => {
  const questionIds = await Ontology.fetchQuestions(skill);
  const questions = await fetch({ _id: { $in: questionIds } });
  return questions;
};

initialGraphSetup();
fetchQuestionsBySkill('Javascript MEAN FullStack');

module.exports = {
  publish,
  fetch,
  fetchQuestionsBySkill,
};
