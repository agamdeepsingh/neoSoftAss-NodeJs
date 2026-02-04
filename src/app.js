require('dotenv').config();
require('express-async-errors');

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');

const { keycloak, sessionStore, isKeycloakEnabled } = require('./config/keycloak');
const tasksRouter = require('./routes/tasks');
const healthRouter = require('./routes/health');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

if (isKeycloakEnabled) {
  app.use(session({
    secret: process.env.SESSION_SECRET || 'task-manager-session-secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore
  }));
  app.use(keycloak.middleware());
}

app.use('/tasks', tasksRouter(keycloak));
app.use('/health', healthRouter);
app.use(errorHandler);

module.exports = app;

