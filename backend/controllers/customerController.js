const Customer = require('../models/Customer');

const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Customers laane mein error aaya', error: error.message });
  }
};

const createCustomer = async (req, res) => {
  try {
    const { Name, Phone, Address } = req.body;

    if (!Name || Name.trim() === '') {
      return res.status(400).json({ message: 'Customer ka naam zaroori hai' });
    }

    const newCustomer = await Customer.create({ Name, Phone, Address });
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(500).json({ message: 'Customer banane mein error aaya', error: error.message });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer nahi mila' });
    }

    const { Name, Phone, Address } = req.body;
    await customer.update({ Name, Phone, Address });
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Customer update karne mein error aaya', error: error.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer nahi mila' });
    }

    await customer.destroy();
    res.status(200).json({ message: 'Customer delete ho gaya' });
  } catch (error) {
    res.status(500).json({ message: 'Customer delete karne mein error aaya', error: error.message });
  }
};

module.exports = { getAllCustomers, createCustomer, updateCustomer, deleteCustomer };