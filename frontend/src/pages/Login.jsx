import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight, UserPlus } from 'lucide-react';
import Button from '../components/common/Button';
import './pages.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');

  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('roadSOSLoggedIn');

    if (isLoggedIn === 'true') {
      navigate('/home');
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    if (isRegister && !name.trim()) {
      setError('Please enter your name.');
      setLoading(false);
      return;
    }

    try {
      const endpoint = isRegister
        ? '/api/auth/register'
        : '/api/auth/login';

      const payload = isRegister
        ? { email, password, name }
        : { email, password };

      const response = await fetch(
        `http://10.242.239.216:5000${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Authentication failed');
        setLoading(false);
        return;
      }

      localStorage.setItem('roadSOSLoggedIn', 'true');

      localStorage.setItem(
        'roadSOSUser',
        JSON.stringify(data.user)
      );
      // SAVE USER ID
      localStorage.setItem('userId', data.user.id);
      window.dispatchEvent(new Event('roadSOSUserChanged'));
      navigate('/home');
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card animate-slide-up">
        <section className="login-hero">
          <div className="hero-badge">
            <ShieldAlert size={28} />
            <span>RoadSOS</span>
          </div>

          <div className="hero-content">
            <h1>{isRegister ? 'Create your account' : 'Secure emergency access'}</h1>
            <p>
              {isRegister
                ? 'Register to get immediate access to roadside help, first aid directions, and local emergency services.'
                : 'Sign in to track incidents, request help and reach nearby trauma centers instantly.'}
            </p>
          </div>

          <div className="hero-features">
            <div className="feature-pill">Fast response</div>
            <div className="feature-pill">24/7 support</div>
            <div className="feature-pill">Safe navigation</div>
          </div>

          <div className="hero-footnote">
            <span>Trusted by drivers across the city.</span>
          </div>
        </section>

        <section className="login-form-panel">
          <div className="login-panel-header">
            <div>
              <p className="login-subtitle">{isRegister ? 'Create Account' : 'Welcome Back'}</p>
              <h2>{isRegister ? 'Join RoadSOS' : 'Login to continue'}</h2>
            </div>
            <div className="login-step">Step 1</div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {isRegister && (
              <div className="form-group">
                <label className="form-label">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="form-input"
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="form-input"
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <Button type="submit" className="login-submit" variant="danger" disabled={loading}>
              {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Login'}
              {isRegister ? <UserPlus size={18} /> : <ArrowRight size={18} />}
            </Button>
          </form>

          <div className="auth-switch">
            <span>
              {isRegister ? 'Already have an account?' : "Don't have an account?"}
            </span>
            <button
              type="button"
              className="toggle-link"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
                setName('');
                setEmail('');
                setPassword('');
              }}
            >
              {isRegister ? 'Login' : 'Sign Up'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;