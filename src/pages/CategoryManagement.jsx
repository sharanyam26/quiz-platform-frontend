import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const loadData = () => {
    api.get('/categories').then((res) => setCategories(res.data.categories));
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!token || !user || user.role !== 'ADMIN') {
      navigate('/login');
      return;
    }
    loadData();
  }, [navigate]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/categories', { name, description });
      setName('');
      setDescription('');
      setShowForm(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete category');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF9' }}>
      <div className="flex items-center justify-between px-8 py-5 border-b bg-white" style={{ borderColor: '#E2E8F0' }}>
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#312E81' }}>
            Quiz Platform · Admin
          </h1>
          <Link to="/admin/dashboard" className="text-sm font-medium" style={{ color: '#334155' }}>Dashboard</Link>
          <Link to="/admin/quizzes" className="text-sm font-medium" style={{ color: '#334155' }}>Quizzes</Link>
          <span className="text-sm font-medium" style={{ color: '#F59E0B' }}>Categories</span>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm font-medium px-4 py-2 rounded-lg text-white"
          style={{ backgroundColor: '#F59E0B' }}
        >
          {showForm ? 'Cancel' : '+ New Category'}
        </button>
      </div>

      <div className="px-8 py-8">
        {error && (
          <div className="mb-6 px-4 py-3 rounded text-sm" style={{ backgroundColor: '#FEF2F2', color: '#B91C1C' }}>
            {error}
          </div>
        )}

        {showForm && (
          <form onSubmit={handleCreate} className="mb-8 p-6 rounded-xl border bg-white space-y-4" style={{ borderColor: '#E2E8F0' }}>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#334155' }}>Name</label>
              <input required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: '#CBD5E1' }} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#334155' }}>Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: '#CBD5E1' }} rows="2" />
            </div>
            <button type="submit" className="px-5 py-2.5 rounded-lg font-medium text-white" style={{ backgroundColor: '#312E81' }}>
              Create Category
            </button>
          </form>
        )}

        <div className="space-y-3">
          {categories.length === 0 && <p style={{ color: '#64748B' }}>No categories yet.</p>}
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between p-4 rounded-lg border bg-white" style={{ borderColor: '#E2E8F0' }}>
              <div>
                <p className="font-medium" style={{ color: '#312E81' }}>{cat.name}</p>
                {cat.description && (
                  <p className="text-sm" style={{ color: '#64748B' }}>{cat.description}</p>
                )}
              </div>
              <button onClick={() => handleDelete(cat.id)} className="text-sm font-medium" style={{ color: '#B91C1C' }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryManagement;