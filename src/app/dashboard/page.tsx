'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, BarChart3, LogOut, Plus, User } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [childForm, setChildForm] = useState({
    aliasName: '', gradeLevel: '', preferredLanguage: '', schoolName: '',
  });

  useEffect(() => {
    const bootstrap = require('bootstrap/dist/js/bootstrap.bundle.min.js');
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(el => new bootstrap.Tooltip(el));

    const storedUser = localStorage.getItem('dandaro_user');
    const token = localStorage.getItem('dandaro_token');
    if (!storedUser || !token) { router.push('/login'); return; }
    const u = JSON.parse(storedUser);
    setUser(u);
    setChildren(u.children || []);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('dandaro_token');
    localStorage.removeItem('dandaro_user');
    router.push('/login');
  };

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const token = localStorage.getItem('dandaro_token');
      const res = await fetch('/api/children', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(childForm),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to add child'); return; }
      const newChildren = [...children, data.child];
      setChildren(newChildren);
      const updatedUser = { ...user, children: newChildren };
      localStorage.setItem('dandaro_user', JSON.stringify(updatedUser));
      setSuccess(`${data.child.aliasName}'s profile created successfully!`);
      setChildForm({ aliasName: '', gradeLevel: '', preferredLanguage: '', schoolName: '' });
      // Close modal
      const bootstrap = require('bootstrap/dist/js/bootstrap.bundle.min.js');
      const modal = bootstrap.Modal.getInstance(document.getElementById('addChildModal'));
      modal?.hide();
    } catch { setError('Something went wrong. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleLearn = (child: any) => {
    localStorage.setItem('dandaro_active_child', JSON.stringify(child));
    router.push('/learn');
  };

  const handleDeleteChild = (id: string) => {
    const newChildren = children.filter(c => c.id !== id);
    setChildren(newChildren);
    const updatedUser = { ...user, children: newChildren };
    localStorage.setItem('dandaro_user', JSON.stringify(updatedUser));
    setSuccess('Child profile removed.');
  };

  const langEmoji: any = { Shona: '🦁', Ndebele: '🐘', Tonga: '🦒' };
  const langColor: any = { Shona: '#1e8449', Ndebele: '#2471a3', Tonga: '#7d3c98' };

  if (!user) return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: 'linear-gradient(135deg, #1a5276, #1e8449)' }}>
      <div className="text-center text-white">
        <div className="spinner-border text-light mb-3" style={{ width: '3rem', height: '3rem' }}></div>
        <p className="fs-5">Loading your dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-vh-100" style={{ background: '#f0f4f8' }}>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg shadow-sm sticky-top"
        style={{ background: 'linear-gradient(135deg, #1a5276, #1e8449)' }}>
        <div className="container">
          <a className="navbar-brand d-flex align-items-center gap-2 text-white fw-bold fs-4" href="/">
            <BookOpen size={26} /> Dandaro
          </a>
          <div className="d-flex align-items-center gap-3">
            {/* User Dropdown */}
            <div className="dropdown">
              <button className="btn btn-outline-light btn-sm dropdown-toggle d-flex align-items-center gap-2"
                data-bs-toggle="dropdown">
                <User size={16} /> {user.name}
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow">
                <li><span className="dropdown-item-text text-muted small">{user.email}</span></li>
                <li><span className="dropdown-item-text text-muted small">Role: {user.role}</span></li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger d-flex align-items-center gap-2"
                    onClick={handleLogout}>
                    <LogOut size={14} /> Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <div className="container py-4">

        {/* Welcome Banner */}
        <div className="card border-0 shadow-sm mb-4 text-white"
          style={{ background: 'linear-gradient(135deg, #1a5276, #1e8449)', borderRadius: '16px' }}>
          <div className="card-body p-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h3 className="fw-bold mb-1">👋 Welcome back, {user.name}!</h3>
              <p className="mb-0 opacity-75">Manage your children's learning profiles below.</p>
            </div>
            <div className="d-flex gap-3 text-center">
              <div className="bg-white bg-opacity-10 rounded-3 px-4 py-2">
                <div className="fs-4 fw-bold">{children.length}</div>
                <div className="small opacity-75">Profiles</div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-3 px-4 py-2">
                <div className="fs-4 fw-bold">
                  {[...new Set(children.map(c => c.preferredLanguage))].length}
                </div>
                <div className="small opacity-75">Languages</div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {success && (
          <div className="alert alert-success alert-dismissible fade show d-flex align-items-center gap-2">
            <span>✅</span><span>{success}</span>
            <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
          </div>
        )}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center gap-2">
            <span>⚠️</span><span>{error}</span>
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        )}

        {/* Section Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0" style={{ color: '#1a5276' }}>
            👧 Child Profiles ({children.length})
          </h5>
          <button className="btn btn-success fw-bold d-flex align-items-center gap-2"
            data-bs-toggle="modal" data-bs-target="#addChildModal">
            <Plus size={16} /> Add Child Profile
          </button>
        </div>

        {/* Children Cards */}
        {children.length === 0 ? (
          <div className="card border-0 shadow-sm text-center py-5">
            <div className="card-body">
              <div style={{ fontSize: '4rem' }}>👧</div>
              <h4 className="fw-bold mt-3" style={{ color: '#1a5276' }}>No child profiles yet</h4>
              <p className="text-muted mb-4">Add your first child profile to get started with Dandaro</p>
              <button className="btn btn-success btn-lg fw-bold px-5"
                data-bs-toggle="modal" data-bs-target="#addChildModal">
                + Add First Child
              </button>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {children.map((child: any) => (
              <div key={child.id} className="col-md-4">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                  {/* Card top color bar */}
                  <div style={{ height: '6px', background: langColor[child.preferredLanguage] || '#1a5276' }}></div>
                  <div className="card-body p-4 text-center">
                    <div style={{ fontSize: '3rem' }}>{langEmoji[child.preferredLanguage] || '⭐'}</div>
                    <h4 className="fw-bold mt-2 mb-1" style={{ color: '#1a5276' }}>{child.aliasName}</h4>

                    {/* Badges */}
                    <div className="d-flex justify-content-center gap-2 flex-wrap mb-3">
                      <span className="badge rounded-pill px-3 py-2"
                        style={{ background: langColor[child.preferredLanguage] || '#1a5276' }}>
                        🌍 {child.preferredLanguage}
                      </span>
                      <span className="badge rounded-pill bg-secondary px-3 py-2">
                        📚 {child.gradeLevel}
                      </span>
                      {child.schoolName && (
                        <span className="badge rounded-pill bg-light text-dark px-3 py-2">
                          🏫 {child.schoolName}
                        </span>
                      )}
                    </div>

                    {/* Analytics Collapse */}
                    <div className="mb-3">
                      <button className="btn btn-outline-secondary btn-sm w-100"
                        data-bs-toggle="collapse"
                        data-bs-target={`#analytics-${child.id}`}>
                        <BarChart3 size={14} className="me-1" /> View Quick Stats
                      </button>
                      <div className="collapse mt-2" id={`analytics-${child.id}`}>
                        <div className="card card-body bg-light border-0 text-start small">
                          <div className="d-flex justify-content-between mb-1">
                            <span className="text-muted">Language</span>
                            <span className="fw-bold">{child.preferredLanguage}</span>
                          </div>
                          <div className="d-flex justify-content-between mb-1">
                            <span className="text-muted">Grade</span>
                            <span className="fw-bold">{child.gradeLevel}</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span className="text-muted">Joined</span>
                            <span className="fw-bold">{new Date(child.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button onClick={() => handleLearn(child)}
                      className="btn fw-bold w-100 text-white mb-2"
                      style={{ background: 'linear-gradient(135deg, #1a5276, #1e8449)', borderRadius: '10px' }}>
                      Start Learning →
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm w-100"
                      data-bs-toggle="modal"
                      data-bs-target={`#deleteModal-${child.id}`}>
                      Remove Profile
                    </button>
                  </div>
                </div>

                {/* Delete Confirmation Modal */}
                <div className="modal fade" id={`deleteModal-${child.id}`} tabIndex={-1}>
                  <div className="modal-dialog modal-dialog-centered modal-sm">
                    <div className="modal-content" style={{ borderRadius: '16px' }}>
                      <div className="modal-header border-0">
                        <h6 className="modal-title fw-bold text-danger">Remove Profile</h6>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                      </div>
                      <div className="modal-body text-center py-3">
                        <div style={{ fontSize: '2.5rem' }}>⚠️</div>
                        <p className="mt-2">Are you sure you want to remove <strong>{child.aliasName}</strong>'s profile?</p>
                      </div>
                      <div className="modal-footer border-0 justify-content-center gap-2">
                        <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button className="btn btn-danger fw-bold"
                          data-bs-dismiss="modal"
                          onClick={() => handleDeleteChild(child.id)}>
                          Yes, Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Tooltip Section */}
        <div className="mt-4 d-flex align-items-center gap-2">
          <span className="text-muted small">Why alias names?</span>
          <span
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="Dandaro uses alias names to protect your child's real identity in compliance with Zimbabwe's Data Protection Act 2021. No real names are ever stored."
            style={{ cursor: 'pointer' }}>
            🛡️
          </span>
        </div>
      </div>

      {/* Add Child Modal */}
      <div className="modal fade" id="addChildModal" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content" style={{ borderRadius: '20px' }}>
            <div className="modal-header border-0"
              style={{ background: 'linear-gradient(135deg, #1a5276, #1e8449)' }}>
              <h5 className="modal-title text-white fw-bold">👧 Add Child Profile</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body p-4">
              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2">
                  <span>⚠️</span><span>{error}</span>
                </div>
              )}
              <form onSubmit={handleAddChild} id="addChildForm">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Alias Name
                      <span className="ms-1" data-bs-toggle="tooltip"
                        title="Use a nickname, not your child's real name">ℹ️</span>
                    </label>
                    <input type="text" className="form-control" placeholder="e.g. Champ, Star"
                      value={childForm.aliasName}
                      onChange={e => setChildForm({ ...childForm, aliasName: e.target.value })}
                      required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">School Name (optional)</label>
                    <input type="text" className="form-control" placeholder="e.g. Harare Primary"
                      value={childForm.schoolName}
                      onChange={e => setChildForm({ ...childForm, schoolName: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Grade Level</label>
                    <select className="form-select" value={childForm.gradeLevel}
                      onChange={e => setChildForm({ ...childForm, gradeLevel: e.target.value })} required>
                      <option value="">Select grade...</option>
                      {['ECD', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7'].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Preferred Language</label>
                    <select className="form-select" value={childForm.preferredLanguage}
                      onChange={e => setChildForm({ ...childForm, preferredLanguage: e.target.value })} required>
                      <option value="">Select language...</option>
                      <option value="Shona">🦁 Shona</option>
                      <option value="Ndebele">🐘 Ndebele</option>
                      <option value="Tonga">🦒 Tonga</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer border-0">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="submit" form="addChildForm" disabled={loading}
                className="btn fw-bold text-white px-5"
                style={{ background: 'linear-gradient(135deg, #1a5276, #1e8449)' }}>
                {loading
                  ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>
                  : '✅ Save Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}