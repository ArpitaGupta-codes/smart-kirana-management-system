import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar({ isOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { to: '/', label: 'Dashboard' },
    { to: '/products', label: 'Products' },
    { to: '/categories', label: 'Categories' },
    { to: '/suppliers', label: 'Suppliers' },
    { to: '/customers', label: 'Customers' },
    { to: '/purchases', label: 'Purchases' },
    { to: '/sales', label: 'Sales' },
    { to: '/credits', label: 'Udhaar' },
    { to: '/expenses', label: 'Expenses' },
    { to: '/reports', label: 'Reports' },
  ];

  return (
    <div
      className={`sidebar-container ${isOpen ? 'open' : ''}`}
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
      <h4 style={{ textAlign: 'center', marginBottom: '5px' }}>🛒 Smart Kirana</h4>
      {user && (
        <p style={{ textAlign: 'center', color: '#aaa', fontSize: '13px', marginBottom: '20px' }}>
          {user.Username} ({user.Role})
        </p>
      )}
      <nav className="nav flex-column" style={{ flex: 1 }}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => `nav-link text-white sidebar-link py-2 px-3 ${isActive ? 'active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <button onClick={handleLogout} className="btn btn-outline-light mx-3">Logout</button>
    </div>
  );
}

export default Sidebar;