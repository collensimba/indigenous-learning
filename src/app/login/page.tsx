'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const bootstrap = require('bootstrap/dist/js/bootstrap.bundle.min.js');
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(el => new bootstrap.Tooltip(el));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed'); return; }
      localStorage.setItem('dandaro_token', data.token);
      localStorage.setItem('dandaro_user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: 'linear-gradient(135deg, #1a5276 0%, #1e8449 100%)' }}>

      {/* Navbar */}
      <nav className="navbar px-4 py-3">
        <a href="/" className="navbar-brand d-flex align-items-center gap-2 text-white fw-bold fs-4 text-decoration-none">
          <BookOpen size={26} /> Dandaro
        </a>
        <a href="/register" className="btn btn-outline-light btn-sm">Create Account</a>
      </nav>

      {/* Card */}
      <div className="flex-grow-1 d-flex align-items-center justify-content-center px-3 py-5">
        <div className="card border-0 shadow-lg w-100" style={{ maxWidth: '440px', borderRadius: '20px' }}>
          <div className="card-body p-4 p-md-5">

            {/* Header */}
            <div className="text-center mb-4">
              <div className="mb-3">
                <span style={{ fontSize: '3rem' }}>🌍</span>
              </div>
              <h2 className="fw-bold" style={{ color: '#1a5276' }}>Welcome Back</h2>
              <p className="text-muted">Login to your Dandaro account</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center gap-2" role="alert">
                <span>⚠️</span>
                <span>{error}</span>
                <button type="button" className="btn-close" onClick={() => setError('')}></button>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">📧</span>
                  <input
                    type="email"
                    className="form-control border-start-0 ps-0"
                    placeholder="e.g. tendai@email.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark">
                  Password
                  <span
                    className="ms-2 text-muted"
                    data-bs-toggle="tooltip"
                    data-bs-placement="right"
                    title="Your password must be at least 6 characters"
                    style={{ cursor: 'pointer', fontSize: '0.85em' }}>
                    ℹ️
                  </span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control border-start-0 border-end-0 ps-0"
                    placeholder="Your password"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="input-group-text bg-light"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-end mb-4">
                <button
                  type="button"
                  className="btn btn-link btn-sm text-decoration-none p-0"
                  data-bs-toggle="modal"
                  data-bs-target="#forgotModal"
                  style={{ color: '#1a5276' }}>
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-lg w-100 fw-bold text-white mb-3"
                style={{ background: 'linear-gradient(135deg, #1a5276, #1e8449)', borderRadius: '10px' }}>
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2"></span>Logging in...</>
                  : '🔐 Login'}
              </button>

              {/* Divider */}
              <div className="d-flex align-items-center gap-2 mb-3">
                <hr className="flex-grow-1" />
                <span className="text-muted small">or</span>
                <hr className="flex-grow-1" />
              </div>

              {/* Register Link */}
              <div className="text-center">
                <span className="text-muted">Don't have an account? </span>
                <a href="/register" className="fw-bold text-decoration-none" style={{ color: '#1a5276' }}>
                  Register here
                </a>
              </div>
            </form>
          </div>

          {/* Card Footer */}
          <div className="card-footer text-center bg-light py-3" style={{ borderRadius: '0 0 20px 20px' }}>
            <small className="text-muted">🛡️ Protected by ZDPA 2021 | Your data is encrypted</small>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <div className="modal fade" id="forgotModal" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ borderRadius: '16px' }}>
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #1a5276, #1e8449)' }}>
              <h5 className="modal-title text-white fw-bold">🔑 Reset Password</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body p-4">
              <p className="text-muted mb-3">Enter your email address and we'll send you a password reset link.</p>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email Address</label>
                <input type="email" className="form-control" placeholder="e.g. tendai@email.com" />
              </div>
              <div className="alert alert-info d-flex align-items-center gap-2 small">
                <span>ℹ️</span>
                <span>Password reset is coming soon. Please contact your administrator for now.</span>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-success fw-bold" data-bs-dismiss="modal">Send Reset Link</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}