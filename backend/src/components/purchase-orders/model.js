const mongoose = require('mongoose');
const { Schema } = mongoose;

const PurchaseOrderSchema = new Schema({
  producto: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true,
  },
  proveedor: {
    type: String,
    required: true,
    trim: true,
  },
  cantidadSolicitada: {
    type: Number,
    required: true,
    min: 1,
  },
  estado: {
    type: String,
    enum: ['PENDIENTE', 'APROBADA', 'RECHAZADA', 'RECIBIDA'],
    default: 'PENDIENTE',
    required: true,
    index: true,
  },
  motivoRechazo: {
    type: String,
    default: null,
    trim: true,
  },
  alerta: {
    type: Schema.Types.ObjectId,
    ref: 'Alert',
    default: null,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('PurchaseOrder', PurchaseOrderSchema);
