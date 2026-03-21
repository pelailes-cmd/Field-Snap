import React, { useState, useEffect } from 'react';
import { useStorage, type ScheduleEvent, type TaskStatus } from '../context/StorageContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Calendar, Clock, Trash2, CheckCircle2, Circle, PlayCircle, XCircle, LayoutList } from 'lucide-react';

export const SchedulePage: React.FC = () => {
  const { saveSchedule, getSchedules, deleteSchedule } = useStorage();
  const [schedules, setSchedules] = useState<ScheduleEvent[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState({
    subject: '',
    notes: '',
    details: '',
    dateTime: '',
    status: 'Pending' as TaskStatus
  });

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    const data = await getSchedules();
    setSchedules(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.dateTime) return;

    await saveSchedule({
      id: crypto.randomUUID(),
      subject: formData.subject,
      notes: formData.notes,
      details: formData.details,
      dateTime: formData.dateTime,
      status: formData.status
    });

    setFormData({ subject: '', notes: '', details: '', dateTime: '', status: 'Pending' });
    setIsAdding(false);
    loadSchedules();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this task?')) {
      await deleteSchedule(id);
      loadSchedules();
    }
  };

  const updateStatus = async (event: ScheduleEvent, newStatus: TaskStatus) => {
    await saveSchedule({ ...event, status: newStatus });
    loadSchedules();
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'Completed': return <CheckCircle2 size={20} color="var(--success)" />;
      case 'On-going': return <PlayCircle size={20} color="var(--primary)" />;
      case 'Cancelled': return <XCircle size={20} color="var(--danger)" />;
      default: return <Circle size={20} color="#666" />;
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Completed': return 'var(--success)';
      case 'On-going': return 'var(--primary)';
      case 'Cancelled': return 'var(--danger)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '120px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', marginTop: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Schedule</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Site Tasks & Inspections</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          style={{ 
            background: isAdding ? 'var(--danger)' : 'var(--primary)', 
            border: 'none', borderRadius: '12px', color: 'white', padding: '0.75rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold'
          }}
        >
          {isAdding ? <XCircle size={20} /> : <><LayoutList size={20} /> Add Task</>}
        </button>
      </header>

      {isAdding && (
        <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '2rem', border: '2px solid var(--primary)', animation: 'tabFadeIn 0.3s ease' }}>
          <h3 style={{ marginBottom: '1.25rem' }}>Create New Task</h3>
          <Input 
            label="Subject / Task Name" 
            placeholder="e.g. Electrical Rough-in Check" 
            value={formData.subject} 
            onChange={e => setFormData({...formData, subject: e.target.value})} 
            required
          />
          <div className="input-group">
            <label className="input-label">Scheduled Date & Time</label>
            <input 
              type="datetime-local" 
              className="input-field" 
              value={formData.dateTime}
              onChange={e => setFormData({...formData, dateTime: e.target.value})}
              required
            />
          </div>
          <div className="input-group">
            <label className="input-label">Initial Status</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {(['Pending', 'On-going', 'Completed', 'Cancelled'] as TaskStatus[]).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFormData({...formData, status: s})}
                  style={{ 
                    padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)',
                    background: formData.status === s ? 'var(--primary)' : 'var(--surface)',
                    color: formData.status === s ? 'white' : 'var(--text)',
                    fontSize: '0.8rem', cursor: 'pointer'
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <Input 
            label="Short Note" 
            placeholder="Quick reminder..." 
            value={formData.notes} 
            onChange={e => setFormData({...formData, notes: e.target.value})} 
          />
          <div className="input-group">
            <label className="input-label">Detailed Description</label>
            <textarea 
              className="input-field" 
              style={{ minHeight: '80px', resize: 'none', fontFamily: 'inherit' }}
              placeholder="List specific items to check or detailed instructions..."
              value={formData.details}
              onChange={e => setFormData({...formData, details: e.target.value})}
            />
          </div>
          <Button type="submit" style={{ height: '56px', borderRadius: '16px' }}>Save Task to Schedule</Button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {schedules.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', opacity: 0.5 }}>
            <Calendar size={64} style={{ marginBottom: '1rem' }} />
            <p>No tasks scheduled</p>
          </div>
        ) : (
          schedules.map(event => (
            <div 
              key={event.id} 
              className="card" 
              style={{ 
                padding: '1rem', borderLeft: `6px solid ${getStatusColor(event.status)}`,
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {getStatusIcon(event.status)}
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{event.subject}</h3>
                  </div>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={14} /> {new Date(event.dateTime).toLocaleDateString()}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={14} /> {new Date(event.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span style={{ fontWeight: 'bold', color: getStatusColor(event.status) }}>
                      • {event.status}
                    </span>
                  </div>
                  
                  {event.notes && (
                    <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text)', fontWeight: '500' }}>
                      {event.notes}
                    </p>
                  )}

                  {event.details && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.03)', padding: '0.75rem', borderRadius: '8px', border: '1px dashed var(--border)' }}>
                      {event.details}
                    </div>
                  )}

                  {/* Status Quick-Switch */}
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '1rem' }}>
                    {(['On-going', 'Completed', 'Cancelled'] as TaskStatus[]).map(s => (
                      s !== event.status && (
                        <button
                          key={s}
                          onClick={() => updateStatus(event, s)}
                          style={{ 
                            fontSize: '0.7rem', padding: '0.3rem 0.6rem', borderRadius: '6px', 
                            background: 'none', border: `1px solid ${getStatusColor(s)}`, 
                            color: getStatusColor(s), cursor: 'pointer'
                          }}
                        >
                          Mark {s}
                        </button>
                      )
                    ))}
                  </div>
                </div>
                
                <button 
                  onClick={() => handleDelete(event.id)}
                  style={{ background: 'none', border: 'none', padding: '0.5rem', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
