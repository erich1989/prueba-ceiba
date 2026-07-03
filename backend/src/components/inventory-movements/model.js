const mongoose = require('mongoose');
const { Schema } = mongoose;

const InventoryMovementSchema = new Schema({
  producto: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true,
  },
  tipo: {
    type: String,
    enum: ['ENTRADA', 'SALIDA'],
    required: true,
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1,
  },
  fecha: {
    type: Date,
    required: true,
    default: Date.now,
  },
  motivo: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
}, {
  timestamps: true,
});

['updateOne', 'findOneAndUpdate', 'updateMany', 'deleteOne', 'findOneAndDelete', 'deleteMany'].forEach((method) => {
  InventoryMovementSchema.pre(method, function blockMutation() {
    throw new Error('Los movimientos de inventario son inmutables y no pueden modificarse ni eliminarse.');
  });
});

module.exports = mongoose.model('InventoryMovement', InventoryMovementSchema);
