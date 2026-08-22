import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      style={{
        width: '220px',
        minHeight: '100vh',
        backgroundColor: '#212529',
        color: 'white',
        padding: '20px 0',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>Smart Kirana</h4>
      {user && <p style={{ textAlign: 'center', color: '#aaa', fontSize: '14px' }}>{user.Username} ({user.Role})</p>}
      <nav className="nav flex-column" style={{ flex: 1 }}>
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
      <button onClick={handleLogout} className="btn btn-outline-light mx-3">Logout</button>
    </div>
  );
}

export default Sidebar;