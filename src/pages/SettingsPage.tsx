import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Trash2, SortAsc, LayoutGrid, LayoutList, LogOut, Info, Send, ShieldCheck, HardHat } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { deleteAccount, logout } = useAuth();
  const [viewType, setViewType] = useState<'grid' | 'list'>(
    localStorage.getItem('fieldsnap_view_type') as any || 'grid'
  );
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>(
    localStorage.getItem('fieldsnap_sort_order') as any || 'newest'
  );

  // About form states
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleViewChange = (type: 'grid' | 'list') => {
    setViewType(type);
    localStorage.setItem('fieldsnap_view_type', type);
  };

  const handleSortChange = (order: 'newest' | 'oldest') => {
    setSortOrder(order);
    localStorage.setItem('fieldsnap_sort_order', order);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? All your data will be permanently removed.')) {
      deleteAccount();
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    const email = "afhinzz.ailes@gmail.com";
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject || 'FieldSnap Feedback')}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoUrl;
    setSubject('');
    setMessage('');
    alert('Opening your email app...');
  };

  return (
    <div className="container" style={{ paddingBottom: '120px' }}>
      <header style={{ marginBottom: '1.5rem', marginTop: '1rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>App preferences and account</p>
      </header>

      {/* Appearance Section */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LayoutGrid size={20} /> Appearance
        </h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => handleViewChange('grid')} style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: viewType === 'grid' ? 'var(--primary)' : 'var(--surface)', color: viewType === 'grid' ? 'white' : 'var(--text)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <LayoutGrid size={24} /> Grid View
          </button>
          <button onClick={() => handleViewChange('list')} style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: viewType === 'list' ? 'var(--primary)' : 'var(--surface)', color: viewType === 'list' ? 'white' : 'var(--text)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <LayoutList size={24} /> List View
          </button>
        </div>
      </div>

      {/* Sorting Section */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SortAsc size={20} /> Sorting
        </h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => handleSortChange('newest')} style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border)', background: sortOrder === 'newest' ? 'var(--primary)' : 'var(--surface)', color: sortOrder === 'newest' ? 'white' : 'var(--text)' }}>Newest First</button>
          <button onClick={() => handleSortChange('oldest')} style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border)', background: sortOrder === 'oldest' ? 'var(--primary)' : 'var(--surface)', color: sortOrder === 'oldest' ? 'white' : 'var(--text)' }}>Oldest First</button>
        </div>
      </div>

      {/* NEW: About Section integrated into Settings */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Info size={20} /> About FieldSnap
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          FieldSnap is a professional site documentation tool designed for engineers and site inspectors. Version 1.0.0.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ background: 'rgba(0, 123, 255, 0.1)', padding: '0.5rem', borderRadius: '8px' }}><ShieldCheck size={20} color="var(--primary)" /></div>
            <div><p style={{ fontWeight: '600', fontSize: '0.9rem' }}>Secure & Private</p><p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>All data stored locally.</p></div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ background: 'rgba(40, 167, 69, 0.1)', padding: '0.5rem', borderRadius: '8px' }}><HardHat size={20} color="var(--success)" /></div>
            <div><p style={{ fontWeight: '600', fontSize: '0.9rem' }}>Professional</p><p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Standard inspection reports.</p></div>
          </div>
        </div>

        <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Contact Creator</h4>
        <form onSubmit={handleSendMessage}>
          <input type="text" placeholder="Subject" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)', marginBottom: '0.75rem' }} value={subject} onChange={(e) => setSubject(e.target.value)} />
          <textarea placeholder="Message or bug report..." rows={3} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--background)', color: 'var(--text)', marginBottom: '1rem', resize: 'none', fontFamily: 'inherit' }} required value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
          <Button type="submit"><Send size={18} style={{ marginRight: '0.5rem' }} /> Send Message</Button>
        </form>
      </div>

      {/* Account Section */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           Account
        </h3>
        <button onClick={logout} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem', cursor: 'pointer' }}>
          <LogOut size={20} /> Log Out
        </button>
        <button onClick={handleDeleteAccount} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(220, 53, 69, 0.2)', background: 'rgba(220, 53, 69, 0.1)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <Trash2 size={20} /> Delete Account
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        <p>Publisher: <strong>Engr. Ailes</strong></p>
        <p>© 2026 FieldSnap Systems</p>
      </div>
    </div>
  );
};
