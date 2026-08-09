import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/axios';

function QuestionManagement() {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [quizTitle, setQuizTitle] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [questionText, setQuestionText] = useState('');
  const [marks, setMarks] = useState(1);
  const [explanation, setExplanation] = useState('');
  const [options, setOptions] = useState([
    { option_text: '', is_correct: true },
    { option_text: '', is_correct: false },
    { option_text: '', is_correct: false },
    { option_text: '', is_correct: false },
  ]);

  const loadData = () => {
    api.get(`/quizzes/${quizId}/questions`).then((res) => setQuestions(res.data.questions));
    api.get(`/quizzes/${quizId}`).then((res) => setQuizTitle(res.data.quiz.title));
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!token || !user || user.role !== 'ADMIN') {
      navigate('/login');
      return;
    }
    loadData();
  }, [navigate, quizId]);

  const handleOptionTextChange = (index, value) => {
    const updated = [...options];
    updated[index].option_text = value;
    setOptions(updated);
  };

  const handleCorrectChange = (index) => {
    const updated = options.map((opt, i) => ({ ...opt, is_correct: i === index }));
    setOptions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post(`/quizzes/${quizId}/questions`, {
        question_text: questionText,
        marks: Number(marks),
        explanation,
        difficulty: 'Easy',
        options,
      });
      setQuestionText('');
      setMarks(1);
      setExplanation('');
      setOptions([
        { option_text: '', is_correct: true },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
      ]);
      setShowForm(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add question');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    await api.delete(`/questions/${id}`);
    loadData();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAFAF9' }}>
      <div className="flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: '#E2E8F0' }}>
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#312E81' }}>
            Quiz Platform · Admin
          </h1>
          <Link to="/admin/dashboard" className="text-sm font-medium" style={{ color: '#334155' }}>Dashboard</Link>
          <Link to="/admin/quizzes" className="text-sm font-medium" style={{ color: '#334155' }}>Quizzes</Link>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm font-medium px-4 py-2 rounded-lg text-white"
          style={{ backgroundColor: '#F59E0B' }}
        >
          {showForm ? 'Cancel' : '+ Add Question'}
        </button>
      </div>

      <div className="px-8 py-8">
        <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#312E81' }}>
          {quizTitle || 'Loading...'}
        </h2>
        <p className="text-sm mb-8" style={{ color: '#334155' }}>Manage questions for this quiz.</p>

        {error && (
          <div className="mb-6 px-4 py-3 rounded text-sm" style={{ backgroundColor: '#FEF2F2', color: '#B91C1C' }}>
            {error}
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 p-6 rounded-xl border bg-white space-y-4" style={{ borderColor: '#E2E8F0' }}>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#334155' }}>Question</label>
              <input required value={questionText} onChange={(e) => setQuestionText(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: '#CBD5E1' }} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#334155' }}>
                Options (select the correct one)
              </label>
              <div className="space-y-2">
                {options.map((opt, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={opt.is_correct}
                      onChange={() => handleCorrectChange(index)}
                    />
                    <input
                      required
                      placeholder={`Option ${index + 1}`}
                      value={opt.option_text}
                      onChange={(e) => handleOptionTextChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border"
                      style={{ borderColor: '#CBD5E1' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#334155' }}>Marks</label>
                <input type="number" value={marks} onChange={(e) => setMarks(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: '#CBD5E1' }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#334155' }}>Explanation</label>
                <input value={explanation} onChange={(e) => setExplanation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border" style={{ borderColor: '#CBD5E1' }} />
              </div>
            </div>

            <button type="submit" className="px-5 py-2.5 rounded-lg font-medium text-white" style={{ backgroundColor: '#312E81' }}>
              Add Question
            </button>
          </form>
        )}

        <div className="space-y-3">
          {questions.length === 0 && <p style={{ color: '#64748B' }}>No questions yet. Add one above.</p>}
          {questions.map((q, i) => (
            <div key={q.id} className="p-4 rounded-lg border bg-white" style={{ borderColor: '#E2E8F0' }}>
              <div className="flex items-start justify-between">
                <p className="font-medium" style={{ color: '#312E81' }}>
                  {i + 1}. {q.question_text}
                </p>
                <button onClick={() => handleDelete(q.id)} className="text-sm font-medium" style={{ color: '#B91C1C' }}>
                  Delete
                </button>
              </div>
              <div className="mt-2 ml-4 space-y-1">
                {q.options.map((opt) => (
                  <p key={opt.id} className="text-sm" style={{ color: opt.is_correct ? '#15803D' : '#64748B' }}>
                    {opt.is_correct ? '✓' : '○'} {opt.option_text}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuestionManagement;