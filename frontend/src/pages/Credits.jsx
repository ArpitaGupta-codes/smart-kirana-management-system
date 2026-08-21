import { useState, useEffect } from 'react';
import { getCreditSummary, getAllCredits, recordPayment } from '../services/creditService';

function Credits() {
  const [summary, setSummary] = useState([]);
  const [allCredits, setAllCredits] = useState([]);
  const [customerID, setCustomerID] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const summaryData = await getCreditSummary();
      const creditsData = await getAllCredits();
      setSummary(summaryData);
      setAllCredits(creditsData);
      setError('');
    } catch (err) {
      setError('Udhaar data load karne mein error aaya.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!customerID) {
      setError('Customer select karna zaroori hai');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError('Valid amount daalna zaroori hai');
      return;
    }

    try {
      await recordPayment({
        CustomerID: Number(customerID),
        Amount: Number(amount),
        PaymentMethod: paymentMethod,
      });

      setSuccess('Payment successfully record hui! Udhaar update ho gaya.');
      setCustomerID('');
      setAmount('');
      setPaymentMethod('Cash');
      fetchData();
    } catch (err) {
      setError('Payment record karne mein error aaya');
    }
  };

  return (
    <div>
      <h2>Udhaar / Credit Management</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Payment Record Form */}
      <div className="card p-3 mb-4">
        <h5>Payment Record Karo</h5>
        <form onSubmit={handleSubmit} className="row g-2 align-items-end">
          <div className="col-md-4">
            <label className="form-label">Customer</label>
            <select
              className="form-select"
              value={customerID}
              onChange={(e) => setCustomerID(e.target.value)}
            >
              <option value="">-- Select Customer --</option>
              {summary.map((s) => (
                <option key={s.CustomerID} value={s.CustomerID}>
                  {s.CustomerName} (Pending: ₹{s.TotalPending})
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Amount</label>
            <input
              type="number"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Payment Method</label>
            <select
              className="form-select"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
            </select>
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-success">Record Payment</button>
          </div>
        </form>
      </div>

      {/* Pending Summary */}
      <h4>Pending Udhaar (Customer-wise)</h4>
      {loading ? (
        <p>Loading...</p>
      ) : summary.length === 0 ? (
        <p className="text-muted">Koi pending udhaar nahi hai. 👍</p>
      ) : (
        <table className="table table-bordered mb-4">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone</th>
              <th>Total Pending</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((s) => (
              <tr key={s.CustomerID}>
                <td>{s.CustomerName}</td>
                <td>{s.Phone}</td>
                <td className="text-danger fw-bold">₹{s.TotalPending}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Full Credit History */}
      <h4>Credit History (Saari Entries)</h4>
      {allCredits.length === 0 ? (
        <p className="text-muted">Koi credit entry nahi hai.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {allCredits.map((c) => (
              <tr key={c.CreditID}>
                <td>{c.CreditID}</td>
                <td>{c.Customer ? c.Customer.Name : '-'}</td>
                <td>₹{c.Amount}</td>
                <td>
                  <span
                    className={`badge ${
                      c.Status === 'Paid' ? 'bg-success' : c.Status === 'Partial' ? 'bg-warning text-dark' : 'bg-danger'
                    }`}
                  >
                    {c.Status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Credits;