const express = require('express');
const app = express();
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

app.use(express.json());
app.use(logger);


app.use('/auth', require('./routes/auth'));
app.use('/books', require('./routes/books'));

app.use(errorHandler);
app.use((req, res) => res.status(404).json({ message: 'Not Found' }));

module.exports = app;

if (require.main === module) {
  app.listen(3000, () => console.log('Server running on http://localhost:3000'));
}
