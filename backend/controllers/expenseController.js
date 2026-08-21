const Expense = require('../models/Expense');

const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({ order: [['ExpenseID', 'DESC']] });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Expenses laane mein error aaya', error: error.message });
  }
};

const createExpense = async (req, res) => {
  try {
    const { Category, Amount, ExpenseDate, Description } = req.body;

    if (!Category || Category.trim() === '') {
      return res.status(400).json({ message: 'Expense category zaroori hai' });
    }
    if (!Amount || Amount <= 0) {
      return res.status(400).json({ message: 'Valid amount zaroori hai' });
    }
    if (!ExpenseDate) {
      return res.status(400).json({ message: 'Date zaroori hai' });
    }

    const newExpense = await Expense.create({ Category, Amount, ExpenseDate, Description });
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: 'Expense banane mein error aaya', error: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense nahi mila' });
    }
    await expense.destroy();
    res.status(200).json({ message: 'Expense delete ho gaya' });
  } catch (error) {
    res.status(500).json({ message: 'Expense delete karne mein error aaya', error: error.message });
  }
};

module.exports = { getAllExpenses, createExpense, deleteExpense };