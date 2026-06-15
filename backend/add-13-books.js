const mongoose = require('mongoose');
const Book = require('./models/Book');
require('dotenv').config();

async function addBooks() {
    try {
        await mongoose.connect('mongodb://localhost:27017/papertrail');
        
        // Delete existing
        await Book.deleteMany({});
        
        const books = [
            { title: "The Great Gatsby", author: "F. Scott Fitzgerald", price: 450, imageUrl: "https://covers.openlibrary.org/b/id/8222591-L.jpg", sellerEmail: "admin@papertrail.com", status: "available" },
            { title: "To Kill a Mockingbird", author: "Harper Lee", price: 550, imageUrl: "https://covers.openlibrary.org/b/id/8222608-L.jpg", sellerEmail: "admin@papertrail.com", status: "available" },
            { title: "1984", author: "George Orwell", price: 400, imageUrl: "https://covers.openlibrary.org/b/id/8222590-L.jpg", sellerEmail: "admin@papertrail.com", status: "available" },
            { title: "Pride and Prejudice", author: "Jane Austen", price: 500, imageUrl: "https://covers.openlibrary.org/b/id/8222600-L.jpg", sellerEmail: "admin@papertrail.com", status: "available" },
            { title: "The Hobbit", author: "J.R.R. Tolkien", price: 650, imageUrl: "https://covers.openlibrary.org/b/id/8222630-L.jpg", sellerEmail: "admin@papertrail.com", status: "available" }
        ];
        
        await Book.insertMany(books);
        console.log(`✅ Added ${books.length} books!`);
        process.exit(0);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}

addBooks();