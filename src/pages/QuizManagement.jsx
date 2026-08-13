import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function QuizManagement() {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    difficulty: 'Easy',
    duration: 20,
    passing_score: 60,
    max_attempts: 2,
  });

  const loadData = () => {
    api.get('/quizzes').then((res) => setQuizzes(res.data.quizzes));
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/quizzes', formData);
      setShowForm(false);
      setFormData({ title: '', description: '', category_id: '', difficulty: 'Easy', duration: 20, passing_score: 60, max_attempts: 2 });
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create quiz');
    }
  };

  const togglePublish = async (quiz) => {
    const newStatus = quiz.status === 'PUBLISHED' ? 'UNPUBLISHED' : 'PUBLISHED';
    await api.patch(`/quizzes/${quiz.id}/publish`, { status: newStatus });
    loadData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this quiz?')) return;
    await api.delete(`/quizzes/${id}`);
    loadData();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF9' }}>
      <div className="flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: '#E2E8F0' }}>
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#312E81' }}>
            Quiz Platform · Admin
          </h1>
          <Link to="/admin/dashboard" className="text-sm font-medium" style={{ color: '#334155' }}>
            Dashboard
          </Link>
          <span className="text-sm font-medium" style={{ color: '#F59E0B' }}>
            Quizzes
          </span>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm font-medium px-4 py-2 rounded-lg text-white"
          style={{ backgroundColor: '#F59E0B' }}
        >
          {showForm ? 'Cancel' : '+ New Quiz'}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#334155' }}>Title</label>
                <input name="title" required value={formData.title} onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: '#CBD5E1' }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#334155' }}>Category</label>
                <select name="category_id" value={formData.category_id} onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: '#CBD5E1' }}>
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#334155' }}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: '#CBD5E1' }} rows="2" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#334155' }}>Difficulty</label>
                <select name="difficulty" value={formData.difficulty} onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: '#CBD5E1' }}>
                  <option>Easy</option>
                  <option>Intermediate</option>
                  <option>Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#334155' }}>Duration (min)</label>
                <input type="number" name="duration" required value={formData.duration} onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: '#CBD5E1' }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#334155' }}>Passing %</label>
                <input type="number" name="passing_score" required value={formData.passing_score} onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: '#CBD5E1' }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#334155' }}>Max Attempts</label>
                <input type="number" name="max_attempts" required value={formData.max_attempts} onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: '#CBD5E1' }} />
              </div>
            </div>

            <button type="submit" className="px-5 py-2.5 rounded-lg font-medium text-white" style={{ backgroundColor: '#312E81' }}>
              Create Quiz
            </button>
          </form>
        )}

        <div className="space-y-3">
          {quizzes.length === 0 && <p style={{ color: '#64748B' }}>No quizzes yet. Create one above.</p>}
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="flex items-center justify-between p-4 rounded-lg border bg-white" style={{ borderColor: '#E2E8F0' }}>
              <div>
                <p className="font-medium" style={{ color: '#312E81' }}>{quiz.title}</p>
                <p className="text-sm" style={{ color: '#64748B' }}>
                  {quiz.difficulty} · {quiz.duration} min · Pass at {quiz.passing_score}%
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: quiz.status === 'PUBLISHED' ? '#F0FDF4' : '#F1F5F9',
                    color: quiz.status === 'PUBLISHED' ? '#15803D' : '#64748B',
                  }}
                >
                  {quiz.status}
                </span>
                <Link to="/admin/categories" className="text-sm font-medium" style={{ color: '#334155' }}>Categories</Link>
                <Link to={`/admin/quizzes/${quiz.id}/questions`} className="text-sm font-medium" style={{ color: '#312E81' }}>
                  Questions
                </Link>
                <button onClick={() => togglePublish(quiz)} className="text-sm font-medium" style={{ color: '#312E81' }}>
                  {quiz.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={() => handleDelete(quiz.id)} className="text-sm font-medium" style={{ color: '#B91C1C' }}>
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

export default QuizManagement;