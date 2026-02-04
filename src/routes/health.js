const express = require('express');
const router = express.Router();
const sequelize = require('../db/sequelize');

router.get('/', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'fail', database: 'unavailable', error: err.message });
  }
});

module.exports = router;
