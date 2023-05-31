import http from 'k6/http'; //eslint-disable-line
import { sleep, check } from 'k6'; //eslint-disable-line

export const options = {
  stages: [
    { duration: '2s', target: 50 },
    { duration: '23s', target: 1200 },
    { duration: '5s', target: 50 },
  ],
};

export default () => {
  const productID = Math.ceil(Math.random() * 10000);
  const questionID = Math.ceil(Math.random() * 1000000);
  const answerID = Math.ceil(Math.random() * 6800000);
  const getQ = {
    method: 'GET',
    url: `http://localhost:3000/qa/questions?product_id=${productID}`,
  };
  const getA = {
    method: 'GET',
    url: `http://localhost:3000/qa/questions/${questionID}/answers`,
  };
  const postQ = {
    method: 'POST',
    url: 'http://localhost:3000/qa/questions',
    body: JSON.stringify({
      body: 'mybody',
      name: 'myname',
      email: 'myemail',
      product_id: 1,
    }),
    params: {
      headers: { 'Content-Type': 'application/json' },
    },
  };
  const postA = {
    method: 'POST',
    url: `http://localhost:3000/qa/questions/${questionID}/answers`,
    body: JSON.stringify({
      body: 'answerBody',
      name: 'answerName',
      email: 'answerEmail',
      photos: ['imageurl1', 'imageurl2'],
    }),
    params: {
      headers: { 'Content-Type': 'application/json' },
    },
  };
  const qHelpful = {
    method: 'PUT',
    url: `http://localhost:3000/qa/questions/${questionID}/helpful`,
  };
  const qReport = {
    method: 'PUT',
    url: `http://localhost:3000/qa/questions/${questionID}/report`,
  };
  const aHelpful = {
    method: 'PUT',
    url: `http://localhost:3000/qa/answers/${answerID}/helpful`,
  };
  const aReport = {
    method: 'PUT',
    url: `http://localhost:3000/qa/answers/${answerID}/report`,
  };
  const responses = http.batch([getQ, getA, postQ, postA, qHelpful, qReport, aHelpful, aReport]);
  check(responses[0], {
    'verify status code is 200': (r) => r.status === 200,
  });
  check(responses[1], {
    'verify status code is 200': (r) => r.status === 200,
  });
  check(responses[2], {
    'verify status code is 201': (r) => r.status === 201,
  });
  check(responses[3], {
    'verify status code is 201': (r) => r.status === 201,
  });
  check(responses[4], {
    'verify status code is 204': (r) => r.status === 204,
  });
  check(responses[5], {
    'verify status code is 204': (r) => r.status === 204,
  });
  check(responses[6], {
    'verify status code is 204': (r) => r.status === 204,
  });
  check(responses[7], {
    'verify status code is 204': (r) => r.status === 204,
  });
  sleep(0.1);
};
