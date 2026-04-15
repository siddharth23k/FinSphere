import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/api';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    gender: user?.gender || '',
    phoneNumber: user?.phoneNumber || '',
    panNumber: user?.panNumber || '',
    riskAppetite: user?.riskAppetite || 'Medium',
    experienceLevel: user?.experienceLevel || 'Beginner',
  });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
virtual
  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await updateProfile(form);
      updateUser(res.data);
      setMsg('✓ Profile updated successfully!');
    } catch (e) {
      setMsg('✗ Failed to update profile');
    }
    setLoading(false);
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="page-layout">
      <Navbar />
      <main className="main-content fade-in">
        <div className="page-header">
          <h1>Profile</h1>
          <p>Manage your account and investment preferences.</p>
        </div>

        <div className="profile-layout">
          {/* Avatar Card */}
          <div className="card profile-avatar-card">
            <div className="big-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <h2>{user?.name}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{user?.email}</p>
            <div className="profile-badges">
              <span className="tag tag-gold">{user?.experienceLevel || 'Beginner'}</span>
              <span className="tag tag-green">{user?.riskAppetite || 'Medium'} Risk</span>
            </div>
            <div className="profile-balance-display">
              <span>Virtual Balance</span>
              <strong>₹{Number(user?.virtualBalance || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}</strong>
            </div>
          </div>

          {/* Edit Form */}
          <div className="card profile-form-card">
            <h3 style={{ marginBottom: '24px' }}>Edit Profile</h3>

            <div className="profile-form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input className="input" name="name" value={form.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input className="input" value={user?.email} disabled style={{ opacity: 0.5 }} />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select className="input" name="gender" value={form.gender} onChange={handleChange}>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input className="input" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="+91 XXXXXXXXXX" />
              </div>
              <div className="form-group">
                <label>PAN Number</label>
                <input className="input" name="panNumber" value={form.panNumber} onChange={handleChange} placeholder="ABCDE1234F" />
              </div>
            </div>

            <div className="risk-experience-row">
              <div className="form-group">
                <label>Risk Appetite</label>
                <div className="toggle-group">
                  {['Low', 'Medium', 'High'].map((r) => (
                    <button
                      key={r}
                      className={`toggle-btn ${form.riskAppetite === r ? 'active' : ''}`}
                      onClick={() => setForm({ ...form, riskAppetite: r })}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Experience Level</label>
                <div className="toggle-group">
                  {['Beginner', 'Intermediate', 'Advanced'].map((e) => (
                    <button
                      key={e}
                      className={`toggle-btn ${form.experienceLevel === e ? 'active' : ''}`}
                      onClick={() => setForm({ ...form, experienceLevel: e })}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {msg && (
              <div className={`save-msg ${msg.startsWith('✓') ? 'success' : 'error'}`}>{msg}</div>
            )}

            <button className="btn btn-primary" style={{ marginTop: '8px' }} onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;