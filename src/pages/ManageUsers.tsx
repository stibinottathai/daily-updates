import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNews } from '../context/NewsContext';
import { supabase } from '../lib/supabase';
import { UserPlus, Shield, Mail, Lock, ShieldAlert } from 'lucide-react';
import { formatDate } from '../types';

interface Profile {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'sub_admin';
  created_at: string;
}

const ManageUsers = () => {
  const { user, isLoading, addToast } = useNews();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  
  // New user state
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'sub_admin'>('sub_admin');
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user.isAuthenticated || user.role !== 'super_admin')) {
      navigate('/admin');
    }
  }, [user, isLoading, navigate]);

  const fetchProfiles = async () => {
    setLoadingProfiles(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      addToast(`Error loading users: ${error.message}`, 'error');
    } else if (data) {
      setProfiles(data as Profile[]);
    }
    setLoadingProfiles(false);
  };

  useEffect(() => {
    if (user.role === 'super_admin') {
      fetchProfiles();
    }
  }, [user.role]);

  const updateRole = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);
      
    if (error) {
      addToast(`Failed to update role: ${error.message}`, 'error');
    } else {
      addToast('Role updated successfully.', 'success');
      fetchProfiles();
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: newEmail,
      password: newPassword,
    });

    if (error) {
      addToast(error.message, 'error');
      setCreateLoading(false);
      return;
    }

    if (data.user && newRole !== 'sub_admin') {
      await supabase.from('profiles').update({ role: newRole }).eq('id', data.user.id);
    }

    addToast(`User ${newEmail} created successfully!`, 'success');
    setNewEmail('');
    setNewPassword('');
    fetchProfiles();
    setCreateLoading(false);
  };

  if (isLoading || user.role !== 'super_admin') return null;

  return (
    <div className="animate-fade-in stagger-1">
      <div className="dashboard-header">
        <div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ShieldAlert size={36} color="var(--accent-gold)" /> Access Control
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage platform administrators and their permissions.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', alignItems: 'start' }}>
        
        {/* Create User Form */}
        <div style={{ background: 'var(--surface-color)', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <UserPlus size={24} color="var(--accent-gold)" /> Provision New Admin
          </h3>
          <form onSubmit={handleCreateUser} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', alignItems: 'end' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={14} /> Email Address</label>
              <input type="email" className="form-input" value={newEmail} onChange={e => setNewEmail(e.target.value)} required placeholder="editor@dailyupdates.com" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Lock size={14} /> Password</label>
              <input type="password" className="form-input" value={newPassword} onChange={e => setNewPassword(e.target.value)} required placeholder="••••••••" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Shield size={14} /> Access Level</label>
              <select className="form-input" value={newRole} onChange={e => setNewRole(e.target.value as any)}>
                <option value="admin">Editor (Admin)</option>
                <option value="sub_admin">Contributor (Sub Admin)</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ height: '45px' }} disabled={createLoading}>
              {createLoading ? 'Provisioning...' : 'Provision User'}
            </button>
          </form>
        </div>

        {/* Users Table */}
        <div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Active Administrators</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Identity</th>
                  <th>Permission Level</th>
                  <th>Granted</th>
                </tr>
              </thead>
              <tbody>
                {loadingProfiles ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>Fetching access records...</td>
                  </tr>
                ) : (
                  profiles.map(profile => (
                    <tr key={profile.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                            {profile.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600' }}>{profile.email}</div>
                            {profile.id === user.id && <span style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Current Session</span>}
                          </div>
                        </div>
                      </td>
                      <td>
                        <select 
                          className="form-input" 
                          style={{ padding: '0.5rem', width: 'auto', background: profile.id === user.id ? 'transparent' : 'var(--surface-color)', border: profile.id === user.id ? 'none' : '1px solid var(--border-color)' }}
                          value={profile.role}
                          onChange={(e) => updateRole(profile.id, e.target.value)}
                          disabled={profile.id === user.id}
                        >
                          <option value="super_admin">Super Administrator</option>
                          <option value="admin">Editor (Admin)</option>
                          <option value="sub_admin">Contributor (Sub Admin)</option>
                        </select>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{formatDate(profile.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;