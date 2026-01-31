/**
 * Organizer Dashboard
 * 
 * Full-featured dashboard for ORGANIZER role:
 * - Create new meetings
 * - View all created meetings
 * - Assign/remove participants
 * - Cancel/delete meetings
 */

import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { meetingApi, userApi, getErrorMessage } from '../services/api';
import { Meeting, User, CreateMeetingForm, MeetingStatus } from '../types';
import { format } from 'date-fns';

export const OrganizerDashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Create meeting form state
  const [formData, setFormData] = useState<CreateMeetingForm>({
    title: '',
    description: '',
    participantIds: [],
    startTime: '',
    endTime: '',
    location: '',
    meetingLink: '',
  });

  // Load meetings on mount
  useEffect(() => {
    loadMeetings();
    loadUsers();
  }, []);

  const loadMeetings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await meetingApi.getMeetings();
      setMeetings(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await userApi.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await meetingApi.createMeeting(formData);
      
      // Reset form and reload meetings
      setFormData({
        title: '',
        description: '',
        participantIds: [],
        startTime: '',
        endTime: '',
        location: '',
        meetingLink: '',
      });
      setShowCreateForm(false);
      loadMeetings();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleCancelMeeting = async (meetingId: string) => {
    if (!confirm('Are you sure you want to cancel this meeting?')) return;

    try {
      await meetingApi.cancelMeeting(meetingId);
      loadMeetings();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    if (!confirm('Are you sure you want to permanently delete this meeting?')) return;

    try {
      await meetingApi.deleteMeeting(meetingId);
      loadMeetings();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const toggleParticipant = (userId: string) => {
    setFormData((prev) => ({
      ...prev,
      participantIds: prev.participantIds.includes(userId)
        ? prev.participantIds.filter((id) => id !== userId)
        : [...prev.participantIds, userId],
    }));
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Organizer Dashboard</h1>
          <p style={styles.subtitle}>
            Welcome, {user?.firstName} {user?.lastName}
          </p>
        </div>
        <button onClick={logout} style={styles.logoutButton}>
          Logout
        </button>
      </header>

      {/* Error Message */}
      {error && <div style={styles.error}>{error}</div>}

      {/* Create Meeting Button */}
      <div style={styles.actions}>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={styles.primaryButton}
        >
          {showCreateForm ? 'Cancel' : '+ Create Meeting'}
        </button>
      </div>

      {/* Create Meeting Form */}
      {showCreateForm && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Create New Meeting</h2>
          <form onSubmit={handleCreateMeeting} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                style={{ ...styles.input, minHeight: '80px' }}
              />
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Start Time *</label>
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>End Time *</label>
                <input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Meeting Link</label>
              <input
                type="url"
                value={formData.meetingLink}
                onChange={(e) =>
                  setFormData({ ...formData, meetingLink: e.target.value })
                }
                style={styles.input}
                placeholder="https://zoom.us/..."
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Participants *</label>
              <div style={styles.participantList}>
                {users.map((u) => (
                  <label key={u._id} style={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={formData.participantIds.includes(u._id)}
                      onChange={() => toggleParticipant(u._id)}
                    />
                    <span>
                      {u.firstName} {u.lastName} ({u.email})
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" style={styles.primaryButton}>
              Create Meeting
            </button>
          </form>
        </div>
      )}

      {/* Meetings List */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Your Meetings ({meetings.length})</h2>

        {isLoading ? (
          <p>Loading meetings...</p>
        ) : meetings.length === 0 ? (
          <p style={styles.emptyState}>
            No meetings created yet. Click "Create Meeting" to get started.
          </p>
        ) : (
          <div style={styles.meetingList}>
            {meetings.map((meeting) => (
              <div key={meeting._id} style={styles.meetingCard}>
                <div style={styles.meetingHeader}>
                  <h3 style={styles.meetingTitle}>{meeting.title}</h3>
                  <span
                    style={{
                      ...styles.badge,
                      ...(meeting.status === MeetingStatus.CANCELLED
                        ? styles.badgeCancelled
                        : {}),
                    }}
                  >
                    {meeting.status}
                  </span>
                </div>

                <p style={styles.meetingDescription}>{meeting.description}</p>

                <div style={styles.meetingDetails}>
                  <div>
                    <strong>Start:</strong>{' '}
                    {format(new Date(meeting.startTime), 'MMM dd, yyyy h:mm a')}
                  </div>
                  <div>
                    <strong>End:</strong>{' '}
                    {format(new Date(meeting.endTime), 'MMM dd, yyyy h:mm a')}
                  </div>
                  <div>
                    <strong>Duration:</strong> {meeting.duration} minutes
                  </div>
                  {meeting.location && (
                    <div>
                      <strong>Location:</strong> {meeting.location}
                    </div>
                  )}
                </div>

                <div style={styles.participants}>
                  <strong>Participants ({meeting.participants.length}):</strong>
                  {meeting.participants.map((p) => (
                    <span key={p._id} style={styles.participantBadge}>
                      {p.firstName} {p.lastName}
                    </span>
                  ))}
                </div>

                <div style={styles.meetingActions}>
                  {meeting.status === MeetingStatus.SCHEDULED && (
                    <button
                      onClick={() => handleCancelMeeting(meeting._id)}
                      style={styles.cancelButton}
                    >
                      Cancel Meeting
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteMeeting(meeting._id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Inline styles (replace with CSS modules in production)
const styles = {
  container: { padding: '20px', maxWidth: '1200px', margin: '0 auto' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  title: { fontSize: '28px', fontWeight: 'bold', color: '#333', margin: 0 },
  subtitle: { fontSize: '14px', color: '#666', marginTop: '4px' },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  actions: { marginBottom: '20px' },
  primaryButton: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  card: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  cardTitle: { fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column' as const, gap: '16px' },
  formGroup: { display: 'flex', flexDirection: 'column' as const, gap: '6px' },
  label: { fontSize: '14px', fontWeight: '500', color: '#333' },
  input: {
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' },
  participantList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    maxHeight: '200px',
    overflowY: 'auto' as const,
    border: '1px solid #ddd',
    padding: '12px',
    borderRadius: '4px',
  },
  checkbox: { display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer' },
  emptyState: { textAlign: 'center' as const, color: '#666', padding: '40px' },
  meetingList: { display: 'flex', flexDirection: 'column' as const, gap: '16px' },
  meetingCard: {
    border: '1px solid #ddd',
    padding: '16px',
    borderRadius: '6px',
    backgroundColor: '#fafafa',
  },
  meetingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  meetingTitle: { fontSize: '18px', fontWeight: 'bold', margin: 0 },
  badge: {
    padding: '4px 12px',
    backgroundColor: '#28a745',
    color: 'white',
    borderRadius: '12px',
    fontSize: '12px',
  },
  badgeCancelled: { backgroundColor: '#dc3545' },
  meetingDescription: { color: '#666', marginBottom: '12px' },
  meetingDetails: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    fontSize: '14px',
    marginBottom: '12px',
  },
  participants: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
    alignItems: 'center',
    marginBottom: '12px',
  },
  participantBadge: {
    padding: '4px 8px',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '4px',
    fontSize: '12px',
  },
  meetingActions: { display: 'flex', gap: '8px' },
  cancelButton: {
    padding: '8px 16px',
    backgroundColor: '#ffc107',
    color: '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
