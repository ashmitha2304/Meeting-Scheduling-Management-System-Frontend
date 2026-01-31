/**
 * Participant Dashboard
 * 
 * View-only dashboard for PARTICIPANT role:
 * - View assigned meetings
 * - Filter by status
 * - See meeting details
 */

import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { meetingApi, getErrorMessage } from '../services/api';
import { Meeting, MeetingStatus } from '../types';
import { format } from 'date-fns';

export const ParticipantDashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<MeetingStatus | 'ALL'>('ALL');

  useEffect(() => {
    loadMyMeetings();
  }, [statusFilter]);

  const loadMyMeetings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const filters = statusFilter !== 'ALL' ? { status: statusFilter } : undefined;
      const data = await meetingApi.getMyMeetings(filters);
      setMeetings(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMeetings = meetings;

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>My Meetings</h1>
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

      {/* Filters */}
      <div style={styles.filters}>
        <label style={styles.filterLabel}>Filter by status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as MeetingStatus | 'ALL')}
          style={styles.select}
        >
          <option value="ALL">All Meetings</option>
          <option value={MeetingStatus.SCHEDULED}>Scheduled</option>
          <option value={MeetingStatus.COMPLETED}>Completed</option>
          <option value={MeetingStatus.CANCELLED}>Cancelled</option>
        </select>
      </div>

      {/* Meetings List */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>
          Your Meetings ({filteredMeetings.length})
        </h2>

        {isLoading ? (
          <p>Loading meetings...</p>
        ) : filteredMeetings.length === 0 ? (
          <p style={styles.emptyState}>
            {statusFilter === 'ALL'
              ? 'You have not been assigned to any meetings yet.'
              : `No ${statusFilter.toLowerCase()} meetings found.`}
          </p>
        ) : (
          <div style={styles.meetingList}>
            {filteredMeetings.map((meeting) => (
              <div key={meeting._id} style={styles.meetingCard}>
                <div style={styles.meetingHeader}>
                  <h3 style={styles.meetingTitle}>{meeting.title}</h3>
                  <span
                    style={{
                      ...styles.badge,
                      ...(meeting.status === MeetingStatus.CANCELLED
                        ? styles.badgeCancelled
                        : meeting.status === MeetingStatus.COMPLETED
                        ? styles.badgeCompleted
                        : {}),
                    }}
                  >
                    {meeting.status}
                  </span>
                </div>

                {meeting.description && (
                  <p style={styles.meetingDescription}>{meeting.description}</p>
                )}

                <div style={styles.meetingDetails}>
                  <div>
                    <strong>Organizer:</strong> {meeting.organizer.firstName}{' '}
                    {meeting.organizer.lastName} ({meeting.organizer.email})
                  </div>
                  <div>
                    <strong>Start:</strong>{' '}
                    {format(new Date(meeting.startTime), 'EEEE, MMM dd, yyyy h:mm a')}
                  </div>
                  <div>
                    <strong>End:</strong>{' '}
                    {format(new Date(meeting.endTime), 'h:mm a')}
                  </div>
                  <div>
                    <strong>Duration:</strong> {meeting.duration} minutes
                  </div>
                  {meeting.location && (
                    <div>
                      <strong>Location:</strong> {meeting.location}
                    </div>
                  )}
                  {meeting.meetingLink && (
                    <div>
                      <strong>Link:</strong>{' '}
                      <a
                        href={meeting.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.link}
                      >
                        Join Meeting
                      </a>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Inline styles
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
  filters: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    padding: '16px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  filterLabel: { fontSize: '14px', fontWeight: '500', color: '#333' },
  select: {
    padding: '8px 12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  card: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  cardTitle: { fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' },
  emptyState: { textAlign: 'center' as const, color: '#666', padding: '40px' },
  meetingList: { display: 'flex', flexDirection: 'column' as const, gap: '16px' },
  meetingCard: {
    border: '1px solid #ddd',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#fafafa',
  },
  meetingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  meetingTitle: { fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#333' },
  badge: {
    padding: '6px 12px',
    backgroundColor: '#28a745',
    color: 'white',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
  },
  badgeCancelled: { backgroundColor: '#dc3545' },
  badgeCompleted: { backgroundColor: '#6c757d' },
  meetingDescription: { color: '#666', marginBottom: '16px', lineHeight: '1.5' },
  meetingDetails: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    fontSize: '14px',
    marginBottom: '16px',
    color: '#333',
  },
  link: { color: '#007bff', textDecoration: 'underline' },
  participants: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
    alignItems: 'center',
  },
  participantBadge: {
    padding: '6px 12px',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '4px',
    fontSize: '12px',
  },
};
