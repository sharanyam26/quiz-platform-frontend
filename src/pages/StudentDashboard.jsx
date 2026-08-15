import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function StudentDashboard() {
  const [stats, setStats] = useState(null);
  const [recentAttempts, setRecentAttempts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!token || !user) {
      navigate('/login');
      return;
    }

    api
      .get('/student/dashboard')
      .then((res) => {
        setStats(res.data.stats);
        setRecentAttempts(res.data.recentAttempts);
      })
      .catch((err) => setError(err.response?.data?.error || 'Failed to load dashboard'));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const cards = stats
    ? [
        { label: 'Quizzes Attempted', value: stats.totalAttempted },
        { label: 'Passed', value: stats.totalPassed },
        { label: 'Failed', value: stats.totalFailed },
        { label: 'Average Score', value: `${Number(stats.averageScore).toFixed(1)}%` },
        { label: 'Highest Score', value: `${Number(stats.highestScore).toFixed(1)}%` },
        { label: 'Questions Answered', value: stats.totalQuestionsAnswered },
      ]
    : [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF9' }}>
      <div className="flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: '#E2E8F0' }}>
        <div className="flex items-center gap-6">
  <h1 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#312E81' }}>
    Quiz Platform
  </h1>
  <Link to="/student/quizzes" className="text-sm font-medium" style={{ color: '#334155' }}>Quizzes</Link>
  <Link to="/leaderboard" className="text-sm font-medium" style={{ color: '#334155' }}>Leaderboard</Link>
  <Link to="/student/attempts" className="text-sm font-medium" style={{ color: '#334155' }}>History</Link>
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
          My Dashboard
        </h2>
        <p className="text-sm mb-8" style={{ color: '#334155' }}>
          Your quiz activity and performance.
        </p>

        {error && (
          <div className="mb-6 px-4 py-3 rounded text-sm" style={{ backgroundColor: '#FEF2F2', color: '#B91C1C' }}>
            {error}
          </div>
        )}

        {!stats && !error && <p style={{ color: '#334155' }}>Loading...</p>}

        {stats && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {cards.map((card) => (
                <div key={card.label} className="p-5 rounded-xl border bg-white" style={{ borderColor: '#E2E8F0' }}>
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

            <h3 className="text-lg font-bold mb-4" style={{ color: '#312E81' }}>
              Recent Attempts
            </h3>

            {recentAttempts.length === 0 ? (
              <p style={{ color: '#64748B' }}>No quiz attempts yet. Go take a quiz!</p>
            ) : (
              <div className="space-y-3">
                {recentAttempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-white"
                    style={{ borderColor: '#E2E8F0' }}
                  >
                    <div>
                      <p className="font-medium" style={{ color: '#312E81' }}>
                        {attempt.quiz_title}
                      </p>
                      <p className="text-sm" style={{ color: '#64748B' }}>
                        {new Date(attempt.completed_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold" style={{ color: '#312E81' }}>
                        {Number(attempt.percentage).toFixed(0)}%
                      </p>
                      <p
                        className="text-sm font-medium"
                        style={{ color: attempt.status === 'PASSED' ? '#15803D' : '#B91C1C' }}
                      >
                        {attempt.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;