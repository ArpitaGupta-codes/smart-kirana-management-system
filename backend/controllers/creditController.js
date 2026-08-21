const { sequelize } = require('../config/db');
const CustomerCredit = require('../models/CustomerCredit');
const Customer = require('../models/Customer');
const Payment = require('../models/Payment');
const Sale = require('../models/Sale');

// Saare credits laane ke liye
const getAllCredits = async (req, res) => {
  try {
    const credits = await CustomerCredit.findAll({
      include: [{ model: Customer, attributes: ['CustomerID', 'Name', 'Phone'] }],
      order: [['CreditID', 'DESC']],
    });
    res.status(200).json(credits);
  } catch (error) {
    res.status(500).json({ message: 'Credits laane mein error aaya', error: error.message });
  }
};

// Ek customer ka total pending udhaar nikalne ke liye
const getCustomerCreditSummary = async (req, res) => {
  try {
    const credits = await CustomerCredit.findAll({
      include: [{ model: Customer, attributes: ['CustomerID', 'Name', 'Phone'] }],
    });

    // Customer ke hisaab se group karke total pending nikalte hain
    const summaryMap = {};
    credits.forEach((credit) => {
      const custID = credit.CustomerID;
      if (!summaryMap[custID]) {
        summaryMap[custID] = {
          CustomerID: custID,
          CustomerName: credit.Customer ? credit.Customer.Name : 'Unknown',
          Phone: credit.Customer ? credit.Customer.Phone : '',
          TotalPending: 0,
        };
      }
      if (credit.Status !== 'Paid') {
        summaryMap[custID].TotalPending += Number(credit.Amount);
      }
    });

    const summary = Object.values(summaryMap).filter((s) => s.TotalPending > 0);
    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Summary laane mein error aaya', error: error.message });
  }
};

// Payment record karne ke liye (customer ne udhaar chukaya)
const recordPayment = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { CustomerID, Amount, PaymentMethod } = req.body;

    if (!CustomerID || !Amount || Amount <= 0) {
      await t.rollback();
      return res.status(400).json({ message: 'Customer aur valid amount zaroori hai' });
    }

    // Payment record banao
    await Payment.create(
      { CustomerID, Amount, PaymentMethod: PaymentMethod || 'Cash' },
      { transaction: t }
    );

    // Ab is customer ke pending credits ko amount se adjust karte hain
    // Sabse purane credit se shuru karte hain (FIFO - First In First Out)
    const pendingCredits = await CustomerCredit.findAll({
      where: { CustomerID, Status: ['Pending', 'Partial'] },
      order: [['CreditID', 'ASC']],
      transaction: t,
    });

    let remainingAmount = Number(Amount);

    for (const credit of pendingCredits) {
      if (remainingAmount <= 0) break;

      const creditAmount = Number(credit.Amount);

      if (remainingAmount >= creditAmount) {
        // Pura credit clear ho gaya
        credit.Status = 'Paid';
        remainingAmount -= creditAmount;
      } else {
        // Credit partially clear hua - amount ghata do aur status "Partial" rakho
        credit.Amount = creditAmount - remainingAmount;
        credit.Status = 'Partial';
        remainingAmount = 0;
      }

      await credit.save({ transaction: t });
    }

    await t.commit();

    res.status(201).json({ message: 'Payment successfully record hui, udhaar update ho gaya' });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Payment record karne mein error aaya', error: error.message });
  }
};

module.exports = { getAllCredits, getCustomerCreditSummary, recordPayment };