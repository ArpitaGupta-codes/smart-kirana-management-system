const Product = require('../models/Product');
const Category = require('../models/Category');

// Saare products laane ke liye (Category ki details ke saath)
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: { model: Category, attributes: ['CategoryID', 'Name'] },
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Products laane mein error aaya', error: error.message });
  }
};

// Naya product add karne ke liye
const createProduct = async (req, res) => {
  try {
    const { CategoryID, Name, Unit, PurchasePrice, SellingPrice, CurrentStock, MinStock, ExpiryDate } = req.body;

    // Validation
    if (!Name || Name.trim() === '') {
      return res.status(400).json({ message: 'Product ka naam zaroori hai' });
    }
    if (SellingPrice !== undefined && SellingPrice < 0) {
      return res.status(400).json({ message: 'Selling price negative nahi ho sakti' });
    }
    if (PurchasePrice !== undefined && PurchasePrice < 0) {
      return res.status(400).json({ message: 'Purchase price negative nahi ho sakti' });
    }
    if (CurrentStock !== undefined && CurrentStock < 0) {
      return res.status(400).json({ message: 'Stock negative nahi ho sakta' });
    }

    const newProduct = await Product.create({
      CategoryID, Name, Unit, PurchasePrice, SellingPrice, CurrentStock, MinStock, ExpiryDate,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Product banane mein error aaya', error: error.message });
  }
};

// Product update karne ke liye
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product nahi mila' });
    }

    const { CategoryID, Name, Unit, PurchasePrice, SellingPrice, CurrentStock, MinStock, ExpiryDate, IsActive } = req.body;

    if (SellingPrice !== undefined && SellingPrice < 0) {
      return res.status(400).json({ message: 'Selling price negative nahi ho sakti' });
    }
    if (CurrentStock !== undefined && CurrentStock < 0) {
      return res.status(400).json({ message: 'Stock negative nahi ho sakta' });
    }

    await product.update({ CategoryID, Name, Unit, PurchasePrice, SellingPrice, CurrentStock, MinStock, ExpiryDate, IsActive });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Product update karne mein error aaya', error: error.message });
  }
};

// Product delete (deactivate) karne ke liye
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product nahi mila' });
    }

    await product.destroy();
    res.status(200).json({ message: 'Product delete ho gaya' });
  } catch (error) {
    res.status(500).json({ message: 'Product delete karne mein error aaya', error: error.message });
  }
};

module.exports = { getAllProducts, createProduct, updateProduct, deleteProduct };