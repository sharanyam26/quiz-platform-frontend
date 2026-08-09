import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!token || !user || user.role !== 'ADMIN') {
      navigate('/login');
      return;
    }

    api
      .get('/admin/stats')
      .then((res) => setStats(res.data.stats))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load stats'));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const cards = stats
    ? [
        { label: 'Total Students', value: stats.totalStudents },
        { label: 'Total Quizzes', value: stats.totalQuizzes },
        { label: 'Published Quizzes', value: stats.publishedQuizzes },
        { label: 'Draft Quizzes', value: stats.draftQuizzes },
        { label: 'Total Questions', value: stats.totalQuestions },
        { label: 'Total Attempts', value: stats.totalAttempts },
        { label: 'Average Score', value: `${Number(stats.averageScore).toFixed(1)}%` },
        { label: 'Passed Attempts', value: stats.passedAttempts },
        { label: 'Failed Attempts', value: stats.failedAttempts },
      ]
    : [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF9' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: '#E2E8F0' }}>
        <div className="flex items-center gap-6">
  <h1 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#312E81' }}>
    Quiz Platform · Admin
  </h1>
  <span className="text-sm font-medium" style={{ color: '#F59E0B' }}>Dashboard</span>
  <Link to="/admin/quizzes" className="text-sm font-medium" style={{ color: '#334155' }}>Quizzes</Link>
</div>
        <button
          onClick={handleLogout}
          className="text-sm font-medium px-4 py-2 rounded-lg"
          style={{ color: '#312E81', border: '1px solid #CBD5E1' }}
        >
          Log out
        </button>
      </div>

      <div className="px-8 py-8">
        <h2
          className="text-2xl font-bold mb-1"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#312E81' }}
        >
          Dashboard
        </h2>
        <p className="text-sm mb-8" style={{ color: '#334155' }}>
          Platform overview at a glance.
        </p>

        {error && (
          <div className="mb-6 px-4 py-3 rounded text-sm" style={{ backgroundColor: '#FEF2F2', color: '#B91C1C' }}>
            {error}
          </div>
        )}

        {!stats && !error && <p style={{ color: '#334155' }}>Loading stats...</p>}

        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card) => (
              <div
                key={card.label}
                className="p-5 rounded-xl border bg-white"
                style={{ borderColor: '#E2E8F0' }}
              >
                <p className="text-sm mb-1" style={{ color: '#64748B' }}>
                  {card.label}
                </p>
                <p
                  className="text-3xl font-bold"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#312E81' }}
                >
                  {card.value}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;