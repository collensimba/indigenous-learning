'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', consent: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    const bootstrap = require('bootstrap/dist/js/bootstrap.bundle.min.js');
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(el => new bootstrap.Tooltip(el));
    const popovers = document.querySelectorAll('[data-bs-toggle="popover"]');
    popovers.forEach(el => new bootstrap.Popover(el));
  }, []);

  const checkStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    setPasswordStrength(score);
  };

  const strengthLabel = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const strengthColor = ['', 'danger', 'warning', 'info', 'primary', 'success'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match'); return;
    }
    if (!formData.consent) {
      setError('You must give consent to process your child\'s data'); return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters'); return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          consent: formData.consent,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Registration failed'); return; }
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
        <a href="/login" className="btn btn-outline-light btn-sm">Already have an account?</a>
      </nav>

      {/* Card */}
      <div className="flex-grow-1 d-flex align-items-center justify-content-center px-3 py-4">
        <div className="card border-0 shadow-lg w-100" style={{ maxWidth: '500px', borderRadius: '20px' }}>
          <div className="card-body p-4 p-md-5">

            {/* Header */}
            <div className="text-center mb-4">
              <span style={{ fontSize: '3rem' }}>🌍</span>
              <h2 className="fw-bold mt-2" style={{ color: '#1a5276' }}>Create Account</h2>
              <p className="text-muted">Join Dandaro — it's free</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
                <button type="button" className="btn-close" onClick={() => setError('')}></button>
              </div>
            )}

            {/* Steps Badge */}
            <div className="d-flex justify-content-center gap-2 mb-4">
              {['Your Details', 'Set Password', 'Give Consent'].map((step, i) => (
                <span key={i} className="badge rounded-pill px-3 py-2"
                  style={{ background: i === 0 ? '#1a5276' : i === 1 ? '#1e8449' : '#7d3c98', fontSize: '0.75em' }}>
                  {i + 1}. {step}
                </span>
              ))}
            </div>

            <form onSubmit={handleSubmit}>

              {/* Full Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark">
                  Full Name
                  <span className="ms-2 text-muted"
                    data-bs-toggle="tooltip"
                    data-bs-placement="right"
                    title="Enter your full name as the parent or guardian registering"
                    style={{ cursor: 'pointer', fontSize: '0.85em' }}>ℹ️</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">👤</span>
                  <input
                    type="text"
                    className="form-control border-start-0 ps-0"
                    placeholder="e.g. Tendai Moyo"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

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
              <div className="mb-2">
                <label className="form-label fw-semibold text-dark">
                  Password
                  <span className="ms-2"
                    data-bs-toggle="popover"
                    data-bs-placement="right"
                    data-bs-trigger="focus"
                    title="Password Tips"
                    data-bs-content="Use at least 6 characters. Mix uppercase, numbers, and symbols for a stronger password."
                    style={{ cursor: 'pointer', fontSize: '0.85em' }}>💡</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control border-start-0 border-end-0 ps-0"
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={e => { setFormData({ ...formData, password: e.target.value }); checkStrength(e.target.value); }}
                    required
                  />
                  <button type="button" className="input-group-text bg-light"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Password Strength */}
              {formData.password && (
                <div className="mb-3">
                  <div className="progress" style={{ height: '6px' }}>
                    <div
                      className={`progress-bar bg-${strengthColor[passwordStrength]}`}
                      style={{ width: `${(passwordStrength / 5) * 100}%`, transition: 'width 0.3s' }}>
                    </div>
                  </div>
                  <small className={`text-${strengthColor[passwordStrength]}`}>
                    {strengthLabel[passwordStrength]}
                  </small>
                </div>
              )}

              {/* Confirm Password */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark">Confirm Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">🔒</span>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    className={`form-control border-start-0 border-end-0 ps-0 ${formData.confirmPassword && (formData.password === formData.confirmPassword ? 'is-valid' : 'is-invalid')}`}
                    placeholder="Repeat your password"
                    value={formData.confirmPassword}
                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                  <button type="button" className="input-group-text bg-light"
                    onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <div className="valid-feedback">Passwords match ✓</div>
                  <div className="invalid-feedback">Passwords do not match</div>
                </div>
              </div>

              {/* Consent */}
              <div className="alert alert-info border-0 mb-3" style={{ background: '#eaf4fb' }}>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="consent"
                    checked={formData.consent}
                    onChange={e => setFormData({ ...formData, consent: e.target.checked })}
                  />
                  <label className="form-check-label small" htmlFor="consent" style={{ color: '#1a5276' }}>
                    <strong>Parental Consent (Required)</strong><br />
                    I consent to Dandaro processing my child's learning data in accordance with Zimbabwe's
                    <button type="button" className="btn btn-link btn-sm p-0 ms-1 text-decoration-none"
                      data-bs-toggle="modal" data-bs-target="#consentModal"
                      style={{ color: '#1a5276', fontSize: 'inherit' }}>
                      Cybersecurity and Data Protection Act (2021)
                    </button>.
                    Only alias names are collected and data is encrypted.
                  </label>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-lg w-100 fw-bold text-white mb-3"
                style={{ background: 'linear-gradient(135deg, #1a5276, #1e8449)', borderRadius: '10px' }}>
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2"></span>Creating Account...</>
                  : '🚀 Create Account'}
              </button>

              <div className="text-center">
                <span className="text-muted">Already have an account? </span>
                <a href="/login" className="fw-bold text-decoration-none" style={{ color: '#1a5276' }}>Login here</a>
              </div>
            </form>
          </div>

          <div className="card-footer text-center bg-light py-3" style={{ borderRadius: '0 0 20px 20px' }}>
            <small className="text-muted">🛡️ ZDPA 2021 Compliant | AES-256 Encrypted | Alias Names Only</small>
          </div>
        </div>
      </div>

      {/* Consent Detail Modal */}
      <div className="modal fade" id="consentModal" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content" style={{ borderRadius: '16px' }}>
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #1a5276, #1e8449)' }}>
              <h5 className="modal-title text-white fw-bold">🛡️ Data Protection & Consent</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body p-4">
              <div className="alert alert-success d-flex gap-2">
                <span>✅</span>
                <span>Dandaro is compliant with Zimbabwe's Cybersecurity and Data Protection Act (2021).</span>
              </div>
              {[
                { title: '👤 What data we collect', text: 'Parent name, email, and encrypted password. Child profiles use alias names only — no real names, photos, or personal identifiers.' },
                { title: '🔒 How we protect it', text: 'All passwords are hashed using bcrypt. Data is encrypted at rest (AES-256) and in transit (TLS 1.3). We use Upstash Redis with enterprise-grade security.' },
                { title: '📊 How we use it', text: 'Data is used only to provide personalised learning support. We never sell, share, or use data for advertising purposes.' },
                { title: '🗑️ Your rights', text: 'You may request account deletion at any time from the dashboard settings. All data is deleted within 30 days of the request.' },
              ].map((item, i) => (
                <div key={i} className="mb-3">
                  <h6 className="fw-bold" style={{ color: '#1a5276' }}>{item.title}</h6>
                  <p className="text-muted small mb-0">{item.text}</p>
                  {i < 3 && <hr />}
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-success fw-bold" data-bs-dismiss="modal">
                I Understand & Consent
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}