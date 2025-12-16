// admin-panel/src/pages/Appointments.jsx
import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './styles/Patients.css'; // Shared styles

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalAppointments: 0,
    hasNext: false,
    hasPrev: false
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    declined: 0,
    expired: 0,
    completed: 0
  });

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage, statusFilter]);

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeout = setTimeout(() => {
      if (pagination.currentPage !== 1) {
        setPagination(prev => ({ ...prev, currentPage: 1 }));
      } else {
        fetchAppointments();
      }
    }, 500);
    
    setSearchTimeout(timeout);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: 10,
        search: search.trim(),
        status: statusFilter !== 'all' ? statusFilter : undefined
      };
      
      const response = await adminAPI.getAppointments(params);
      
      if (response.success) {
        setAppointments(response.data.appointments);
        setPagination(response.data.pagination);
        if (response.data.stats) {
          setStats(response.data.stats);
        }
        setError('');
      } else {
        setError(response.message || 'Failed to fetch appointments');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const openDetailsModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const openStatusModal = (appointment, status) => {
    setSelectedAppointment(appointment);
    setNewStatus(status);
    setShowStatusModal(true);
  };

  const openDeleteModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDeleteModal(true);
  };

  const closeModals = () => {
    setShowDetailsModal(false);
    setShowStatusModal(false);
    setShowDeleteModal(false);
    setSelectedAppointment(null);
    setNewStatus('');
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedAppointment || !newStatus) return;

    try {
      setActionLoading(selectedAppointment._id);
      setShowStatusModal(false);
      
      const response = await adminAPI.updateAppointmentStatus(
        selectedAppointment._id,
        newStatus
      );
      
      if (response.success) {
        fetchAppointments();
      } else {
        setError(response.message || 'Failed to update status');
      }
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setActionLoading(null);
      setSelectedAppointment(null);
      setNewStatus('');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedAppointment) return;

    try {
      setActionLoading(selectedAppointment._id);
      setShowDeleteModal(false);
      
      const response = await adminAPI.deleteAppointment(selectedAppointment._id);
      
      if (response.success) {
        fetchAppointments();
      } else {
        setError(response.message || 'Failed to delete appointment');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete appointment');
    } finally {
      setActionLoading(null);
      setSelectedAppointment(null);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'warning', icon: 'clock' },
      approved: { color: 'success', icon: 'check' },
      declined: { color: 'danger', icon: 'x' },
      expired: { color: 'gray', icon: 'alert' },
      completed: { color: 'info', icon: 'check-circle' },
      cancelled: { color: 'danger', icon: 'x-circle' }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`status-badge ${config.color}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading && appointments.length === 0) {
    return <LoadingSpinner text="Loading appointments..." />;
  }

  return (
    <>
      <div className="appointments-page">
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">Appointments Management</h1>
            <p className="page-subtitle">
              View and manage all appointments ({pagination.totalAppointments} total)
            </p>
          </div>
          <button onClick={fetchAppointments} className="refresh-button" title="Refresh data">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon total">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div className="stat-details">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div className="stat-details">
              <span className="stat-value">{stats.pending}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon verified">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div className="stat-details">
              <span className="stat-value">{stats.approved}</span>
              <span className="stat-label">Approved</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon rejected">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <div className="stat-details">
              <span className="stat-value">{stats.declined}</span>
              <span className="stat-label">Declined</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon completed">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div className="stat-details">
              <span className="stat-value">{stats.completed}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon expired">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div className="stat-details">
              <span className="stat-value">{stats.expired}</span>
              <span className="stat-label">Expired</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-alert">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
            <button onClick={() => setError('')} className="error-close">×</button>
          </div>
        )}

        <div className="table-controls">
          <div className="search-container">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Search by patient or doctor name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-container">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="declined">Declined</option>
              <option value="completed">Completed</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <tr key={appointment._id} className="table-row">
                    <td className="patient-info">
                      <div className="user-avatar">
                        {appointment.patient?.name?.charAt(0).toUpperCase() || 'P'}
                      </div>
                      <div className="user-details">
                        <span className="user-name">{appointment.patient?.name || 'Unknown'}</span>
                        <span className="user-email">{appointment.patient?.email || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="doctor-info">
                      <div className="user-avatar">
                        {appointment.doctor?.name?.charAt(0).toUpperCase() || 'D'}
                      </div>
                      <div className="user-details">
                        <span className="user-name">Dr. {appointment.doctor?.name || 'Unknown'}</span>
                        <span className="user-email">{appointment.doctor?.email || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="appointment-datetime">
                      <div className="datetime-info">
                        <span className="date">{formatDate(appointment.appointmentDate)}</span>
                        <span className="time">{appointment.timeSlot}</span>
                      </div>
                    </td>
                    <td className="fee">
                      <span className="fee-amount">₨{appointment.consultationFee}</span>
                    </td>
                    <td>
                      {getStatusBadge(appointment.status)}
                    </td>
                    <td className="created-date">{formatDateTime(appointment.createdAt)}</td>
                    <td className="actions">
                      <div className="action-buttons">
                        <button
                          onClick={() => openDetailsModal(appointment)}
                          className="action-btn view"
                          title="View details"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        </button>

                        {appointment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => openStatusModal(appointment, 'approved')}
                              disabled={actionLoading === appointment._id}
                              className="action-btn activate"
                              title="Approve appointment"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </button>

                            <button
                              onClick={() => openStatusModal(appointment, 'declined')}
                              disabled={actionLoading === appointment._id}
                              className="action-btn deactivate"
                              title="Decline appointment"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          </>
                        )}

                        {appointment.status === 'approved' && (
                          <button
                            onClick={() => openStatusModal(appointment, 'completed')}
                            disabled={actionLoading === appointment._id}
                            className="action-btn activate"
                            title="Mark as completed"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                              <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                          </button>
                        )}

                        <button
                          onClick={() => openDeleteModal(appointment)}
                          disabled={actionLoading === appointment._id}
                          className="action-btn delete"
                          title="Delete appointment"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state">
                    <div className="empty-message">
                      <svg className="empty-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <h3>No appointments found</h3>
                      <p>{search ? `No appointments match "${search}"` : 'No appointments in the system'}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev || loading}
              className="pagination-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Previous
            </button>
            
            <div className="pagination-info">
              <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
              <span className="pagination-total">({pagination.totalAppointments} total)</span>
            </div>
            
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext || loading}
              className="pagination-btn"
            >
              Next
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedAppointment && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-container large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>
              <h2>Appointment Details</h2>
              <button onClick={closeModals} className="modal-close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="details-grid">
                <div className="detail-section">
                  <h3>Patient Information</h3>
                  <div className="detail-item">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{selectedAppointment.patient?.name || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedAppointment.patient?.email || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{selectedAppointment.patient?.phone || 'N/A'}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Doctor Information</h3>
                  <div className="detail-item">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">Dr. {selectedAppointment.doctor?.name || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedAppointment.doctor?.email || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{selectedAppointment.doctor?.phone || 'N/A'}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Appointment Details</h3>
                  <div className="detail-item">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{formatDate(selectedAppointment.appointmentDate)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Time Slot:</span>
                    <span className="detail-value">{selectedAppointment.timeSlot}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Fee:</span>
                    <span className="detail-value">₨{selectedAppointment.consultationFee}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className="detail-value">{getStatusBadge(selectedAppointment.status)}</span>
                  </div>
                </div>

                {selectedAppointment.patientNotes && (
                  <div className="detail-section full-width">
                    <h3>Patient Notes</h3>
                    <p className="notes">{selectedAppointment.patientNotes}</p>
                  </div>
                )}

                {selectedAppointment.doctorNotes && (
                  <div className="detail-section full-width">
                    <h3>Doctor Notes</h3>
                    <p className="notes">{selectedAppointment.doctorNotes}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="modal-footer">
              <button onClick={closeModals} className="modal-btn cancel">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {showStatusModal && selectedAppointment && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className={`modal-icon ${newStatus === 'approved' || newStatus === 'completed' ? 'success' : 'warning'}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {newStatus === 'approved' || newStatus === 'completed' ? (
                    <polyline points="20 6 9 17 4 12"></polyline>
                  ) : (
                    <>
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </>
                  )}
                </svg>
              </div>
              <h2>Change Appointment Status</h2>
              <button onClick={closeModals} className="modal-close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="modal-body">
              <p>
                Are you sure you want to mark this appointment as <strong>{newStatus}</strong>?
              </p>
            </div>
            
            <div className="modal-footer">
              <button onClick={closeModals} className="modal-btn cancel">
                Cancel
              </button>
              <button 
                onClick={handleConfirmStatusChange}
                className={`modal-btn ${newStatus === 'approved' || newStatus === 'completed' ? 'success' : 'warning'}`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedAppointment && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon danger">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </div>
              <h2>Delete Appointment</h2>
              <button onClick={closeModals} className="modal-close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="modal-body">
              <p>Are you sure you want to delete this appointment?</p>
              <p className="modal-subtitle">This action cannot be undone.</p>
            </div>
            
            <div className="modal-footer">
              <button onClick={closeModals} className="modal-btn cancel">
                Cancel
              </button>
              <button onClick={handleConfirmDelete} className="modal-btn danger">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}