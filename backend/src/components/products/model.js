const mongoose = require('mongoose');
const { Schema } = mongoose;

const SKU_REGEX = /^[A-Za-z0-9-]{6,20}$/;

const ProductSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
    match: SKU_REGEX,
  },
  categoria: {
    type: String,
    required: true,
    trim: true,
  },
  precio: {
    type: Number,
    required: true,
    min: 0.01,
  },
  stockActual: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  stockMinimo: {
    type: Number,
    required: true,
    min: 1,
  },
  proveedor: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', ProductSchema);
