import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNews } from '../context/NewsContext';
import { supabase } from '../lib/supabase';
import { UserPlus, ShieldAlert, Check } from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'sub_admin';
  created_at: string;
}

const ManageUsers = () => {
  const { user, isLoading } = useNews();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  
  // New user state
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'sub_admin'>('sub_admin');
  const [createLoading, setCreateLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isLoading && (!user.isAuthenticated || user.role !== 'super_admin')) {
      navigate('/admin'); // Kick them out if not super admin
    }
  }, [user, isLoading, navigate]);

  const fetchProfiles = async () => {
    setLoadingProfiles(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!error && data) {
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
    setSuccessMsg('');
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);
      
    if (!error) {
      setSuccessMsg('Role updated successfully.');
      fetchProfiles();
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    // Sign up the new user
    const { data, error } = await supabase.auth.signUp({
      email: newEmail,
      password: newPassword,
    });

    if (error) {
      setErrorMsg(error.message);
      setCreateLoading(false);
      return;
    }

    // Since our trigger might set them to sub_admin by default, update their role if needed
    if (data.user && newRole !== 'sub_admin') {
      await supabase.from('profiles').update({ role: newRole }).eq('id', data.user.id);
    }

    setSuccessMsg(`User ${newEmail} created successfully!`);
    setNewEmail('');
    setNewPassword('');
    fetchProfiles();
    setCreateLoading(false);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  if (isLoading || user.role !== 'super_admin') return null;

  return (
    <div>
      <div className="admin-header">
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert className="text-primary" /> Super Admin Control Panel
          </h2>
          <p style={{ color: 'var(--muted)' }}>Create and manage admins and sub-admins across the system.</p>
        </div>
      </div>

      {successMsg && (
        <div style={{ padding: '1rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '0.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Check size={18} /> {successMsg}
        </div>
      )}

      {errorMsg && (
        <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '0.5rem', marginBottom: '2rem' }}>
          {errorMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
        {/* Create User Form */}
        <div style={{ background: 'var(--card)', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <UserPlus size={20} /> Add New User
          </h3>
          <form onSubmit={handleCreateUser}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-input" value={newEmail} onChange={e => setNewEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" className="form-input" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-input" value={newRole} onChange={e => setNewRole(e.target.value as any)}>
                <option value="admin">Admin</option>
                <option value="sub_admin">Sub Admin</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={createLoading}>
              {createLoading ? 'Creating...' : 'Create User'}
            </button>
          </form>
        </div>

        {/* Users Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {loadingProfiles ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', color: 'var(--muted)' }}>Loading users...</td>
                </tr>
              ) : (
                profiles.map(profile => (
                  <tr key={profile.id}>
                    <td style={{ fontWeight: '500' }}>
                      {profile.email} {profile.id === user.id && <span style={{ fontSize: '0.75rem', background: 'var(--primary)', color: 'white', padding: '0.1rem 0.4rem', borderRadius: '1rem', marginLeft: '0.5rem' }}>You</span>}
                    </td>
                    <td>
                      <select 
                        className="form-input" 
                        style={{ padding: '0.25rem', width: 'auto' }}
                        value={profile.role}
                        onChange={(e) => updateRole(profile.id, e.target.value)}
                        disabled={profile.id === user.id} // Don't let super admin change their own role accidentally
                      >
                        <option value="super_admin">Super Admin</option>
                        <option value="admin">Admin</option>
                        <option value="sub_admin">Sub Admin</option>
                      </select>
                    </td>
                    <td>{new Date(profile.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;