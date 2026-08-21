import { useState, useEffect } from 'react';
import { getExpenses, addExpense, deleteExpense } from '../services/expenseService';

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({ Category: '', Amount: '', ExpenseDate: '', Description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await getExpenses();
      setExpenses(data);
      setError('');
    } catch (err) {
      setError('Expenses load karne mein error aaya.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.Category.trim()) {
      setError('Category zaroori hai');
      return;
    }
    if (!formData.Amount || Number(formData.Amount) <= 0) {
      setError('Valid amount zaroori hai');
      return;
    }
    if (!formData.ExpenseDate) {
      setError('Date zaroori hai');
      return;
    }

    try {
      await addExpense({ ...formData, Amount: Number(formData.Amount) });
      setFormData({ Category: '', Amount: '', ExpenseDate: '', Description: '' });
      setError('');
      fetchExpenses();
    } catch (err) {
      setError('Expense add karne mein error aaya');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      fetchExpenses();
    } catch (err) {
      setError('Expense delete karne mein error aaya');
    }
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.Amount), 0);

  return (
    <div>
      <h2>Expenses</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="row g-2 mb-4 align-items-end">
        <div className="col-auto">
          <label className="form-label">Category</label>
          <input
            type="text"
            name="Category"
            className="form-control"
            value={formData.Category}
            onChange={handleChange}
            placeholder="jaise: Electricity"
          />
        </div>
        <div className="col-auto">
          <label className="form-label">Amount</label>
          <input
            type="number"
            name="Amount"
            className="form-control"
            value={formData.Amount}
            onChange={handleChange}
          />
        </div>
        <div className="col-auto">
          <label className="form-label">Date</label>
          <input
            type="date"
            name="ExpenseDate"
            className="form-control"
            value={formData.ExpenseDate}
            onChange={handleChange}
          />
        </div>
        <div className="col-auto">
          <label className="form-label">Description</label>
          <input
            type="text"
            name="Description"
            className="form-control"
            value={formData.Description}
            onChange={handleChange}
            placeholder="Optional"
          />
        </div>
        <div className="col-auto">
          <button type="submit" className="btn btn-primary">Add Expense</button>
        </div>
      </form>

      <h5 className="mb-3">Total Expenses: <span className="text-danger">₹{totalExpenses.toFixed(2)}</span></h5>

      {loading ? (
        <p>Loading...</p>
      ) : expenses.length === 0 ? (
        <p>Koi expense nahi mila.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.ExpenseID}>
                <td>{exp.ExpenseID}</td>
                <td>{exp.Category}</td>
                <td>₹{exp.Amount}</td>
                <td>{exp.ExpenseDate}</td>
                <td>{exp.Description}</td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(exp.ExpenseID)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Expenses;