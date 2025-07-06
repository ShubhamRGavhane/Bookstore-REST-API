const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { readJsonFile, writeJsonFile } = require('../utils/FileHelper');
const { v4: uuid } = require('uuid');

const BOOKS_FILE = 'data/books.json';

router.use(auth); // protect all routes

// GET /books
router.get('/', async (req, res) => {
  let books = await readJsonFile(BOOKS_FILE);

  const { genre, page, limit } = req.query;

  if (genre) {
    books = books.filter((b) => b.genre === genre);
  }

  if (page && limit) {
    const p = parseInt(page), l = parseInt(limit);
    books = books.slice((p - 1) * l, p * l);
  }

  res.json(books);
});

// GET /books/:id
router.get('/:id', async (req, res) => {
  const books = await readJsonFile(BOOKS_FILE);
  const book = books.find((b) => b.id === req.params.id);

  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

// POST /books
router.post('/', async (req, res) => {
  const { title, author, genre, publishedYear } = req.body;
  const books = await readJsonFile(BOOKS_FILE);

  const newBook = {
    id: uuid(),
    title,
    author,
    genre,
    publishedYear,
    userId: req.user.id,
  };

  books.push(newBook);
  await writeJsonFile(BOOKS_FILE, books);

  res.status(201).json(newBook);
});

// PUT /books/:id
router.put('/:id', async (req, res) => {
  const books = await readJsonFile(BOOKS_FILE);
  const index = books.findIndex((b) => b.id === req.params.id);

  if (index === -1) return res.status(404).json({ error: 'Book not found' });
  if (books[index].userId !== req.user.id)
    return res.status(403).json({ error: 'Forbidden' });

  books[index] = { ...books[index], ...req.body };
  await writeJsonFile(BOOKS_FILE, books);
  res.json(books[index]);
});

// DELETE /books/:id
router.delete('/:id', async (req, res) => {
  const books = await readJsonFile(BOOKS_FILE);
  const index = books.findIndex((b) => b.id === req.params.id);

  if (index === -1) return res.status(404).json({ error: 'Book not found' });
  if (books[index].userId !== req.user.id)
    return res.status(403).json({ error: 'Forbidden' });

  books.splice(index, 1);
  await writeJsonFile(BOOKS_FILE, books);

  res.json({ message: 'Book deleted' });
});

module.exports = router;
