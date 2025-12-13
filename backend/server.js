import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import itemRoutes from './routes/items.js';
import authRoutes from './routes/auth.js';
import contactRoutes from './routes/contact.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import checkoutRoutes from './routes/checkout.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Railway assigns PORT dynamically, so we use it directly

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://nilo-bice.vercel.app',
      'http://localhost:3000',
      'http://localhost:5173', // Vite dev server
      /\.vercel\.app$/,  // Allow all Vercel preview deployments
      /\.railway\.app$/,  // Allow all Railway deployments
      /\.up\.railway\.app$/,  // Allow Railway preview deployments
      /\.onrender\.com$/,  // Allow all Render deployments
    ];
    
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Test email endpoint (for debugging)
app.get('/api/test-email', async (req, res) => {
  try {
    const { sendOTPEmail } = await import('./services/emailService.js');
    const testEmail = req.query.email || 'aliashrafosman777@gmail.com';
    const testOTP = '123456';
    
    console.log('🧪 Testing email configuration...');
    console.log('   EMAIL_HOST:', process.env.EMAIL_HOST);
    console.log('   EMAIL_PORT:', process.env.EMAIL_PORT);
    console.log('   EMAIL_USER:', process.env.EMAIL_USER);
    console.log('   EMAIL_PASS:', process.env.EMAIL_PASS ? '***' : 'NOT SET');
    
    await sendOTPEmail(testEmail, testOTP);
    
    res.json({
      success: true,
      message: `Test email sent to ${testEmail}. Please check your inbox and spam folder.`,
      config: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER,
        passSet: !!process.env.EMAIL_PASS
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error.message,
      details: {
        code: error.code,
        command: error.command,
        response: error.response
      }
    });
  }
});

// Routes
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Welcome to Nilo API' });
});

app.use('/api/items', itemRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nilo');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

connectDB();

// Start server
// Render/Railway require binding to 0.0.0.0 and using the PORT env variable (set automatically)
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📦 MongoDB URI: ${process.env.MONGODB_URI ? '✅ Set' : '❌ Not set'}`);
  console.log(`🔗 Server accessible at: http://0.0.0.0:${PORT}`);
});

