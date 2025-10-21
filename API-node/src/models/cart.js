import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,         // ← opcional para permitir carritos de invitado
  },
  anonymousId: {
    type: String,            // ← opcional, para invitado
    default: null,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
    }
  ],
}, { timestamps: true });

// Índice único por user (solo aplica si user existe)
cartSchema.index(
  { user: 1 },
  { unique: true, partialFilterExpression: { user: { $exists: true, $ne: null } } }
);

// Índice único por anonymousId (solo aplica si anonymousId existe)
cartSchema.index(
  { anonymousId: 1 },
  { unique: true, partialFilterExpression: { anonymousId: { $exists: true, $ne: null } } }
);

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
