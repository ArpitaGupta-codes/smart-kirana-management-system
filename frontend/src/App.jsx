import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Suppliers from './pages/Suppliers';
import Customers from './pages/Customers';
import Purchases from './pages/Purchases';
import Sales from './pages/Sales';
import Credits from './pages/Credits';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import Login from './pages/Login';

function AppLayout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex' }}>
      {user && <Sidebar isOpen={sidebarOpen} />}
      <div className="main-content" style={{ flex: 1 }}>
        {user && <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />}
        <div className="page-content" style={{ padding: user ? '0 20px 20px' : '0' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
            <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
            <Route path="/suppliers" element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
            <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
            <Route path="/purchases" element={<ProtectedRoute><Purchases /></ProtectedRoute>} />
            <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
            <Route path="/credits" element={<ProtectedRoute><Credits /></ProtectedRoute>} />
            <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;