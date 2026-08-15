import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function AttemptHistory() {
  const [attempts, setAttempts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    api
      .get('/attempts')
      .then((res) => setAttempts(res.data.attempts))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load attempts'));
  }, [navigate]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF9' }}>
      <div className="px-8 py-5 border-b bg-white" style={{ borderColor: '#E2E8F0' }}>
        <Link to="/student/dashboard" className="text-sm font-medium" style={{ color: '#334155' }}>← Back to Dashboard</Link>
      </div>
      <div className="max-w-2xl mx-auto px-8 py-10">
        <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#312E81' }}>
          Attempt History
        </h2>
        {error && <p style={{ color: '#B91C1C' }}>{error}</p>}
        {attempts.length === 0 && !error && <p style={{ color: '#64748B' }}>No attempts yet.</p>}
        <div className="space-y-3">
          {attempts.filter(a => a.status !== 'IN_PROGRESS').map((a) => (
            <Link
              key={a.id}
              to={`/student/result/${a.id}`}
              className="flex items-center justify-between p-4 rounded-lg border bg-white block hover:shadow-md transition-shadow"
              style={{ borderColor: '#E2E8F0' }}
            >
              <div>
                <p className="font-medium" style={{ color: '#312E81' }}>{a.quiz_title}</p>
                <p className="text-sm" style={{ color: '#64748B' }}>{new Date(a.completed_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-bold" style={{ color: '#312E81' }}>{Number(a.percentage).toFixed(0)}%</p>
                <p className="text-sm font-medium" style={{ color: a.status === 'PASSED' ? '#15803D' : '#B91C1C' }}>{a.status}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AttemptHistory;