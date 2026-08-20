import { useState, useEffect } from 'react';
import { getSuppliers, addSupplier, deleteSupplier } from '../services/supplierService';

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({ Name: '', Phone: '', Address: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const data = await getSuppliers();
      setSuppliers(data);
      setError('');
    } catch (err) {
      setError('Suppliers load karne mein error aaya. Backend chal raha hai kya check karo.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.Name.trim()) {
      setError('Supplier ka naam zaroori hai');
      return;
    }

    try {
      await addSupplier(formData);
      setFormData({ Name: '', Phone: '', Address: '' });
      setError('');
      fetchSuppliers();
    } catch (err) {
      setError('Supplier add karne mein error aaya');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSupplier(id);
      fetchSuppliers();
    } catch (err) {
      setError('Supplier delete karne mein error aaya');
    }
  };

  return (
    <div>
      <h2>Suppliers</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="row g-2 mb-4 align-items-end">
        <div className="col-auto">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="Name"
            className="form-control"
            value={formData.Name}
            onChange={handleChange}
            placeholder="Supplier ka naam"
          />
        </div>
        <div className="col-auto">
          <label className="form-label">Phone</label>
          <input
            type="text"
            name="Phone"
            className="form-control"
            value={formData.Phone}
            onChange={handleChange}
            placeholder="Phone number"
          />
        </div>
        <div className="col-auto">
          <label className="form-label">Address</label>
          <input
            type="text"
            name="Address"
            className="form-control"
            value={formData.Address}
            onChange={handleChange}
            placeholder="Address"
          />
        </div>
        <div className="col-auto">
          <button type="submit" className="btn btn-primary">Add Supplier</button>
        </div>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : suppliers.length === 0 ? (
        <p>Koi supplier nahi mila. Upar se add karo.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <tr key={s.SupplierID}>
                <td>{s.SupplierID}</td>
                <td>{s.Name}</td>
                <td>{s.Phone}</td>
                <td>{s.Address}</td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s.SupplierID)}>
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

export default Suppliers;