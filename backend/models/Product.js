import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    default: 'watch',
  },
  gender: {
    type: String,
    enum: ['men', 'women', 'unisex'],
    default: 'men',
  },
  specs: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: '',
  },
  flavorNotes: {
    type: String,
    default: '',
  },
  position: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Product', productSchema);

