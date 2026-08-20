const { sequelize } = require('../config/db');
const Purchase = require('../models/Purchase');
const PurchaseItem = require('../models/PurchaseItem');
const Product = require('../models/Product');
const Supplier = require('../models/Supplier');

// Saari purchases laane ke liye (items ke saath)
const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.findAll({
      include: [
        { model: Supplier, attributes: ['SupplierID', 'Name'] },
        { model: PurchaseItem, include: [{ model: Product, attributes: ['ProductID', 'Name'] }] },
      ],
      order: [['PurchaseID', 'DESC']],
    });
    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'Purchases laane mein error aaya', error: error.message });
  }
};

// Nayi purchase banane ke liye (SABSE IMPORTANT FUNCTION)
const createPurchase = async (req, res) => {
  // Transaction - iska matlab: ya toh sab steps successful hongi, ya kuch bhi save nahi hoga (partial save nahi hoga)
  const t = await sequelize.transaction();

  try {
    const { SupplierID, PurchaseDate, items } = req.body;

    // Validation
    if (!items || items.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: 'Kam se kam ek product add karna zaroori hai' });
    }
    if (!PurchaseDate) {
      await t.rollback();
      return res.status(400).json({ message: 'Purchase date zaroori hai' });
    }

    // Total amount calculate karo
    let totalAmount = 0;
    for (const item of items) {
      if (item.Quantity <= 0 || item.Price < 0) {
        await t.rollback();
        return res.status(400).json({ message: 'Quantity 0 se zyada aur price valid honi chahiye' });
      }
      totalAmount += item.Quantity * item.Price;
    }

    // Step 1: Purchase record banao
    const newPurchase = await Purchase.create(
      { SupplierID, PurchaseDate, TotalAmount: totalAmount },
      { transaction: t }
    );

    // Step 2: Har item ke liye PurchaseItem banao aur stock badhao
    for (const item of items) {
      await PurchaseItem.create(
        {
          PurchaseID: newPurchase.PurchaseID,
          ProductID: item.ProductID,
          Quantity: item.Quantity,
          Price: item.Price,
        },
        { transaction: t }
      );

      // Product ka stock badhao
      const product = await Product.findByPk(item.ProductID, { transaction: t });
      if (!product) {
        await t.rollback();
        return res.status(404).json({ message: `Product ID ${item.ProductID} nahi mila` });
      }

      product.CurrentStock += item.Quantity;
      await product.save({ transaction: t });
    }

    // Sab kuch successful raha, toh permanently save karo
    await t.commit();

    res.status(201).json({ message: 'Purchase successfully save hui, stock update ho gaya', purchase: newPurchase });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Purchase banane mein error aaya', error: error.message });
  }
};

module.exports = { getAllPurchases, createPurchase };