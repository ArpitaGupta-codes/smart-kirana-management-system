const Category = require('../models/Category');

// Saari categories laane ke liye
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Categories laane mein error aaya', error: error.message });
  }
};

// Nayi category add karne ke liye
const createCategory = async (req, res) => {
  try {
    const { Name } = req.body;

    // Validation - Name khali nahi hona chahiye
    if (!Name || Name.trim() === '') {
      return res.status(400).json({ message: 'Category ka naam zaroori hai' });
    }

    const newCategory = await Category.create({ Name });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Category banane mein error aaya', error: error.message });
  }
};

// Category update karne ke liye
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { Name } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Category nahi mili' });
    }

    category.Name = Name;
    await category.save();
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Category update karne mein error aaya', error: error.message });
  }
};

// Category delete karne ke liye
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Category nahi mili' });
    }

    await category.destroy();
    res.status(200).json({ message: 'Category delete ho gayi' });
  } catch (error) {
    res.status(500).json({ message: 'Category delete karne mein error aaya', error: error.message });
  }
};

module.exports = { getAllCategories, createCategory, updateCategory, deleteCategory };