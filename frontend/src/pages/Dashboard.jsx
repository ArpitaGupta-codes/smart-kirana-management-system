import { useState, useEffect } from 'react';
import { getDashboardSummary } from '../services/dashboardService';

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const data = await getDashboardSummary();
      setSummary(data);
      setError('');
    } catch (err) {
      setError('Dashboard data load karne mein error aaya. Backend chal raha hai kya check karo.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h6 className="card-title">Total Products</h6>
              <h2>{summary.totalProducts}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h6 className="card-title">Categories</h6>
              <h2>{summary.totalCategories}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-white bg-info">
            <div className="card-body">
              <h6 className="card-title">Suppliers</h6>
              <h2>{summary.totalSuppliers}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-white bg-secondary">
            <div className="card-body">
              <h6 className="card-title">Customers</h6>
              <h2>{summary.totalCustomers}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alert Section */}
      <div className="card">
        <div className="card-header bg-warning">
          <strong>⚠️ Low Stock Alert ({summary.lowStockCount})</strong>
        </div>
        <div className="card-body">
          {summary.lowStockCount === 0 ? (
            <p className="text-muted mb-0">Sab products ka stock theek hai. 👍</p>
          ) : (
            <table className="table table-sm mb-0">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Current Stock</th>
                  <th>Min Stock</th>
                </tr>
              </thead>
              <tbody>
                {summary.lowStockProducts.map((p) => (
                  <tr key={p.ProductID}>
                    <td>{p.Name}</td>
                    <td className="text-danger fw-bold">{p.CurrentStock}</td>
                    <td>{p.MinStock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;