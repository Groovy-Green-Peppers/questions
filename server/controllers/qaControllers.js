const { Pool } = require('pg');

const dbPool = new Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  port: process.env.PG_PORT,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  max: 20,
});
dbPool.connect();

module.exports = {
  getQuestions: (req, res) => {
    const page = req.query.page || 1;
    const count = req.query.count || 5;
    const productID = req.query.product_id || 1;
    // OFFSET ${page * count - count}
    const queryString = `SELECT id as question_id, body as question_body, to_timestamp(date_written/1000) as question_date, asker_name, helpful as question_helpfulness, reported,
      (SELECT COALESCE(json_object_agg(
        id, json_build_object(
          'id', id,
          'body', body,
          'date', to_timestamp(date_written/1000),
          'answerer_name', answerer_name,
          'helpfulness', helpful,
          'photos', (SELECT COALESCE(JSON_AGG(url), '[]' ) from photos WHERE answer_id = answers.id )
        )), '{}'
      ) as answers FROM answers WHERE question_id = questions.id)
    FROM questions
    WHERE product_id = ${productID} and reported = false
    LIMIT ${count}
    OFFSET ${page * count - count}`;

    return dbPool.query(queryString)
      .then((data) => {
        res.send({
          product_id: productID,
          results: data.rows,
        });
      })
      .catch((err) => { res.status(500).send(err); });
  },

  getAnswers: (req, res) => {
    const page = req.query.page || 1;
    const count = req.query.count || 5;
    const questionID = req.params.question_id;
    const queryString = `SELECT id as answers_id, body, to_timestamp(date_written/1000) as date, answerer_name, helpful as helpfulness, (SELECT COALESCE(JSON_AGG(url), '[]' ) as photos from photos WHERE answer_id = answers.id )
    FROM answers
    WHERE question_id = ${questionID} and reported = false
    OFFSET ${page * count - count}`;

    return dbPool.query(queryString)
      .then((data) => {
        res.send({
          question: questionID,
          page,
          count: count.toString(),
          results: data.rows,
        });
      })
      .catch((err) => { res.status(500).send(err); });
  },

  postQuestion: (req, res) => {
    const productID = req.body.product_id;
    const { body, name, email } = req.body;
    const queryString = `INSERT INTO questions(product_id, body, date_written, asker_name, asker_email, reported)
    VALUES ('${productID}', '${body}', EXTRACT(EPOCH FROM now())*1000, '${name}', '${email}', false)`;
    return dbPool.query(queryString)
      .then(() => { res.sendStatus(201); })
      .catch((err) => { res.status(500).send(err); });
  },

  postAnswer: (req, res) => {
    const questionID = req.params.question_id;
    const {
      body, name, email, photos,
    } = req.body;
    const queryString = `INSERT INTO answers(question_id, body, date_written, answerer_name, answerer_email, reported) VALUES(${questionID}, '${body}', EXTRACT(EPOCH FROM now())*1000, '${name}', '${email}', false) RETURNING id`;
    return dbPool.query(queryString)
      .then((data) => {
        const answerID = data.rows[0].id;
        // console.log(answerID)
        photos.forEach((photo) => {
          const photoQuery = `INSERT INTO photos(answer_id, url) VALUES(${answerID}, '${photo}')`;
          return dbPool.query(photoQuery)
            .then(() => { console.log('SUCCESS'); })
            .catch((err) => { console.log('ERROR :', err); });
        });
      })
      .then(() => { res.sendStatus(201); })
      .catch((err) => { res.status(500).send(err); });
  },

  questionHelpful: (req, res) => {
    const queryString = `UPDATE questions SET helpful = helpful + 1 where id = ${req.params.question_id}`;
    return dbPool.query(queryString)
      .then(() => { res.sendStatus(204); })
      .catch((err) => { res.status(500).send(err); });
  },

  questionReport: (req, res) => {
    const queryString = `UPDATE questions SET reported = true where id = ${req.params.question_id}`;
    return dbPool.query(queryString)
      .then(() => { res.sendStatus(204); })
      .catch((err) => { res.status(500).send(err); });
  },

  answerHelpful: (req, res) => {
    const queryString = `UPDATE answers SET helpful = helpful + 1 where id = ${req.params.answer_id}`;
    return dbPool.query(queryString)
      .then(() => { res.sendStatus(204); })
      .catch((err) => { res.status(500).send(err); });
  },

  answerReport: (req, res) => {
    const queryString = `UPDATE answers SET reported = true where id = ${req.params.answer_id}`;
    return dbPool.query(queryString)
      .then(() => { res.sendStatus(204); })
      .catch((err) => { res.status(500).send(err); });
  },
};
