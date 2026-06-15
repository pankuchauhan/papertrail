const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Import Models
const User = require('./models/User');
const Book = require('./models/Book');
const Order = require('./models/Order');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ==================== MONGODB CONNECTION ====================
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected Successfully!'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// ==================== JWT MIDDLEWARE ====================
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

const isAdmin = async (req, res, next) => {
    const user = await User.findById(req.user.userId);
    if (user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    next();
};

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'Email already exists' });
        
        const user = new User({ name, email, password });
        await user.save();
        
        const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET);
        res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });
        
        const isValid = await user.comparePassword(password);
        if (!isValid) return res.status(400).json({ error: 'Invalid credentials' });
        
        const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET);
        res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin Login (Fixed credentials)
app.post('/api/admin/login', (req, res) => {
    const { email, password } = req.body;
    
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET);
        res.json({ success: true, token, user: { name: 'Administrator', email, role: 'admin' } });
    } else {
        res.status(401).json({ success: false, error: 'Invalid admin credentials' });
    }
});

// ==================== BOOK ROUTES ====================

// Get all books
app.get('/api/books', async (req, res) => {
    try {
        const books = await Book.find({ status: 'available' }).sort({ createdAt: -1 });
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single book
app.get('/api/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ error: 'Book not found' });
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new book
app.post('/api/books', async (req, res) => {
    try {
        const { title, author, price, description, imageUrl, category, condition, sellerEmail } = req.body;
        
        const book = new Book({
            title, author, price, description, imageUrl, category, condition, sellerEmail
        });
        
        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete book
app.delete('/api/books/:id', async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== ORDER ROUTES ====================

// Create order
app.post('/api/orders', async (req, res) => {
    try {
        const { items, total, userEmail, paymentMethod } = req.body;
        
        const order = new Order({
            orderId: uuidv4().slice(0, 8).toUpperCase(),
            userEmail,
            items,
            total,
            paymentMethod
        });
        
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user orders
app.get('/api/orders/:email', async (req, res) => {
    try {
        const orders = await Order.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== ADMIN ROUTES ====================

// Get all users (Admin)
app.get('/api/admin/users', authenticateToken, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all orders (Admin)
app.get('/api/admin/orders', authenticateToken, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update order status (Admin)
app.put('/api/admin/orders/:id/status', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        await Order.findByIdAndUpdate(req.params.id, { status });
        res.json({ message: 'Order status updated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get dashboard stats (Admin)
app.get('/api/admin/stats', authenticateToken, isAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalBooks = await Book.countDocuments();
        const totalOrders = await Order.countDocuments();
        const orders = await Order.find();
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        
        res.json({ totalUsers, totalBooks, totalOrders, totalRevenue });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== SAMPLE DATA ====================
async function addSampleBooks() {
    const count = await Book.countDocuments();
    if (count === 0) {
        const sampleBooks = [
            { title: "The Great Gatsby", author: "F. Scott Fitzgerald", price: 450, description: "A classic novel", category: "Fiction", condition: "Like New", sellerEmail: "admin@papertrail.com" },
            { title: "To Kill a Mockingbird", author: "Harper Lee", price: 550, description: "A story of racial injustice", category: "Fiction", condition: "Good", sellerEmail: "admin@papertrail.com" },
            { title: "1984", author: "George Orwell", price: 400, description: "Dystopian novel", category: "Fiction", condition: "Like New", sellerEmail: "admin@papertrail.com" },
            { title: "Pride and Prejudice", author: "Jane Austen", price: 500, description: "Romantic novel", category: "Fiction", condition: "Good", sellerEmail: "admin@papertrail.com" },
            { title: "The Hobbit", author: "J.R.R. Tolkien", price: 650, description: "Fantasy adventure", category: "Fiction", condition: "New", sellerEmail: "admin@papertrail.com" }
        ];
        
        await Book.insertMany(sampleBooks);
        console.log('📚 Sample books added!');
    }
}

// ==================== HEALTH CHECK ====================
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'MongoDB Server is running!' });
});

// ==================== START SERVER ====================
app.listen(PORT, async () => {
    console.log(`
╔══════════════════════════════════════════════╗
║     PAPERTRAIL MONGODB BACKEND SERVER        ║
╠══════════════════════════════════════════════╣
║  🚀 Server: http://localhost:${PORT}           ║
║  ✅ Database: MongoDB Connected               ║
║  👑 Admin: ${process.env.ADMIN_EMAIL}    ║
║  🔑 Password: ${process.env.ADMIN_PASSWORD}           ║
╠══════════════════════════════════════════════╣
║  📚 API Endpoints:                           ║
║  POST   /api/auth/register  - Register       ║
║  POST   /api/auth/login     - Login          ║
║  POST   /api/admin/login    - Admin Login    ║
║  GET    /api/books          - All books      ║
║  POST   /api/books          - Add book       ║
║  POST   /api/orders         - Create order   ║
║  GET    /api/health         - Health check   ║
╚══════════════════════════════════════════════╝
    `);
    
    await addSampleBooks();
});