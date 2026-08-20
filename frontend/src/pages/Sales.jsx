import { useState, useEffect } from 'react';
import { getSales, addSale } from '../services/saleService';
import { getCustomers } from '../services/customerService';
import { getProducts } from '../services/productService';

function Sales() {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerID, setCustomerID] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [items, setItems] = useState([{ ProductID: '', Quantity: '', Price: '' }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSales();
    fetchDropdownData();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const data = await getSales();
      setSales(data);
    } catch (err) {
      setError('Sales load karne mein error aaya.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const customerData = await getCustomers();
      const productData = await getProducts();
      setCustomers(customerData);
      setProducts(productData);
    } catch (err) {
      console.error('Dropdown data load nahi hui', err);
    }
  };

  const handleAddItemRow = () => {
    setItems([...items, { ProductID: '', Quantity: '', Price: '' }]);
  };

  const handleRemoveItemRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    // Agar product select kiya, toh uski selling price automatically bhar do
    if (field === 'ProductID') {
      const selectedProduct = products.find((p) => p.ProductID === Number(value));
      if (selectedProduct) {
        updated[index].Price = selectedProduct.SellingPrice;
      }
    }

    setItems(updated);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const qty = Number(item.Quantity) || 0;
      const price = Number(item.Price) || 0;
      return sum + qty * price;
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (paymentMethod === 'Credit' && !customerID) {
      setError('Udhaar (Credit) ke liye customer select karna zaroori hai');
      return;
    }

    for (const item of items) {
      if (!item.ProductID || !item.Quantity || item.Price === '') {
        setError('Har item mein Product, Quantity, aur Price bharna zaroori hai');
        return;
      }
      if (Number(item.Quantity) <= 0) {
        setError('Quantity 0 se zyada honi chahiye');
        return;
      }
    }

    try {
      await addSale({
        CustomerID: customerID || null,
        PaymentMethod: paymentMethod,
        items: items.map((item) => ({
          ProductID: Number(item.ProductID),
          Quantity: Number(item.Quantity),
          Price: Number(item.Price),
        })),
      });

      setSuccess('Sale successfully save hui! Stock update ho gaya.');
      setCustomerID('');
      setPaymentMethod('Cash');
      setItems([{ ProductID: '', Quantity: '', Price: '' }]);
      fetchSales();
    } catch (err) {
      // Backend se aaya error message dikhate hain (jaise "stock kaafi nahi hai")
      const backendMessage = err.response?.data?.message;
      setError(backendMessage || 'Sale save karne mein error aaya');
    }
  };

  return (
    <div>
      <h2>Sales / Billing</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="card p-3 mb-4">
        <div className="row g-2 mb-3">
          <div className="col-md-4">
            <label className="form-label">Customer (walk-in ke liye khali chhodo)</label>
            <select
              className="form-select"
              value={customerID}
              onChange={(e) => setCustomerID(e.target.value)}
            >
              <option value="">-- Walk-in Customer --</option>
              {customers.map((c) => (
                <option key={c.CustomerID} value={c.CustomerID}>{c.Name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Payment Method</label>
            <select
              className="form-select"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Credit">Credit (Udhaar)</option>
            </select>
          </div>
        </div>

        <h5>Items</h5>
        {items.map((item, index) => (
          <div className="row g-2 mb-2 align-items-end" key={index}>
            <div className="col-md-4">
              <label className="form-label">Product</label>
              <select
                className="form-select"
                value={item.ProductID}
                onChange={(e) => handleItemChange(index, 'ProductID', e.target.value)}
              >
                <option value="">-- Select Product --</option>
                {products.map((p) => (
                  <option key={p.ProductID} value={p.ProductID}>
                    {p.Name} (Stock: {p.CurrentStock})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                value={item.Quantity}
                onChange={(e) => handleItemChange(index, 'Quantity', e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Price (per unit)</label>
              <input
                type="number"
                className="form-control"
                value={item.Price}
                onChange={(e) => handleItemChange(index, 'Price', e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <strong>
                ₹{((Number(item.Quantity) || 0) * (Number(item.Price) || 0)).toFixed(2)}
              </strong>
            </div>
            <div className="col-md-2">
              {items.length > 1 && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleRemoveItemRow(index)}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}

        <button type="button" className="btn btn-sm btn-outline-primary mt-2" style={{ maxWidth: '150px' }} onClick={handleAddItemRow}>
          + Add Item
        </button>

        <hr />

        <div className="d-flex justify-content-between align-items-center">
          <h5>Total: ₹{calculateTotal().toFixed(2)}</h5>
          <button type="submit" className="btn btn-success">Complete Sale</button>
        </div>
      </form>

      <h4>Sales History</h4>
      {loading ? (
        <p>Loading...</p>
      ) : sales.length === 0 ? (
        <p>Koi sale nahi mili.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Payment</th>
              <th>Total Amount</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s) => (
              <tr key={s.SaleID}>
                <td>{s.SaleID}</td>
                <td>{s.Customer ? s.Customer.Name : 'Walk-in'}</td>
                <td>
                  <span className={`badge ${s.PaymentMethod === 'Credit' ? 'bg-warning text-dark' : 'bg-success'}`}>
                    {s.PaymentMethod}
                  </span>
                </td>
                <td>₹{s.TotalAmount}</td>
                <td>
                  {s.SaleItems && s.SaleItems.map((si) => (
                    <div key={si.SaleItemID}>
                      {si.Product ? si.Product.Name : 'Unknown'} × {si.Quantity} @ ₹{si.Price}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Sales;