import { useState, useEffect } from 'react';
import { getPurchases, addPurchase } from '../services/purchaseService';
import { getSuppliers } from '../services/supplierService';
import { getProducts } from '../services/productService';

function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [supplierID, setSupplierID] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [items, setItems] = useState([{ ProductID: '', Quantity: '', Price: '' }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPurchases();
    fetchDropdownData();
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const data = await getPurchases();
      setPurchases(data);
    } catch (err) {
      setError('Purchases load karne mein error aaya.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const supplierData = await getSuppliers();
      const productData = await getProducts();
      setSuppliers(supplierData);
      setProducts(productData);
    } catch (err) {
      console.error('Dropdown data load nahi hui', err);
    }
  };

  // Ek naya khali item row add karta hai
  const handleAddItemRow = () => {
    setItems([...items, { ProductID: '', Quantity: '', Price: '' }]);
  };

  // Ek item row hataata hai
  const handleRemoveItemRow = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  // Kisi ek item row ki value change karta hai
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  // Total amount calculate karta hai
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

    if (!purchaseDate) {
      setError('Purchase date zaroori hai');
      return;
    }

    // Validation - har item mein Product, Quantity, Price hona chahiye
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
      await addPurchase({
        SupplierID: supplierID || null,
        PurchaseDate: purchaseDate,
        items: items.map((item) => ({
          ProductID: Number(item.ProductID),
          Quantity: Number(item.Quantity),
          Price: Number(item.Price),
        })),
      });

      setSuccess('Purchase successfully save hui! Stock update ho gaya.');
      setSupplierID('');
      setPurchaseDate('');
      setItems([{ ProductID: '', Quantity: '', Price: '' }]);
      fetchPurchases();
    } catch (err) {
      setError('Purchase save karne mein error aaya');
    }
  };

  return (
    <div>
      <h2>Purchases</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} className="card p-3 mb-4">
        <div className="row g-2 mb-3">
          <div className="col-md-4">
            <label className="form-label">Supplier</label>
            <select
              className="form-select"
              value={supplierID}
              onChange={(e) => setSupplierID(e.target.value)}
            >
              <option value="">-- Select Supplier --</option>
              {suppliers.map((s) => (
                <option key={s.SupplierID} value={s.SupplierID}>{s.Name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Purchase Date</label>
            <input
              type="date"
              className="form-control"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
            />
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
                  <option key={p.ProductID} value={p.ProductID}>{p.Name}</option>
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
          <button type="submit" className="btn btn-primary">Save Purchase</button>
        </div>
      </form>

      <h4>Purchase History</h4>
      {loading ? (
        <p>Loading...</p>
      ) : purchases.length === 0 ? (
        <p>Koi purchase nahi mili.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Supplier</th>
              <th>Date</th>
              <th>Total Amount</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((p) => (
              <tr key={p.PurchaseID}>
                <td>{p.PurchaseID}</td>
                <td>{p.Supplier ? p.Supplier.Name : '-'}</td>
                <td>{p.PurchaseDate}</td>
                <td>₹{p.TotalAmount}</td>
                <td>
                  {p.PurchaseItems && p.PurchaseItems.map((pi) => (
                    <div key={pi.PurchaseItemID}>
                      {pi.Product ? pi.Product.Name : 'Unknown'} × {pi.Quantity} @ ₹{pi.Price}
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

export default Purchases;