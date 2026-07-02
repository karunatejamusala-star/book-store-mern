const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  addReview,
} = require('../controllers/bookController');
const { protect, admin } = require('../middleware/auth');

router.route('/').get(getBooks).post(protect, admin, createBook);
router
  .route('/:id')
  .get(getBookById)
  .put(protect, admin, updateBook)
  .delete(protect, admin, deleteBook);
router.post('/:id/reviews', protect, addReview);

module.exports = router;
