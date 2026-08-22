import { useState } from 'react';
import { getSalesReport, getPurchaseReport, getExpenseReport, getStockReport } from '../services/reportService';

function Reports() {
  const [activeTab, setActiveTab] = useState('sales');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async () => {
    setError('');
    setReportData(null);

    if (activeTab !== 'stock' && (!startDate || !endDate)) {
      setError('Start date aur End date dono zaroori hain');
      return;
    }

    try {
      setLoading(true);
      let data;
      if (activeTab === 'sales') data = await getSalesReport(startDate, endDate);
      else if (activeTab === 'purchases') data = await getPurchaseReport(startDate, endDate);
      else if (activeTab === 'expenses') data = await getExpenseReport(startDate, endDate);
      else if (activeTab === 'stock') data = await getStockReport();

      setReportData(data);
    } catch (err) {
      setError('Report generate karne mein error aaya');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Reports</h2>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        {['sales', 'purchases', 'expenses', 'stock'].map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${activeTab === tab ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab);
                setReportData(null);
                setError('');
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Date filters - stock report ke liye zaroori nahi */}
      {activeTab !== 'stock' && (
        <div className="row g-2 mb-3 align-items-end">
          <div className="col-auto">
            <label className="form-label">Start Date</label>
            <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="col-auto">
            <label className="form-label">End Date</label>
            <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="col-auto">
            <button className="btn btn-primary" onClick={handleGenerateReport}>Generate Report</button>
          </div>
        </div>
      )}
      {activeTab === 'stock' && (
        <button className="btn btn-primary mb-3" onClick={handleGenerateReport}>Generate Stock Report</button>
      )}

      {loading && <p>Loading...</p>}

      {/* Sales Report Display */}
      {reportData && activeTab === 'sales' && (
        <div>
          <div className="row mb-3">
            <div className="col-md-4">
              <div className="card text-white bg-success"><div className="card-body">
                <h6>Total Sales</h6><h3>₹{reportData.totalAmount.toFixed(2)}</h3>
              </div></div>
            </div>
            <div className="col-md-4">
              <div className="card text-white bg-primary"><div className="card-body">
                <h6>Number of Sales</h6><h3>{reportData.totalSalesCount}</h3>
              </div></div>
            </div>
          </div>
          <table className="table table-bordered">
            <thead><tr><th>Date</th><th>Customer</th><th>Payment</th><th>Amount</th></tr></thead>
            <tbody>
              {reportData.sales.map((s) => (
                <tr key={s.SaleID}>
                  <td>{new Date(s.SaleDate).toLocaleDateString()}</td>
                  <td>{s.Customer ? s.Customer.Name : 'Walk-in'}</td>
                  <td>{s.PaymentMethod}</td>
                  <td>₹{s.TotalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Purchase Report Display */}
      {reportData && activeTab === 'purchases' && (
        <div>
          <div className="card text-white bg-info mb-3" style={{ maxWidth: '300px' }}>
            <div className="card-body">
              <h6>Total Purchases</h6><h3>₹{reportData.totalAmount.toFixed(2)}</h3>
            </div>
          </div>
          <table className="table table-bordered">
            <thead><tr><th>Date</th><th>Supplier</th><th>Amount</th></tr></thead>
            <tbody>
              {reportData.purchases.map((p) => (
                <tr key={p.PurchaseID}>
                  <td>{p.PurchaseDate}</td>
                  <td>{p.Supplier ? p.Supplier.Name : '-'}</td>
                  <td>₹{p.TotalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Expense Report Display */}
      {reportData && activeTab === 'expenses' && (
        <div>
          <div className="card text-white bg-danger mb-3" style={{ maxWidth: '300px' }}>
            <div className="card-body">
              <h6>Total Expenses</h6><h3>₹{reportData.totalAmount.toFixed(2)}</h3>
            </div>
          </div>
          <table className="table table-bordered">
            <thead><tr><th>Date</th><th>Category</th><th>Amount</th><th>Description</th></tr></thead>
            <tbody>
              {reportData.expenses.map((e) => (
                <tr key={e.ExpenseID}>
                  <td>{e.ExpenseDate}</td>
                  <td>{e.Category}</td>
                  <td>₹{e.Amount}</td>
                  <td>{e.Description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Stock Report Display */}
      {reportData && activeTab === 'stock' && (
        <div>
          <div className="card text-white bg-secondary mb-3" style={{ maxWidth: '300px' }}>
            <div className="card-body">
              <h6>Total Stock Value</h6><h3>₹{reportData.totalStockValue.toFixed(2)}</h3>
            </div>
          </div>
          <table className="table table-bordered">
            <thead><tr><th>Product</th><th>Stock</th><th>Min Stock</th><th>Stock Value</th><th>Status</th></tr></thead>
            <tbody>
              {reportData.products.map((p) => (
                <tr key={p.ProductID} className={p.IsLowStock ? 'table-warning' : ''}>
                  <td>{p.Name}</td>
                  <td>{p.CurrentStock} {p.Unit}</td>
                  <td>{p.MinStock}</td>
                  <td>₹{p.StockValue.toFixed(2)}</td>
                  <td>{p.IsLowStock ? <span className="badge bg-warning text-dark">Low Stock</span> : <span className="badge bg-success">OK</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Reports;