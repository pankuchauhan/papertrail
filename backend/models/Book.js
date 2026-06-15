const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: 'https://via.placeholder.com/300x200?text=Book+Cover' },
    category: { type: String, enum: ['Fiction', 'Non-Fiction', 'Science', 'History', 'Children', 'Other'], default: 'Other' },
    condition: { type: String, enum: ['New', 'Like New', 'Good', 'Acceptable'], default: 'Good' },
    sellerEmail: { type: String, required: true },
    status: { type: String, enum: ['available', 'sold'], default: 'available' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', BookSchema);