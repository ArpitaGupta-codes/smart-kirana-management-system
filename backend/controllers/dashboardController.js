const Product = require('../models/Product');
const Category = require('../models/Category');
const Supplier = require('../models/Supplier');
const Customer = require('../models/Customer');
const { Op } = require('sequelize');

const getDashboardSummary = async (req, res) => {
  try {
    // Total counts nikaalte hain
    const totalProducts = await Product.count();
    const totalCategories = await Category.count();
    const totalSuppliers = await Supplier.count();
    const totalCustomers = await Customer.count();

    // Low stock products - jahan CurrentStock, MinStock se kam ya barabar hai
    const lowStockProducts = await Product.findAll({
      where: {
        CurrentStock: { [Op.lte]: Product.sequelize.col('MinStock') },
      },
      attributes: ['ProductID', 'Name', 'CurrentStock', 'MinStock'],
    });

    res.status(200).json({
      totalProducts,
      totalCategories,
      totalSuppliers,
      totalCustomers,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
    });
  } catch (error) {
    res.status(500).json({ message: 'Dashboard data laane mein error aaya', error: error.message });
  }
};

module.exports = { getDashboardSummary };