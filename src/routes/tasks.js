const express = require('express');
const tasksController = require('../controllers/tasksController');
const validateTaskId = require('../middleware/validateTaskId');
const pagination = require('../middleware/pagination');

const noop = (req, res, next) => next();
const readGuard = (keycloak) => keycloak ? keycloak.protect('tasks:read') : noop;
const writeGuard = (keycloak) => keycloak ? keycloak.protect('tasks:write') : noop;

module.exports = function (keycloak) {
  const r = express.Router();
  r.get('/', readGuard(keycloak), pagination, tasksController.getTasks);
  r.post('/', writeGuard(keycloak), tasksController.createTask);
  r.patch('/:id', writeGuard(keycloak), validateTaskId, tasksController.updateTask);
  r.delete('/:id', writeGuard(keycloak), validateTaskId, tasksController.deleteTask);
  return r;
};
