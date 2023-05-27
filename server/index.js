require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const router = require('./routes/qaRoutes');

const app = express();

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/qa', router);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server available at http://localhost:${PORT}`);
});
