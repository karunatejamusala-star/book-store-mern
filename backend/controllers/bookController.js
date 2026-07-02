const Book = require('../models/Book');

// @desc    Get all books (search, filter, pagination)
// @route   GET /api/books
const getBooks = async (req, res, next) => {
  try {
    const { keyword, genre, language, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

    const query = {};

    if (keyword) {
      query.$text = { $search: keyword };
    }
    if (genre) query.genre = genre;
    if (language) query.language = language;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const total = await Book.countDocuments(query);
    const books = await Book.find(query)
      .sort(sortOption)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.json({
      books,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    next(err);
  }
};

// @desc    Create book (admin only)
// @route   POST /api/books
const createBook = async (req, res, next) => {
  try {
    const { title, author, description, genre, language, price, stock, coverImage } = req.body;

    if (!title || !author || !description || !genre || price === undefined) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const book = await Book.create({
      title,
      author,
      description,
      genre,
      language,
      price,
      stock,
      coverImage,
      createdBy: req.user._id,
    });

    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
};

// @desc    Update book (admin only)
// @route   PUT /api/books/:id
const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    Object.assign(book, req.body);
    const updated = await book.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete book (admin only)
// @route   DELETE /api/books/:id
const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    await book.deleteOne();
    res.json({ message: 'Book removed' });
  } catch (err) {
    next(err);
  }
};

// @desc    Add a review to a book
// @route   POST /api/books/:id/reviews
const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const alreadyReviewed = book.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Book already reviewed' });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    book.reviews.push(review);
    book.rating =
      book.reviews.reduce((acc, item) => item.rating + acc, 0) / book.reviews.length;

    await book.save();
    res.status(201).json({ message: 'Review added' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  addReview,
};
