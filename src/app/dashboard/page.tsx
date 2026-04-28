'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [children, setChildren] = useState<any[]>([]);
  const [showAddChild, setShowAddChild] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [childForm, setChildForm] = useState({
    aliasName: '',
    gradeLevel: '',
    preferredLanguage: '',
    schoolName: '',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('dandaro_user');
    const token = localStorage.getItem('dandaro_token');
    if (!storedUser || !token) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
    setChildren(JSON.parse(storedUser).children || []);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('dandaro_token');
    localStorage.removeItem('dandaro_user');
    router.push('/login');
  };

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('dandaro_token');
      const res = await fetch('/api/children', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(childForm),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to add child');
        return;
      }

      // Update local state
      const newChildren = [...children, data.child];
      setChildren(newChildren);

      // Update localStorage
      const updatedUser = { ...user, children: newChildren };
      localStorage.setItem('dandaro_user', JSON.stringify(updatedUser));

      setSuccess(`${data.child.aliasName}'s profile created successfully!`);
      setShowAddChild(false);
      setChildForm({ aliasName: '', gradeLevel: '', preferredLanguage: '', schoolName: '' });

    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLearn = (child: any) => {
    localStorage.setItem('dandaro_active_child', JSON.stringify(child));
    router.push('/learn');
  };

  if (!user) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f8' }}>
      <p style={{ color: '#666', fontSize: '1.1em' }}>Loading...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial, sans-serif' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a5276, #1e8449)',
        padding: '20px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <h1 style={{ color: 'white', margin: 0, fontSize: '1.8em', fontWeight: 'bold' }}>
            🌍 Dandaro
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', margin: '4px 0 0', fontSize: '0.9em' }}>
            Welcome back, {user.name}
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.4)',
            borderRadius: '8px',
            padding: '8px 20px',
            cursor: 'pointer',
            fontSize: '0.9em',
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px' }}>

        {/* Success / Error Messages */}
        {success && (
          <div style={{
            background: '#eafaf1', border: '1px solid #a9dfbf',
            borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#1e8449',
          }}>
            ✅ {success}
          </div>
        )}
        {error && (
          <div style={{
            background: '#fdecea', border: '1px solid #f5c6cb',
            borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#c0392b',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Children Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#1a5276', margin: 0, fontSize: '1.4em' }}>
            👧 Child Profiles ({children.length})
          </h2>
          <button
            onClick={() => setShowAddChild(!showAddChild)}
            style={{
              background: 'linear-gradient(135deg, #1a5276, #1e8449)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.95em',
            }}
          >
            + Add Child Profile
          </button>
        </div>

        {/* Add Child Form */}
        {showAddChild && (
          <div style={{
            background: 'white', borderRadius: '12px',
            padding: '28px', marginBottom: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '2px solid #1a5276',
          }}>
            <h3 style={{ color: '#1a5276', marginTop: 0, marginBottom: '20px' }}>
              Add a Child Profile
            </h3>
            <form onSubmit={handleAddChild}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                {/* Alias Name */}
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333', fontSize: '0.9em' }}>
                    Alias Name (not real name)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Champ, Star, Braveheart"
                    value={childForm.aliasName}
                    onChange={e => setChildForm({ ...childForm, aliasName: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '0.95em', boxSizing: 'border-box' }}
                  />
                </div>

                {/* School Name */}
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333', fontSize: '0.9em' }}>
                    School Name (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Harare Primary School"
                    value={childForm.schoolName}
                    onChange={e => setChildForm({ ...childForm, schoolName: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '0.95em', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Grade Level */}
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333', fontSize: '0.9em' }}>
                    Grade Level
                  </label>
                  <select
                    value={childForm.gradeLevel}
                    onChange={e => setChildForm({ ...childForm, gradeLevel: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '0.95em', boxSizing: 'border-box' }}
                  >
                    <option value="">Select grade...</option>
                    <option value="ECD">ECD (Early Childhood)</option>
                    <option value="Grade 1">Grade 1</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                    <option value="Grade 6">Grade 6</option>
                    <option value="Grade 7">Grade 7</option>
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333', fontSize: '0.9em' }}>
                    Preferred Language
                  </label>
                  <select
                    value={childForm.preferredLanguage}
                    onChange={e => setChildForm({ ...childForm, preferredLanguage: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '0.95em', boxSizing: 'border-box' }}
                  >
                    <option value="">Select language...</option>
<option value="Shona">Shona</option>
<option value="Ndebele">Ndebele</option>
<option value="Tonga">Tonga</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '10px 28px',
                    background: loading ? '#95a5a6' : 'linear-gradient(135deg, #1a5276, #1e8449)',
                    color: 'white', border: 'none', borderRadius: '8px',
                    fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.95em',
                  }}
                >
                  {loading ? 'Saving...' : 'Save Child Profile'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddChild(false)}
                  style={{
                    padding: '10px 28px', background: '#ecf0f1',
                    color: '#333', border: 'none', borderRadius: '8px',
                    cursor: 'pointer', fontSize: '0.95em',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Children Cards */}
        {children.length === 0 ? (
          <div style={{
            background: 'white', borderRadius: '12px', padding: '48px',
            textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          }}>
            <p style={{ fontSize: '3em', margin: '0 0 16px' }}>👧</p>
            <h3 style={{ color: '#1a5276', marginBottom: '8px' }}>No child profiles yet</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Add your first child profile to get started with Dandaro
            </p>
            <button
              onClick={() => setShowAddChild(true)}
              style={{
                background: 'linear-gradient(135deg, #1a5276, #1e8449)',
                color: 'white', border: 'none', borderRadius: '8px',
                padding: '12px 28px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1em',
              }}
            >
              + Add First Child
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {children.map((child: any) => (
              <div key={child.id} style={{
                background: 'white', borderRadius: '12px', padding: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '2px solid #eaf4fb',
              }}>
                <div style={{ fontSize: '2.5em', marginBottom: '12px', textAlign: 'center' }}>
                  {child.preferredLanguage === 'Shona' ? '🦁' :
                   child.preferredLanguage === 'Ndebele' ? '🐘' :
                   child.preferredLanguage === 'Tonga' ? '🦒' : '⭐'}
                </div>
                <h3 style={{ color: '#1a5276', margin: '0 0 8px', textAlign: 'center' }}>
                  {child.aliasName}
                </h3>
                <div style={{ color: '#666', fontSize: '0.9em', marginBottom: '16px', textAlign: 'center' }}>
                  <p style={{ margin: '4px 0' }}>📚 {child.gradeLevel}</p>
                  <p style={{ margin: '4px 0' }}>🌍 {child.preferredLanguage}</p>
                  {child.schoolName && <p style={{ margin: '4px 0' }}>🏫 {child.schoolName}</p>}
                </div>
                <button
                  onClick={() => handleLearn(child)}
                  style={{
                    width: '100%', padding: '10px',
                    background: 'linear-gradient(135deg, #1a5276, #1e8449)',
                    color: 'white', border: 'none', borderRadius: '8px',
                    cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95em',
                  }}
                >
                  Start Learning →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}