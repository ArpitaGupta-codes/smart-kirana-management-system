import { useState, useEffect } from 'react';
import { getCustomers, addCustomer, deleteCustomer } from '../services/customerService';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({ Name: '', Phone: '', Address: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data);
      setError('');
    } catch (err) {
      setError('Customers load karne mein error aaya. Backend chal raha hai kya check karo.');
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
      setError('Customer ka naam zaroori hai');
      return;
    }

    try {
      await addCustomer(formData);
      setFormData({ Name: '', Phone: '', Address: '' });
      setError('');
      fetchCustomers();
    } catch (err) {
      setError('Customer add karne mein error aaya');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id);
      fetchCustomers();
    } catch (err) {
      setError('Customer delete karne mein error aaya');
    }
  };

  return (
    <div>
      <h2>Customers</h2>

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
            placeholder="Customer ka naam"
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
          <button type="submit" className="btn btn-primary">Add Customer</button>
        </div>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : customers.length === 0 ? (
        <p>Koi customer nahi mila. Upar se add karo.</p>
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
            {customers.map((c) => (
              <tr key={c.CustomerID}>
                <td>{c.CustomerID}</td>
                <td>{c.Name}</td>
                <td>{c.Phone}</td>
                <td>{c.Address}</td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.CustomerID)}>
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

export default Customers;