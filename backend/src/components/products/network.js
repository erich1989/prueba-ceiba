const express = require('express');
const mongoose = require('mongoose');
const response = require('../../network/response');
const controller = require('./controller');
const inventoryController = require('../inventory-movements/controller');
const { authenticateToken } = require('../../middleware/authMiddleware');

const router = express.Router();
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

router.get('/', async (req, res) => {
  try {
    const products = await controller.getProducts(req.query);
    response.success(req, res, products, 200);
  } catch (error) {
    response.error(req, res, error.message, error.status || 500, error);
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return response.error(req, res, 'ID de producto inválido', 400);
    }
    const product = await controller.getProduct(req.params.id);
    response.success(req, res, product, 200);
  } catch (error) {
    response.error(req, res, error.message, error.status || 500, error);
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const product = await controller.createProduct(req.body);
    response.success(req, res, product, 201);
  } catch (error) {
    response.error(req, res, error.message, error.status || 500, error);
  }
});

router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return response.error(req, res, 'ID de producto inválido', 400);
    }
    const product = await controller.updateProduct(req.params.id, req.body);
    response.success(req, res, product, 200);
  } catch (error) {
    response.error(req, res, error.message, error.status || 500, error);
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return response.error(req, res, 'ID de producto inválido', 400);
    }
    const product = await controller.deleteProduct(req.params.id);
    response.success(req, res, product, 200);
  } catch (error) {
    response.error(req, res, error.message, error.status || 500, error);
  }
});

router.post('/:id/ajustar', authenticateToken, async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return response.error(req, res, 'ID de producto inválido', 400);
    }
    const result = await inventoryController.adjustStock(req.params.id, req.body);
    response.success(req, res, result, 200);
  } catch (error) {
    response.error(req, res, error.message, error.status || 500, error);
  }
});

router.get('/:id/movimientos', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return response.error(req, res, 'ID de producto inválido', 400);
    }
    const movements = await inventoryController.getMovementsByProduct(req.params.id);
    response.success(req, res, movements, 200);
  } catch (error) {
    response.error(req, res, error.message, error.status || 500, error);
  }
});

module.exports = router;
