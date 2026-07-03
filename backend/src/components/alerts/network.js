const express = require('express');
const mongoose = require('mongoose');
const response = require('../../network/response');
const controller = require('./controller');

const router = express.Router();
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

router.get('/', async (req, res) => {
  try {
    const alerts = await controller.getAlerts(req.query);
    response.success(req, res, alerts, 200);
  } catch (error) {
    response.error(req, res, error.message, error.status || 500, error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return response.error(req, res, 'ID de alerta inválido', 400);
    }
    const alert = await controller.getAlert(req.params.id);
    response.success(req, res, alert, 200);
  } catch (error) {
    response.error(req, res, error.message, error.status || 500, error);
  }
});

module.exports = router;
