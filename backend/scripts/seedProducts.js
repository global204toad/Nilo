import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const products = [
  {
    name: 'Silver ROLX',
    description: 'High-performance racing watch with tachymeter.',
    price: 950,
    image: '/images/Silver Rolxx.png',
    category: 'watch',
    gender: 'men',
    specs: 'Tachymeter • Steel • 43mm',
    type: 'RACING',
    flavorNotes: 'Speed • Precision • Racing',
    position: 1
  },
  {
    name: 'Golden Classic',
    description: 'Sophisticated dress watch perfect for business and formal occasions.',
    price: 950,
    image: '/images/Golden Classic.png',
    category: 'watch',
    gender: 'men',
    specs: 'Quartz • Leather Strap • 38mm',
    type: 'DRESS',
    flavorNotes: 'Sophisticated • Refined • Business',
    position: 2
  },
  {
    name: 'Rolex Two-Tone Case with Arabic Numerals Dial',
    description: 'Limited edition Rolex watch with gold accents and premium craftsmanship.',
    price: 950,
    image: '/images/Rolex Two-Tone Case with Arabic Numerals Dial.png',
    category: 'watch',
    gender: 'men',
    specs: 'Automatic • Two-Tone Case • Arabic Numerals Dial • 40mm',
    type: 'ELITE',
    flavorNotes: 'Exclusive • Premium • Timeless',
    position: 3
  },
  {
    name: 'Silver Rolex with Arabic Dial',
    description: 'A timeless classic watch with elegant design and premium craftsmanship.',
    price: 950,
    image: '/images/Silver Rolex with Arabic Dial.png',
    category: 'watch',
    gender: 'men',
    specs: 'Automatic • Arabic Dial • 40mm',
    type: 'CLASSIC',
    flavorNotes: 'Timeless • Elegant • Precision',
    position: 4
  },
  {
    name: 'Bestwin Octagonal black With Arabic dial',
    description: 'Professional diving watch built for underwater adventures.',
    price: 960,
    image: '/images/Bestwin Octagonal black With Arabic dial.png',
    category: 'watch',
    gender: 'men',
    specs: 'Swiss Movement • Ceramic • 42mm',
    type: 'DIVER',
    flavorNotes: 'Waterproof • Durable • Professional',
    position: 5
  },
  {
    name: 'Patek Philippe Blue Dial',
    description: 'Dynamic sports chronograph with advanced timing features.',
    price: 800,
    image: '/images/Patek Philippe Blue Dial.png',
    category: 'watch',
    gender: 'men',
    specs: 'Chronograph • Steel • 44mm',
    type: 'SPORT',
    flavorNotes: 'Dynamic • Athletic • Performance',
    position: 6
  },
  {
    name: 'Patek Philippe Green Dial',
    description: 'Classic dual-time zone watch with vintage charm.',
    price: 800,
    image: '/images/Patek Philippe Green Dial.png',
    category: 'watch',
    gender: 'men',
    specs: 'Dual Time • Gold Plated • 41mm',
    type: 'VINTAGE',
    flavorNotes: 'Classic • Dual Time • Luxury',
    position: 7
  },
  {
    name: 'Patek Philippe black Dial',
    description: 'Modern casual watch for everyday wear.',
    price: 800,
    image: '/images/Patek Philippe black Dial.png',
    category: 'watch',
    gender: 'men',
    specs: 'Quartz • Nylon Strap • 40mm',
    type: 'URBAN',
    flavorNotes: 'Modern • Casual • Versatile',
    position: 8
  },
  {
    name: 'Patek Philippe Brown Leather Strap',
    description: 'Luxury watch with moonphase complication and automatic movement.',
    price: 800,
    image: '/images/Patek Philippe Brown Leather.png',
    category: 'watch',
    gender: 'men',
    specs: 'Moonphase • Automatic • 42mm',
    type: 'ELITE',
    flavorNotes: 'Luxury • Moonphase • Automatic',
    position: 9
  },
  {
    name: 'Patek Philippe Black Leather Strap',
    description: 'Luxury Patek Philippe watch with elegant black leather strap and premium craftsmanship.',
    price: 800,
    image: '/images/Patek Philippe Black Leather.png',
    category: 'watch',
    gender: 'men',
    specs: 'Automatic • Black Leather Strap • 40mm',
    type: 'CLASSIC',
    flavorNotes: 'Elegant • Premium • Timeless',
    position: 10
  },
  {
    name: 'Patek Philippe with Black Leather Strap & White Dial',
    description: 'Luxury Patek Philippe watch with white dial and premium craftsmanship.',
    price: 800,
    image: '/images/Patek Philippe with Black Leather Strap and White Dial.png',
    category: 'watch',
    gender: 'men',
    specs: 'Automatic • White Dial • 40mm',
    type: 'MINIMAL',
    flavorNotes: 'Luxury • White Dial • Automatic',
    position: 11
  },
  {
    name: 'Santos de Cartier ',
    description: 'Premium luxury watch with diamond accents and premium craftsmanship.',
    price: 750,
    image: '/images/Santos de Cartier.png',
    category: 'watch',
    gender: 'men',
    specs: 'Automatic • Diamond • 40mm',
    type: 'LUXURY',
    flavorNotes: 'Premium • Diamond • Exclusive',
    position: 12
  },
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nilo');
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Seeded ${createdProducts.length} products successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();

