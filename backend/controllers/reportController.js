const { Op } = require('sequelize');
const Sale = require('../models/Sale');
const SaleItem = require('../models/SaleItem');
const Purchase = require('../models/Purchase');
const Expense = require('../models/Expense');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Supplier = require('../models/Supplier');

// Sales report - date range ke beech
const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'startDate aur endDate zaroori hai' });
    }

    const sales = await Sale.findAll({
      where: {
        SaleDate: {
          [Op.between]: [new Date(startDate), new Date(`${endDate}T23:59:59`)],
        },
      },
      include: [
        { model: Customer, attributes: ['Name'] },
        { model: SaleItem, include: [{ model: Product, attributes: ['Name'] }] },
      ],
      order: [['SaleDate', 'ASC']],
    });

    const totalAmount = sales.reduce((sum, s) => sum + Number(s.TotalAmount), 0);
    const totalSalesCount = sales.length;

    res.status(200).json({ sales, totalAmount, totalSalesCount });
  } catch (error) {
    res.status(500).json({ message: 'Sales report banane mein error aaya', error: error.message });
  }
};

// Purchase report - date range ke beech
const getPurchaseReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'startDate aur endDate zaroori hai' });
    }

    const purchases = await Purchase.findAll({
      where: {
        PurchaseDate: { [Op.between]: [startDate, endDate] },
      },
      include: [{ model: Supplier, attributes: ['Name'] }],
      order: [['PurchaseDate', 'ASC']],
    });

    const totalAmount = purchases.reduce((sum, p) => sum + Number(p.TotalAmount), 0);

    res.status(200).json({ purchases, totalAmount, totalPurchaseCount: purchases.length });
  } catch (error) {
    res.status(500).json({ message: 'Purchase report banane mein error aaya', error: error.message });
  }
};

// Expense report - date range ke beech
const getExpenseReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'startDate aur endDate zaroori hai' });
    }

    const expenses = await Expense.findAll({
    where: {
     ExpenseDate: { [Op.gte]: startDate, [Op.lte]: endDate },
    },
      order: [['ExpenseDate', 'ASC']],
    });

    const totalAmount = expenses.reduce((sum, e) => sum + Number(e.Amount), 0);

    res.status(200).json({ expenses, totalAmount });
  } catch (error) {
    res.status(500).json({ message: 'Expense report banane mein error aaya', error: error.message });
  }
};

// Stock report - saare products ka current status
const getStockReport = async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ['ProductID', 'Name', 'Unit', 'CurrentStock', 'MinStock', 'PurchasePrice', 'SellingPrice'],
      order: [['CurrentStock', 'ASC']],
    });

    // Har product ke stock ki value nikaalte hain (kitne paise ka stock pada hai)
    const stockWithValue = products.map((p) => ({
      ...p.toJSON(),
      StockValue: Number(p.CurrentStock) * Number(p.PurchasePrice),
      IsLowStock: p.CurrentStock <= p.MinStock,
    }));

    const totalStockValue = stockWithValue.reduce((sum, p) => sum + p.StockValue, 0);

    res.status(200).json({ products: stockWithValue, totalStockValue });
  } catch (error) {
    res.status(500).json({ message: 'Stock report banane mein error aaya', error: error.message });
  }
};

module.exports = { getSalesReport, getPurchaseReport, getExpenseReport, getStockReport };