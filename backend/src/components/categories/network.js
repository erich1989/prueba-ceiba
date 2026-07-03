const express = require('express');
const response = require('../../network/response');
const { VALID_CATEGORIES } = require('../../constants/categories');

const router = express.Router();

router.get('/', async (req, res) => {
  response.success(req, res, VALID_CATEGORIES, 200);
});

module.exports = router;
