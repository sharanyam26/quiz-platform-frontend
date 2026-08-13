import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!token || !user) {
      navigate('/login');
      return;
    }
    setCurrentUser(user);

    api
      .get('/leaderboard')
      .then((res) => setLeaderboard(res.data.leaderboard))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load leaderboard'));
  }, [navigate]);

  const dashboardPath = currentUser?.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard';

  const medalColor = (rank) => {
    if (rank === 1) return '#F59E0B';
    if (rank === 2) return '#94A3B8';
    if (rank === 3) return '#B45309';
    return '#CBD5E1';
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF9' }}>
      <div className="flex items-center justify-between px-8 py-5 border-b bg-white" style={{ borderColor: '#E2E8F0' }}>
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#312E81' }}>
            Quiz Platform
          </h1>
          <Link to={dashboardPath} className="text-sm font-medium" style={{ color: '#334155' }}>Dashboard</Link>
          {currentUser?.role === 'STUDENT' && (
            <Link to="/student/quizzes" className="text-sm font-medium" style={{ color: '#334155' }}>Quizzes</Link>
          )}
          <span className="text-sm font-medium" style={{ color: '#F59E0B' }}>Leaderboard</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-10">
        <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#312E81' }}>
          Leaderboard
        </h2>
        <p className="text-sm mb-8" style={{ color: '#334155' }}>Top performers across all quizzes.</p>

        {error && (
          <div className="mb-6 px-4 py-3 rounded text-sm" style={{ backgroundColor: '#FEF2F2', color: '#B91C1C' }}>
            {error}
          </div>
        )}

        {leaderboard.length === 0 && !error && (
          <p style={{ color: '#64748B' }}>No completed attempts yet.</p>
        )}

        <div className="space-y-2">
          {leaderboard.map((entry) => {
            const isMe = currentUser && entry.user_id === currentUser.id;
            return (
              <div
                key={entry.user_id}
                className="flex items-center justify-between p-4 rounded-lg border"
                style={{
                  borderColor: isMe ? '#F59E0B' : '#E2E8F0',
                  backgroundColor: isMe ? '#FFFBEB' : '#FFFFFF',
                }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: medalColor(entry.rank) }}
                  >
                    {entry.rank}
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: '#312E81' }}>
                      {entry.name} {isMe && <span className="text-xs font-normal" style={{ color: '#F59E0B' }}>(You)</span>}
                    </p>
                    <p className="text-xs" style={{ color: '#64748B' }}>
                      {entry.quizzes_completed} quiz{entry.quizzes_completed !== 1 ? 'zes' : ''} completed
                    </p>
                  </div>
                </div>
                <p className="font-bold" style={{ color: '#312E81' }}>
                  {entry.average_score}%
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;