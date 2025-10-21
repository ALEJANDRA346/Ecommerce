import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 1 },
  stock: { type: Number, required: true, min: 0 },
  imagesUrl: [{
    type: String,
    default: 'https://placehold.co/800x600.png',
    trim: true,
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  // NUEVO: límite de unidades por orden (opcional)
  maxPerOrder: {
    type: Number,
    min: 1,
    default: undefined // si no lo defines, no hay límite
  }
});

const Product = mongoose.model('Product', productSchema);
export default Product;
