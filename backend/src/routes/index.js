const express = require('express');
const productsRouter = require('../components/products/network');
const alertsRouter = require('../components/alerts/network');
const purchaseOrdersRouter = require('../components/purchase-orders/network');
const categoriesRouter = require('../components/categories/network');
const usersRouter = require('../components/users/network');

function routerApi(app) {
  const router = express.Router();
  app.use('/api-v1', router);

  router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  router.use('/products', productsRouter);
  router.use('/alerts', alertsRouter);
  router.use('/purchase-orders', purchaseOrdersRouter);
  router.use('/categories', categoriesRouter);
  router.use('/users', usersRouter);
}

module.exports = routerApi;
