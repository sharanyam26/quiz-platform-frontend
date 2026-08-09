import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      if (res.data.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
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
            Welcome back
          </h1>
          <p className="text-sm mb-8" style={{ color: '#334155' }}>
            Sign in to continue to your quizzes.
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded text-sm" style={{ backgroundColor: '#FEF2F2', color: '#B91C1C' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-medium text-white transition-opacity disabled:opacity-60"
              style={{ backgroundColor: '#F59E0B' }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-sm mt-6 text-center" style={{ color: '#334155' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-medium" style={{ color: '#312E81' }}>
              Register
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
            Create, take, and track quizzes — with instant scoring and a clear
            record of how you're improving over time.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;