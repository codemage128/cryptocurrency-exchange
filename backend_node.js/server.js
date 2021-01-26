require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('_middleware/error-handler');
const db = require('_helpers/db');
// const tfa = require('./routes/tfa');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
var routes = require('./users/todoListRoutes');
routes(app);
// api routes
app.use('/users', require('./users/users.controller'));
app.use('/coins', require('./coins/coins.controller'));
app.use('/positions', require('./position/positions.controller'));
app.use('/status', require('./status/status.controller'));
// global error handler
app.use(errorHandler);

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 8880;
app.listen(port, () => console.log('Server listening on port ' + port));
