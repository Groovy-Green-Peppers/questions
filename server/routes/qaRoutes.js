const express = require('express');
const {
  getQuestions, getAnswers, postQuestion, postAnswer, questionHelpful,
  questionReport, answerHelpful, answerReport,
} = require('../controllers/qaControllers');

const router = express.Router();

router.get('/questions', getQuestions);

router.get('/questions/:question_id/answers', getAnswers);

router.post('/questions', postQuestion);

router.post('/questions/:question_id/answers', postAnswer);

router.put('/questions/:question_id/helpful', questionHelpful);

router.put('/questions/:question_id/report', questionReport);

router.put('/answers/:answer_id/helpful', answerHelpful);

router.put('/answers/:answer_id/report', answerReport);

module.exports = router;
