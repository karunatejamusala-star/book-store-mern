// Simple seed script to populate sample books and an admin user.
// Run with: node seed.js
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Book = require('./models/Book');

dotenv.config();

const books = [
  {
    title: 'The Silent Forest',
    author: 'Amara Reyes',
    description: 'A gripping tale of survival and mystery set deep within an ancient forest.',
    genre: 'Fiction',
    language: 'English',
    price: 12.99,
    stock: 25,
    coverImage: 'https://placehold.co/300x420/2d5a3d/ffffff?text=The+Silent+Forest&font=playfair-display',
  },
  {
    title: 'Atoms & Algorithms',
    author: 'Dr. Ken Watanabe',
    description: 'An accessible introduction to physics-inspired computing.',
    genre: 'Science',
    language: 'English',
    price: 18.5,
    stock: 15,
    coverImage: 'https://placehold.co/300x420/1e3a5f/ffffff?text=Atoms+%26+Algorithms&font=playfair-display',
  },
  {
    title: 'The Merchant of Midnight',
    author: 'Lucia Ferreira',
    description: 'A historical drama following a merchant navigating a city of secrets.',
    genre: 'Historical',
    language: 'English',
    price: 14.25,
    stock: 30,
    coverImage: 'https://placehold.co/300x420/6b3410/ffffff?text=The+Merchant+of+Midnight&font=playfair-display',
  },
  {
    title: 'Mindful Mornings',
    author: 'Priya Nair',
    description: 'Daily practices for a calmer, more focused life.',
    genre: 'Self-Help',
    language: 'English',
    price: 9.99,
    stock: 40,
    coverImage: 'https://placehold.co/300x420/7d6608/ffffff?text=Mindful+Mornings&font=playfair-display',
  },
];

const seed = async () => {
  try {
    await connectDB();

    await Book.deleteMany();
    await Book.insertMany(books);

    const adminExists = await User.findOne({ email: 'admin@bookstore.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@bookstore.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('Admin user created: admin@bookstore.com / admin123');
    }

    console.log('Seed data inserted successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();