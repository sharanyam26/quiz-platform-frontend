import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/axios';

function QuizResult() {
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    api
      .get(`/attempts/${attemptId}`)
      .then((res) => {
        setAttempt(res.data.attempt);
        setAnswers(res.data.answers);
      })
      .catch((err) => setError(err.response?.data?.error || 'Failed to load result'));
  }, [attemptId, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFAF9' }}>
        <p style={{ color: '#B91C1C' }}>{error}</p>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFAF9' }}>
        <p style={{ color: '#64748B' }}>Loading result...</p>
      </div>
    );
  }

  const passed = attempt.status === 'PASSED';

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF9' }}>
      <div className="px-8 py-5 border-b" style={{ borderColor: '#E2E8F0' }}>
        <Link to="/student/dashboard" className="text-sm font-medium" style={{ color: '#334155' }}>
          ← Back to Dashboard
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-12">
        {/* Score summary */}
        <div
          className="p-8 rounded-xl border text-center mb-8"
          style={{ borderColor: '#E2E8F0', backgroundColor: passed ? '#F0FDF4' : '#FEF2F2' }}
        >
          <p className="text-sm font-medium mb-1" style={{ color: '#64748B' }}>
            {attempt.quiz_title}
          </p>
          <p
            className="text-5xl font-bold mb-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: passed ? '#15803D' : '#B91C1C' }}
          >
            {Number(attempt.percentage).toFixed(0)}%
          </p>
          <p className="font-semibold" style={{ color: passed ? '#15803D' : '#B91C1C' }}>
            {passed ? 'PASSED' : 'FAILED'}
          </p>

          <div className="flex justify-center gap-8 mt-6 text-sm" style={{ color: '#334155' }}>
            <div>
              <p className="font-bold text-lg">{attempt.correct_answers}</p>
              <p style={{ color: '#64748B' }}>Correct</p>
            </div>
            <div>
              <p className="font-bold text-lg">{attempt.incorrect_answers}</p>
              <p style={{ color: '#64748B' }}>Incorrect</p>
            </div>
            <div>
              <p className="font-bold text-lg">{attempt.unanswered}</p>
              <p style={{ color: '#64748B' }}>Unanswered</p>
            </div>
          </div>
        </div>

        {/* Answer review */}
        <h3 className="text-lg font-bold mb-4" style={{ color: '#312E81' }}>
          Review Your Answers
        </h3>
        <div className="space-y-4">
          {answers.map((a, i) => (
            <div key={a.question_id} className="p-5 rounded-lg border bg-white" style={{ borderColor: '#E2E8F0' }}>
              <p className="font-medium mb-3" style={{ color: '#312E81' }}>
                {i + 1}. {a.question_text}
              </p>
              <p className="text-sm mb-1" style={{ color: a.is_correct ? '#15803D' : '#B91C1C' }}>
                Your answer: {a.selected_option_text || '(not answered)'}
              </p>
              {!a.is_correct && (
                <p className="text-sm mb-1" style={{ color: '#15803D' }}>
                  Correct answer: {a.correct_option_text}
                </p>
              )}
              {a.explanation && (
                <p className="text-sm mt-2 italic" style={{ color: '#64748B' }}>
                  {a.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuizResult;