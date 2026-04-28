'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    consent: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.consent) {
      setError('You must give consent to process your child\'s data');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
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

      if (!res.ok) {
        setError(data.error || 'Registration failed');
        return;
      }

      // Save token and user to localStorage
      localStorage.setItem('dandaro_token', data.token);
      localStorage.setItem('dandaro_user', JSON.stringify(data.user));

      // Redirect to dashboard
      router.push('/dashboard');

    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a5276 0%, #1e8449 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#1a5276', margin: 0 }}>
            🌍 Dandaro
          </h1>
          <p style={{ color: '#666', marginTop: '8px', fontSize: '0.95em' }}>
            Create your parent account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fdecea',
            border: '1px solid #f5c6cb',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            color: '#c0392b',
            fontSize: '0.9em',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333', fontSize: '0.9em' }}>
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Tendai Moyo"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '1em',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333', fontSize: '0.9em' }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. tendai@email.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '1em',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333', fontSize: '0.9em' }}>
              Password
            </label>
            <input
              type="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '1em',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333', fontSize: '0.9em' }}>
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Repeat your password"
              value={formData.confirmPassword}
              onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '1em',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          {/* Consent Checkbox */}
          <div style={{
            background: '#eaf4fb',
            border: '1px solid #aed6f1',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
          }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.consent}
                onChange={e => setFormData({ ...formData, consent: e.target.checked })}
                style={{ marginTop: '3px', width: '16px', height: '16px', flexShrink: 0 }}
              />
              <span style={{ fontSize: '0.85em', color: '#1a5276', lineHeight: '1.5' }}>
                <strong>Parental Consent (Required)</strong><br />
                I consent to Dandaro processing my child's learning data in accordance with
                Zimbabwe's Cybersecurity and Data Protection Act (2021). I understand that
                only alias names are collected and data is encrypted and protected.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#95a5a6' : 'linear-gradient(135deg, #1a5276, #1e8449)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1em',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '16px',
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          {/* Login Link */}
          <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9em', margin: 0 }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: '#1a5276', fontWeight: 'bold', textDecoration: 'none' }}>
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}