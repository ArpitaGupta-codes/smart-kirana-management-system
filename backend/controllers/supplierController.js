const Supplier = require('../models/Supplier');

const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll();
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Suppliers laane mein error aaya', error: error.message });
  }
};

const createSupplier = async (req, res) => {
  try {
    const { Name, Phone, Address } = req.body;

    if (!Name || Name.trim() === '') {
      return res.status(400).json({ message: 'Supplier ka naam zaroori hai' });
    }

    const newSupplier = await Supplier.create({ Name, Phone, Address });
    res.status(201).json(newSupplier);
  } catch (error) {
    res.status(500).json({ message: 'Supplier banane mein error aaya', error: error.message });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findByPk(id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier nahi mila' });
    }

    const { Name, Phone, Address } = req.body;
    await supplier.update({ Name, Phone, Address });
    res.status(200).json(supplier);
  } catch (error) {
    res.status(500).json({ message: 'Supplier update karne mein error aaya', error: error.message });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await Supplier.findByPk(id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier nahi mila' });
    }

    await supplier.destroy();
    res.status(200).json({ message: 'Supplier delete ho gaya' });
  } catch (error) {
    res.status(500).json({ message: 'Supplier delete karne mein error aaya', error: error.message });
  }
};

module.exports = { getAllSuppliers, createSupplier, updateSupplier, deleteSupplier };