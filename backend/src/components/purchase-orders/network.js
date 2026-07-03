const express = require('express');
const mongoose = require('mongoose');
const response = require('../../network/response');
const controller = require('./controller');
const { authenticateToken } = require('../../middleware/authMiddleware');

const router = express.Router();
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

router.get('/', async (req, res) => {
  try {
    const orders = await controller.getPurchaseOrders(req.query);
    response.success(req, res, orders, 200);
  } catch (error) {
    response.error(req, res, error.message, error.status || 500, error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return response.error(req, res, 'ID de orden inválido', 400);
    }
    const order = await controller.getPurchaseOrder(req.params.id);
    response.success(req, res, order, 200);
  } catch (error) {
    response.error(req, res, error.message, error.status || 500, error);
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const order = await controller.createPurchaseOrder(req.body);
    response.success(req, res, order, 201);
  } catch (error) {
    response.error(req, res, error.message, error.status || 500, error);
  }
});

router.post('/:id/aprobar', authenticateToken, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return response.error(req, res, 'ID de orden inválido', 400);
    }
    const order = await controller.approvePurchaseOrder(req.params.id);
    response.success(req, res, order, 200);
  } catch (error) {
    response.error(req, res, error.message, error.status || 500, error);
  }
});

router.post('/:id/rechazar', authenticateToken, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return response.error(req, res, 'ID de orden inválido', 400);
    }
    const order = await controller.rejectPurchaseOrder(req.params.id, req.body);
    response.success(req, res, order, 200);
  } catch (error) {
    response.error(req, res, error.message, error.status || 500, error);
  }
});

router.post('/:id/recibir', authenticateToken, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return response.error(req, res, 'ID de orden inválido', 400);
    }
    const order = await controller.receivePurchaseOrder(req.params.id);
    response.success(req, res, order, 200);
  } catch (error) {
    response.error(req, res, error.message, error.status || 500, error);
  }
});

module.exports = router;
