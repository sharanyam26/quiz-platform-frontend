import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function QuizBrowse() {
  const [quizzes, setQuizzes] = useState([]);
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
      .get('/quizzes')
      .then((res) => setQuizzes(res.data.quizzes))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load quizzes'));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF9' }}>
      <div className="flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: '#E2E8F0' }}>
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#312E81' }}>
            Quiz Platform
          </h1>
          <Link to="/student/dashboard" className="text-sm font-medium" style={{ color: '#334155' }}>Dashboard</Link>
          <span className="text-sm font-medium" style={{ color: '#F59E0B' }}>Quizzes</span>
        </div>
        <button onClick={handleLogout} className="text-sm font-medium px-4 py-2 rounded-lg" style={{ color: '#312E81', border: '1px solid #CBD5E1' }}>
          Log out
        </button>
      </div>

      <div className="px-8 py-8">
        <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#312E81' }}>
          Available Quizzes
        </h2>
        <p className="text-sm mb-8" style={{ color: '#334155' }}>Pick one to get started.</p>

        {error && (
          <div className="mb-6 px-4 py-3 rounded text-sm" style={{ backgroundColor: '#FEF2F2', color: '#B91C1C' }}>
            {error}
          </div>
        )}

        {quizzes.length === 0 && !error && <p style={{ color: '#64748B' }}>No quizzes available right now.</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <Link
              key={quiz.id}
              to={`/student/quizzes/${quiz.id}`}
              className="p-5 rounded-xl border bg-white hover:shadow-md transition-shadow block"
              style={{ borderColor: '#E2E8F0' }}
            >
              <p className="font-bold mb-1" style={{ color: '#312E81' }}>{quiz.title}</p>
              <p className="text-sm mb-3" style={{ color: '#64748B' }}>{quiz.description}</p>
              <div className="flex gap-3 text-xs" style={{ color: '#64748B' }}>
                <span>{quiz.difficulty}</span>
                <span>·</span>
                <span>{quiz.duration} min</span>
                <span>·</span>
                <span>Pass at {quiz.passing_score}%</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuizBrowse;