const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Sample books data
let books = [
    { _id: "1", title: "The Great Gatsby", author: "F. Scott Fitzgerald", price: 450, imageUrl: "https://covers.openlibrary.org/b/id/8222591-L.jpg", status: "available" },
    { _id: "2", title: "To Kill a Mockingbird", author: "Harper Lee", price: 550, imageUrl: "https://covers.openlibrary.org/b/id/8222608-L.jpg", status: "available" },
    { _id: "3", title: "1984", author: "George Orwell", price: 400, imageUrl: "https://covers.openlibrary.org/b/id/8222590-L.jpg", status: "available" },
    { _id: "4", title: "Pride and Prejudice", author: "Jane Austen", price: 500, imageUrl: "https://covers.openlibrary.org/b/id/8222600-L.jpg", status: "available" },
];

let orders = [];

// API Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server running' });
});

app.get('/api/books', (req, res) => {
    res.json(books.filter(b => b.status === 'available'));
});

app.get('/api/books/:id', (req, res) => {
    const book = books.find(b => b._id === req.params.id);
    res.json(book || { error: 'Not found' });
});

app.post('/api/books', (req, res) => {
    const newBook = { ...req.body, _id: String(Date.now()), status: 'available' };
    books.push(newBook);
    res.status(201).json(newBook);
});

app.delete('/api/books/:id', (req, res) => {
    books = books.filter(b => b._id !== req.params.id);
    res.json({ message: 'Deleted' });
});

app.post('/api/orders', (req, res) => {
    const order = { ...req.body, _id: String(Date.now()), createdAt: new Date() };
    orders.push(order);
    res.status(201).json(order);
});

app.get('/api/orders/:email', (req, res) => {
    res.json(orders.filter(o => o.userEmail === req.params.email));
});

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════╗
║  SIMPLE PAPERTRAIL BACKEND     ║
║  http://localhost:${PORT}        ║
║  No MongoDB required!          ║
╚════════════════════════════════╝
    `);
});