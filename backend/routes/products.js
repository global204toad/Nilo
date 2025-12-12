import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// GET search products
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim().length === 0) {
      return res.json([]);
    }

    // Split search query into keywords (case-insensitive)
    const keywords = query.toLowerCase().trim().split(/\s+/).filter(k => k.length > 0);
    
    if (keywords.length === 0) {
      return res.json([]);
    }

    // Build search query - products that contain ANY keyword
    // Using regex for case-insensitive partial matching
    const searchRegex = keywords.map(keyword => ({
      name: { $regex: keyword, $options: 'i' }
    }));

    const products = await Product.find({
      $or: searchRegex
    }).sort({ position: 1, createdAt: -1 }).limit(20); // Limit to 20 results for performance

    res.json(products);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET all products
router.get('/', async (req, res) => {
  try {
    const { category, gender } = req.query;
    const query = {};
    
    if (category) query.category = category;
    if (gender) query.gender = gender;
    
    const products = await Product.find(query).sort({ position: 1, createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new product (for admin)
router.post('/', async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image: req.body.image,
      category: req.body.category || 'watch',
      gender: req.body.gender || 'men',
      specs: req.body.specs || '',
      type: req.body.type || '',
      flavorNotes: req.body.flavorNotes || '',
    });
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update product (for admin)
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE product (for admin)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

