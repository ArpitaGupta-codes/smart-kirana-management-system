import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div
      style={{
        width: '220px',
        minHeight: '100vh',
        backgroundColor: '#212529',
        color: 'white',
        padding: '20px 0',
      }}
    >
      <h4 style={{ textAlign: 'center', marginBottom: '30px' }}>Smart Kirana</h4>
      <nav className="nav flex-column">
        <Link to="/" className="nav-link text-white px-4 py-2">Dashboard</Link>
        <Link to="/products" className="nav-link text-white px-4 py-2">Products</Link>
        <Link to="/categories" className="nav-link text-white px-4 py-2">Categories</Link>
        <Link to="/suppliers" className="nav-link text-white px-4 py-2">Suppliers</Link>
        <Link to="/customers" className="nav-link text-white px-4 py-2">Customers</Link>
        <Link to="/purchases" className="nav-link text-white px-4 py-2">Purchases</Link>
        <Link to="/sales" className="nav-link text-white px-4 py-2">Sales</Link>
        <Link to="/credits" className="nav-link text-white px-4 py-2">Udhaar</Link>
        <Link to="/expenses" className="nav-link text-white px-4 py-2">Expenses</Link>
      </nav>
    </div>
  );
}

export default Sidebar;