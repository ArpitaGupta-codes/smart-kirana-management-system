const { sequelize } = require('../config/db');
const Sale = require('../models/Sale');
const SaleItem = require('../models/SaleItem');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const CustomerCredit = require('../models/CustomerCredit');

// Saari sales laane ke liye
const getAllSales = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      include: [
        { model: Customer, attributes: ['CustomerID', 'Name'] },
        { model: SaleItem, include: [{ model: Product, attributes: ['ProductID', 'Name'] }] },
      ],
      order: [['SaleID', 'DESC']],
    });
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Sales laane mein error aaya', error: error.message });
  }
};

// Nayi sale banane ke liye (STOCK GHATEGA, CREDIT BHI BANEGA AGAR ZAROORAT HO)
const createSale = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { CustomerID, PaymentMethod, items } = req.body;

    if (!items || items.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: 'Kam se kam ek product add karna zaroori hai' });
    }

    // Credit payment ke liye customer choose karna zaroori hai
    if (PaymentMethod === 'Credit' && !CustomerID) {
      await t.rollback();
      return res.status(400).json({ message: 'Udhaar (Credit) ke liye customer select karna zaroori hai' });
    }

    let totalAmount = 0;

    // Step 1: Pehle saare products check karo - kya stock sufficient hai?
    for (const item of items) {
      if (item.Quantity <= 0 || item.Price < 0) {
        await t.rollback();
        return res.status(400).json({ message: 'Quantity 0 se zyada aur price valid honi chahiye' });
      }

      const product = await Product.findByPk(item.ProductID, { transaction: t });
      if (!product) {
        await t.rollback();
        return res.status(404).json({ message: `Product ID ${item.ProductID} nahi mila` });
      }

      // IMPORTANT CHECK: Stock kaafi hai ya nahi
      if (product.CurrentStock < item.Quantity) {
        await t.rollback();
        return res.status(400).json({
          message: `${product.Name} ka stock kaafi nahi hai. Available: ${product.CurrentStock}, Requested: ${item.Quantity}`,
        });
      }

      totalAmount += item.Quantity * item.Price;
    }

    // Step 2: Sale record banao
    const newSale = await Sale.create(
      { CustomerID: CustomerID || null, PaymentMethod, TotalAmount: totalAmount },
      { transaction: t }
    );

    // Step 3: Har item ke liye SaleItem banao aur stock ghatao
    for (const item of items) {
      await SaleItem.create(
        {
          SaleID: newSale.SaleID,
          ProductID: item.ProductID,
          Quantity: item.Quantity,
          Price: item.Price,
        },
        { transaction: t }
      );

      const product = await Product.findByPk(item.ProductID, { transaction: t });
      product.CurrentStock -= item.Quantity;
      await product.save({ transaction: t });
    }

    // Step 4: Agar payment method Credit hai, toh CustomerCredit record banao
    if (PaymentMethod === 'Credit') {
      await CustomerCredit.create(
        {
          CustomerID,
          SaleID: newSale.SaleID,
          Amount: totalAmount,
          Status: 'Pending',
        },
        { transaction: t }
      );
    }

    await t.commit();

    res.status(201).json({
      message: 'Sale successfully save hui, stock update ho gaya',
      sale: newSale,
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Sale banane mein error aaya', error: error.message });
  }
};

module.exports = { getAllSales, createSale };