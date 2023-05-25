SELECT 'CREATE DATABASE qa' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'questions')\gexec

-- connect to DB
\c qa;

CREATE TABLE IF NOT EXISTS questions (
	id SERIAL PRIMARY KEY,
  product_id INT,
	body VARCHAR(1000),
	date_written BIGINT,
	asker_name VARCHAR(255),
  asker_email VARCHAR(255),
	reported INT,
  helpful INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS answers (
  id SERIAL PRIMARY KEY,
  question_id INT,
  body VARCHAR(1000),
  date_written BIGINT,
  answerer_name VARCHAR(255),
  answerer_email VARCHAR(255),
  reported INT,
  helpful INT DEFAULT 0,
  FOREIGN KEY (question_id)
  REFERENCES questions(id)
);

CREATE TABLE IF NOT EXISTS photos (
  id SERIAL PRIMARY KEY,
  answer_id INT,
  url TEXT,
  FOREIGN KEY (answer_id)REFERENCES answers(id)
);

-- copy CSV data over

COPY questions
FROM '/Users/noriel/Pre/SDC/questions/data/questions.csv'
DELIMITER ','
CSV HEADER;

COPY answers
FROM '/Users/noriel/Pre/SDC/questions/data/answers.csv'
DELIMITER ','
CSV HEADER;

COPY photos
FROM '/Users/noriel/Pre/SDC/questions/data/answers_photos.csv'
DELIMITER ','
CSV HEADER;

-- Example copy command:
-- COPY persons(first_name, last_name, dob, email)
-- FROM 'C:\sampledb\persons.csv'
-- DELIMITER ','
-- CSV HEADER;
