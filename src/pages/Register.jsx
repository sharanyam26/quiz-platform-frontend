import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/register', { name, email, password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#FAFAF9' }}>
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-sm">
          <h1
            className="text-3xl font-bold mb-1"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: '#312E81' }}
          >
            Create your account
          </h1>
          <p className="text-sm mb-8" style={{ color: '#334155' }}>
            Register to start taking quizzes.
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded text-sm" style={{ backgroundColor: '#FEF2F2', color: '#B91C1C' }}>
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 px-4 py-3 rounded text-sm" style={{ backgroundColor: '#F0FDF4', color: '#15803D' }}>
              Account created! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#334155' }}>
                Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border outline-none transition-colors"
                style={{ borderColor: '#CBD5E1' }}
                onFocus={(e) => (e.target.style.borderColor = '#F59E0B')}
                onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#334155' }}>
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border outline-none transition-colors"
                style={{ borderColor: '#CBD5E1' }}
                onFocus={(e) => (e.target.style.borderColor = '#F59E0B')}
                onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#334155' }}>
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border outline-none transition-colors"
                style={{ borderColor: '#CBD5E1' }}
                onFocus={(e) => (e.target.style.borderColor = '#F59E0B')}
                onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
                placeholder="At least 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-medium text-white transition-opacity disabled:opacity-60"
              style={{ backgroundColor: '#F59E0B' }}
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <p className="text-sm mt-6 text-center" style={{ color: '#334155' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-medium" style={{ color: '#312E81' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div
        className="hidden md:flex flex-1 items-center justify-center"
        style={{ backgroundColor: '#312E81' }}
      >
        <div className="max-w-sm px-8">
          <h2
            className="text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Quiz Platform
          </h2>
          <p className="text-indigo-200 leading-relaxed">
            Join to test your knowledge, track your progress, and see how you
            compare on the leaderboard.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;