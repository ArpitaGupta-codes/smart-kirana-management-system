import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// URL path ko readable title mein badalne ke liye
const pageTitles = {
  '/': 'Dashboard',
  '/products': 'Products',
  '/categories': 'Categories',
  '/suppliers': 'Suppliers',
  '/customers': 'Customers',
  '/purchases': 'Purchases',
  '/sales': 'Sales / Billing',
  '/credits': 'Udhaar / Credit',
  '/expenses': 'Expenses',
  '/reports': 'Reports',
};

function Navbar({ onToggleSidebar }) {
  const location = useLocation();
  const { user } = useAuth();
  const title = pageTitles[location.pathname] || 'Smart Kirana';

  return (
    <div
      className="d-flex justify-content-between align-items-center px-3 py-2 mb-3"
      style={{ backgroundColor: 'white', borderBottom: '1px solid #dee2e6' }}
    >
      <div className="d-flex align-items-center">
        {/* Mobile toggle button - sirf chhoti screens pe dikhega */}
        <button
          className="btn btn-outline-secondary d-md-none me-2"
          onClick={onToggleSidebar}
        >
          ☰
        </button>
        <h4 className="mb-0">{title}</h4>
      </div>
      <div className="text-muted">
        {user && `Welcome, ${user.Username}`}
      </div>
    </div>
  );
}

export default Navbar;