//pra listar / add conhecimento




const express = require('express');
const router = express.Router();
const Keyword = require('../models/Keyword');
const { auth } = require('../middleware/auth');

// Get all keywords
router.get('/', async (req, res) => {
  try {
    const keywords = await Keyword.find();
    res.json(keywords);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching keywords' });
  }
});

// Create new keyword (protected)
router.post('/', auth, async (req, res) => {
  try {
    const keyword = new Keyword(req.body);
    await keyword.save();
    res.status(201).json(keyword);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Keyword already exists' });
    }
    res.status(500).json({ message: 'Error creating keyword' });
  }
});

module.exports = router;
