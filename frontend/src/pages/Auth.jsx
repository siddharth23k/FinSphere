import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isRegister, setIsRegister] = useState(searchParams.get('mode') === 'register');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsRegister(searchParams.get('mode') === 'register');
  }, [searchParams]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register(form.name, form.email, form.password);
      } else {
        await login(form.email, form.password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <Link to="/" className="auth-logo">Fin<span>Sphere</span></Link>
        <div className="auth-hero-text">
          <h1>"Smarter decisions.<br />Better finance."</h1>
          <p>Start your investment journey with ₹1,00,000 virtual capital. No risk, real learning.</p>
        </div>
        <div className="auth-features">
          <div>✅ Paper trading with live market data</div>
          <div>✅ Portfolio analytics and insights</div>
          <div>✅ Financial news and learning hub</div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <h2>{isRegister ? 'Create your account' : 'Welcome back'}</h2>
          <p className="auth-subtitle">{isRegister ? 'Join FinSphere and start learning' : 'Sign in to your FinSphere account'}</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {isRegister && (
              <div className="form-group">
                <label>Full Name</label>
                <input
                  className="input"
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className="form-group">
              <label>Email</label>
              <input
                className="input"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                className="input"
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
              {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <p className="auth-toggle">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? 'Sign In' : 'Sign Up'}
            </button>
          </p>

          <p className="auth-disclaimer">
            Educational / Paper Trading only. Not real financial advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;