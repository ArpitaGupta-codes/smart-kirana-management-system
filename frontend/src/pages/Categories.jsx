import { useState, useEffect } from 'react';
import { getCategories, addCategory, deleteCategory } from '../services/categoryService';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Page load hote hi categories fetch karo
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
      setError('');
    } catch (err) {
      setError('Categories load karne mein error aaya. Backend chal raha hai kya check karo.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!newCategoryName.trim()) {
      setError('Category ka naam likhna zaroori hai');
      return;
    }

    try {
      await addCategory(newCategoryName);
      setNewCategoryName('');
      setError('');
      fetchCategories(); // List refresh karo naya data dikhane ke liye
    } catch (err) {
      setError('Category add karne mein error aaya');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      fetchCategories(); // List refresh karo
    } catch (err) {
      setError('Category delete karne mein error aaya');
    }
  };

  return (
    <div>
      <h2>Categories</h2>

      {/* Error message dikhana agar koi ho */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Add Category Form */}
      <form onSubmit={handleAddCategory} className="d-flex gap-2 mb-4">
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: '300px' }}
          placeholder="Nayi category ka naam"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Add Category
        </button>
      </form>

      {/* Loading state */}
      {loading ? (
        <p>Loading...</p>
      ) : categories.length === 0 ? (
        <p>Koi category nahi mili. Upar se add karo.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.CategoryID}>
                <td>{cat.CategoryID}</td>
                <td>{cat.Name}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(cat.CategoryID)}
                  >
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

export default Categories;