import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadData = () => {
    api.get('/users').then((res) => setUsers(res.data.users));
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

  const toggleStatus = async (user) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await api.patch(`/users/${user.id}/status`, { status: newStatus });
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student? This cannot be undone.')) return;
    try {
      await api.delete(`/users/${id}`);
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF9' }}>
      <div className="flex items-center justify-between px-8 py-5 border-b bg-white" style={{ borderColor: '#E2E8F0' }}>
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#312E81' }}>
            Quiz Platform · Admin
          </h1>
          <Link to="/admin/dashboard" className="text-sm font-medium" style={{ color: '#334155' }}>Dashboard</Link>
          <Link to="/admin/quizzes" className="text-sm font-medium" style={{ color: '#334155' }}>Quizzes</Link>
          <Link to="/admin/categories" className="text-sm font-medium" style={{ color: '#334155' }}>Categories</Link>
          <span className="text-sm font-medium" style={{ color: '#F59E0B' }}>Students</span>
        </div>
      </div>

      <div className="px-8 py-8">
        <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#312E81' }}>
          Students
        </h2>
        <p className="text-sm mb-6" style={{ color: '#334155' }}>Manage registered students.</p>

        {error && (
          <div className="mb-6 px-4 py-3 rounded text-sm" style={{ backgroundColor: '#FEF2F2', color: '#B91C1C' }}>
            {error}
          </div>
        )}

        <input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm px-4 py-2.5 rounded-lg border mb-6"
          style={{ borderColor: '#CBD5E1' }}
        />

        <div className="space-y-3">
          {filteredUsers.length === 0 && <p style={{ color: '#64748B' }}>No students found.</p>}
          {filteredUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 rounded-lg border bg-white" style={{ borderColor: '#E2E8F0' }}>
              <div>
                <p className="font-medium" style={{ color: '#312E81' }}>{user.name}</p>
                <p className="text-sm" style={{ color: '#64748B' }}>{user.email}</p>
                <p className="text-xs" style={{ color: '#94A3B8' }}>
                  Joined {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: user.status === 'ACTIVE' ? '#F0FDF4' : '#F1F5F9',
                    color: user.status === 'ACTIVE' ? '#15803D' : '#64748B',
                  }}
                >
                  {user.status}
                </span>
                <button onClick={() => toggleStatus(user)} className="text-sm font-medium" style={{ color: '#312E81' }}>
                  {user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => handleDelete(user.id)} className="text-sm font-medium" style={{ color: '#B91C1C' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserManagement;