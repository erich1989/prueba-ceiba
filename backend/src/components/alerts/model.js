const mongoose = require('mongoose');
const { Schema } = mongoose;

const AlertSchema = new Schema({
  producto: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  tipo: {
    type: String,
    enum: ['STOCK_BAJO'],
    default: 'STOCK_BAJO',
    required: true,
  },
  estado: {
    type: String,
    enum: ['ACTIVA', 'RESUELTA'],
    default: 'ACTIVA',
    required: true,
  },
  resueltaEn: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

AlertSchema.index(
  { producto: 1 },
  { unique: true, partialFilterExpression: { estado: 'ACTIVA' } }
);

module.exports = mongoose.model('Alert', AlertSchema);
