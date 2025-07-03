const express = require('express');
const router = express.Router();
const { readJsonFile, writeJsonFile } = require('../utils/fileHelper');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');

const USERS_FILE = 'data/users.json';
const SECRET = process.env.SECRET;

// Register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const users = await readJsonFile(USERS_FILE);

  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const newUser = { id: uuid(), email, password: hashed };

  users.push(newUser);
  await writeJsonFile(USERS_FILE, users);

  res.status(201).json({ message: 'User registered' });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = await readJsonFile(USERS_FILE);

  const user = users.find((u) => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET);
  res.json({ token });
});

module.exports = router;
