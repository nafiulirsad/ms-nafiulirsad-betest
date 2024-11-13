const express = require('express');
const bodyParser = require('body-parser');
const jwtRoutes = require('./routes/jwtRoutes');
const usersRoutes = require('./routes/usersRoutes');
const { createIndexes } = require('./config/mongodb');

const app = express();
app.use(bodyParser.json());
app.use('/api/jwt', jwtRoutes);
app.use('/api/users', usersRoutes);

createIndexes().then(() => console.log('Indexes Created!')).catch(err => console.error(err));

module.exports = app;