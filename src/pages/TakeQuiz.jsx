import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

function TakeQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!token || !user) {
      navigate('/login');
      return;
    }

    // Step 1: start the attempt (creates a real attempt row, server-timed)
    api
      .post(`/quizzes/${id}/start`)
      .then((startRes) => {
        setAttemptId(startRes.data.attempt.id);
        setQuiz(startRes.data.quiz);
        setTimeLeft(startRes.data.quiz.duration * 60);

        // Step 2: fetch questions WITHOUT correct answers
        return api.get(`/quizzes/${id}/take`);
      })
      .then((questionsRes) => {
        setQuestions(questionsRes.data.questions);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to load quiz');
        setLoading(false);
      });
  }, [id, navigate]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft]);

  const handleAnswer = (questionId, selectedOptionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: selectedOptionId }));
  };

  const handleSubmit = async () => {
    const answersArray = Object.entries(answers).map(([question_id, selected_option_id]) => ({
      question_id: Number(question_id),
      selected_option_id,
    }));

    try {
      await api.post(`/quizzes/${id}/submit`, { attempt_id: attemptId, answers: answersArray });
      navigate(`/student/result/${attemptId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit quiz');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFAF9' }}>
        <p style={{ color: '#64748B' }}>Loading quiz...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFAF9' }}>
        <p style={{ color: '#B91C1C' }}>{error}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAFAF9' }}>
        <p style={{ color: '#64748B' }}>No questions available for this quiz.</p>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF9' }}>
      <div className="flex items-center justify-between px-8 py-5 border-b bg-white" style={{ borderColor: '#E2E8F0' }}>
        <div>
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#312E81' }}>
            {quiz.title}
          </h1>
          <p className="text-sm" style={{ color: '#64748B' }}>
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>
        <div
          className="px-5 py-3 rounded-lg font-bold text-lg"
          style={{
            backgroundColor: timeLeft <= 60 ? '#FEF2F2' : '#EEF2FF',
            color: timeLeft <= 60 ? '#B91C1C' : '#312E81',
          }}
        >
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-10">
        <div className="bg-white rounded-xl border p-8" style={{ borderColor: '#E2E8F0' }}>
          <p className="text-sm font-medium mb-3" style={{ color: '#F59E0B' }}>
            Question {currentQuestion + 1}
          </p>
          <h2 className="text-xl font-bold mb-6" style={{ color: '#312E81' }}>
            {question.question_text}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = answers[question.id] === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(question.id, option.id)}
                  className="w-full text-left p-4 rounded-lg border transition"
                  style={{
                    borderColor: isSelected ? '#312E81' : '#CBD5E1',
                    backgroundColor: isSelected ? '#EEF2FF' : '#FFFFFF',
                    color: '#334155',
                  }}
                >
                  <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option.option_text}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => setCurrentQuestion((prev) => Math.max(prev - 1, 0))}
              disabled={currentQuestion === 0}
              className="px-5 py-3 rounded-lg text-sm font-medium"
              style={{ color: currentQuestion === 0 ? '#94A3B8' : '#312E81', border: '1px solid #CBD5E1' }}
            >
              Previous
            </button>

            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion((prev) => prev + 1)}
                className="px-5 py-3 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: '#312E81' }}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-5 py-3 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: '#16A34A' }}
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TakeQuiz;