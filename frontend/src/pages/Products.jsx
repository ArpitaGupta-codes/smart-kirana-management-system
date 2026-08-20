import { useState, useEffect } from 'react';
import { getProducts, addProduct, deleteProduct } from '../services/productService';
import { getCategories } from '../services/categoryService';

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    CategoryID: '',
    Name: '',
    Unit: 'pcs',
    PurchasePrice: '',
    SellingPrice: '',
    CurrentStock: '',
    MinStock: '5',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setError('');
    } catch (err) {
      setError('Products load karne mein error aaya. Backend chal raha hai kya check karo.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Categories load nahi hui', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.Name.trim()) {
      setError('Product ka naam zaroori hai');
      return;
    }
    if (formData.SellingPrice !== '' && Number(formData.SellingPrice) < 0) {
      setError('Selling price negative nahi ho sakti');
      return;
    }
    if (formData.CurrentStock !== '' && Number(formData.CurrentStock) < 0) {
      setError('Stock negative nahi ho sakta');
      return;
    }

    try {
      await addProduct({
        ...formData,
        CategoryID: formData.CategoryID || null,
        PurchasePrice: Number(formData.PurchasePrice) || 0,
        SellingPrice: Number(formData.SellingPrice) || 0,
        CurrentStock: Number(formData.CurrentStock) || 0,
        MinStock: Number(formData.MinStock) || 5,
      });
      setFormData({
        CategoryID: '',
        Name: '',
        Unit: 'pcs',
        PurchasePrice: '',
        SellingPrice: '',
        CurrentStock: '',
        MinStock: '5',
      });
      setError('');
      fetchProducts();
    } catch (err) {
      setError('Product add karne mein error aaya');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      setError('Product delete karne mein error aaya');
    }
  };

  return (
    <div>
      <h2>Products</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="row g-2 mb-4 align-items-end">
        <div className="col-auto">
          <label className="form-label">Category</label>
          <select
            name="CategoryID"
            className="form-select"
            value={formData.CategoryID}
            onChange={handleChange}
          >
            <option value="">-- Select --</option>
            {categories.map((cat) => (
              <option key={cat.CategoryID} value={cat.CategoryID}>
                {cat.Name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-auto">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="Name"
            className="form-control"
            value={formData.Name}
            onChange={handleChange}
            placeholder="Product ka naam"
          />
        </div>

        <div className="col-auto">
          <label className="form-label">Unit</label>
          <input
            type="text"
            name="Unit"
            className="form-control"
            style={{ width: '90px' }}
            value={formData.Unit}
            onChange={handleChange}
            placeholder="pcs"
          />
        </div>

        <div className="col-auto">
          <label className="form-label">Purchase Price</label>
          <input
            type="number"
            name="PurchasePrice"
            className="form-control"
            style={{ width: '120px' }}
            value={formData.PurchasePrice}
            onChange={handleChange}
          />
        </div>

        <div className="col-auto">
          <label className="form-label">Selling Price</label>
          <input
            type="number"
            name="SellingPrice"
            className="form-control"
            style={{ width: '120px' }}
            value={formData.SellingPrice}
            onChange={handleChange}
          />
        </div>

        <div className="col-auto">
          <label className="form-label">Stock</label>
          <input
            type="number"
            name="CurrentStock"
            className="form-control"
            style={{ width: '100px' }}
            value={formData.CurrentStock}
            onChange={handleChange}
          />
        </div>

        <div className="col-auto">
          <label className="form-label">Min Stock</label>
          <input
            type="number"
            name="MinStock"
            className="form-control"
            style={{ width: '100px' }}
            value={formData.MinStock}
            onChange={handleChange}
          />
        </div>

        <div className="col-auto">
          <button type="submit" className="btn btn-primary">Add Product</button>
        </div>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>Koi product nahi mila. Upar se add karo.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Unit</th>
              <th>Purchase Price</th>
              <th>Selling Price</th>
              <th>Stock</th>
              <th>Min Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.ProductID} className={p.CurrentStock <= p.MinStock ? 'table-warning' : ''}>
                <td>{p.ProductID}</td>
                <td>{p.Name}</td>
                <td>{p.Category ? p.Category.Name : '-'}</td>
                <td>{p.Unit}</td>
                <td>₹{p.PurchasePrice}</td>
                <td>₹{p.SellingPrice}</td>
                <td>{p.CurrentStock}</td>
                <td>{p.MinStock}</td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.ProductID)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Products;