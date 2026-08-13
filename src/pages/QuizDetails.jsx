import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/axios';

function QuizDetails() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
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
      .get(`/quizzes/${id}`)
      .then((res) => setQuiz(res.data.quiz))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load quiz'));
  }, [id, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFAF9' }}>
        <p style={{ color: '#B91C1C' }}>{error}</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFAF9' }}>
        <p style={{ color: '#64748B' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF9' }}>
      <div className="px-8 py-5 border-b" style={{ borderColor: '#E2E8F0' }}>
        <Link to="/student/quizzes" className="text-sm font-medium" style={{ color: '#334155' }}>
          ← Back to Quizzes
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-12">
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#312E81' }}>
          {quiz.title}
        </h1>
        <p className="mb-8" style={{ color: '#334155' }}>{quiz.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-lg border bg-white" style={{ borderColor: '#E2E8F0' }}>
            <p className="text-sm" style={{ color: '#64748B' }}>Difficulty</p>
            <p className="font-bold" style={{ color: '#312E81' }}>{quiz.difficulty}</p>
          </div>
          <div className="p-4 rounded-lg border bg-white" style={{ borderColor: '#E2E8F0' }}>
            <p className="text-sm" style={{ color: '#64748B' }}>Duration</p>
            <p className="font-bold" style={{ color: '#312E81' }}>{quiz.duration} minutes</p>
          </div>
          <div className="p-4 rounded-lg border bg-white" style={{ borderColor: '#E2E8F0' }}>
            <p className="text-sm" style={{ color: '#64748B' }}>Passing Score</p>
            <p className="font-bold" style={{ color: '#312E81' }}>{quiz.passing_score}%</p>
          </div>
          <div className="p-4 rounded-lg border bg-white" style={{ borderColor: '#E2E8F0' }}>
            <p className="text-sm" style={{ color: '#64748B' }}>Max Attempts</p>
            <p className="font-bold" style={{ color: '#312E81' }}>{quiz.max_attempts}</p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/student/quizzes/${id}/take`)}
          className="px-6 py-3 rounded-lg font-medium text-white"
          style={{ backgroundColor: '#F59E0B' }}
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}

export default QuizDetails;