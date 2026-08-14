import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
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
      .get('/admin/analytics')
      .then((res) => setAnalytics(res.data.analytics))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load analytics'));
  }, [navigate]);

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
          <Link to="/admin/users" className="text-sm font-medium" style={{ color: '#334155' }}>Students</Link>
          <span className="text-sm font-medium" style={{ color: '#F59E0B' }}>Analytics</span>
        </div>
      </div>

      <div className="px-8 py-8">
        <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#312E81' }}>
          Analytics
        </h2>
        <p className="text-sm mb-8" style={{ color: '#334155' }}>Platform trends and breakdowns.</p>

        {error && (
          <div className="mb-6 px-4 py-3 rounded text-sm" style={{ backgroundColor: '#FEF2F2', color: '#B91C1C' }}>
            {error}
          </div>
        )}

        {!analytics && !error && <p style={{ color: '#64748B' }}>Loading...</p>}

        {analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pass/Fail ratio */}
            <div className="p-6 rounded-xl border bg-white" style={{ borderColor: '#E2E8F0' }}>
              <h3 className="font-bold mb-4" style={{ color: '#312E81' }}>Pass / Fail Ratio</h3>
              {analytics.passFailRatio.length === 0 ? (
                <p style={{ color: '#64748B' }}>No completed attempts yet.</p>
              ) : (
                <div className="space-y-3">
                  {analytics.passFailRatio.map((row) => (
                    <div key={row.status} className="flex items-center justify-between">
                      <span style={{ color: row.status === 'PASSED' ? '#15803D' : '#B91C1C' }}>{row.status}</span>
                      <span className="font-bold" style={{ color: '#312E81' }}>{row.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Most popular quizzes */}
            <div className="p-6 rounded-xl border bg-white" style={{ borderColor: '#E2E8F0' }}>
              <h3 className="font-bold mb-4" style={{ color: '#312E81' }}>Most Popular Quizzes</h3>
              {analytics.popularQuizzes.length === 0 ? (
                <p style={{ color: '#64748B' }}>No quizzes yet.</p>
              ) : (
                <div className="space-y-3">
                  {analytics.popularQuizzes.map((quiz) => (
                    <div key={quiz.id} className="flex items-center justify-between">
                      <span style={{ color: '#334155' }}>{quiz.title}</span>
                      <span className="font-bold" style={{ color: '#312E81' }}>{quiz.attempt_count} attempts</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Popular categories */}
            <div className="p-6 rounded-xl border bg-white" style={{ borderColor: '#E2E8F0' }}>
              <h3 className="font-bold mb-4" style={{ color: '#312E81' }}>Most Popular Categories</h3>
              {analytics.popularCategories.length === 0 ? (
                <p style={{ color: '#64748B' }}>No categories yet.</p>
              ) : (
                <div className="space-y-3">
                  {analytics.popularCategories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between">
                      <span style={{ color: '#334155' }}>{cat.name}</span>
                      <span className="font-bold" style={{ color: '#312E81' }}>{cat.attempt_count} attempts</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Average score per quiz */}
            <div className="p-6 rounded-xl border bg-white" style={{ borderColor: '#E2E8F0' }}>
              <h3 className="font-bold mb-4" style={{ color: '#312E81' }}>Average Score per Quiz</h3>
              {analytics.avgScorePerQuiz.length === 0 ? (
                <p style={{ color: '#64748B' }}>No data yet.</p>
              ) : (
                <div className="space-y-3">
                  {analytics.avgScorePerQuiz.map((quiz) => (
                    <div key={quiz.id} className="flex items-center justify-between">
                      <span style={{ color: '#334155' }}>{quiz.title}</span>
                      <span className="font-bold" style={{ color: '#312E81' }}>
                        {quiz.average_score ? Number(quiz.average_score).toFixed(1) : '0.0'}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminAnalytics;