// src/pages/ReportPage.js
import React, { useEffect, useState } from 'react';
import callLogService from '../services/callLogService'; // Our new call log service
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import styles from '../components/Layout/Layout.module.css'; // General layout styles
import reportStyles from './ReportPage.module.css'; // Specific styles for this page (will create next)
import Modal from '../components/Modal/Modal'; // We'll create a reusable Modal component

const ReportPage = () => {
  const [todayCalls, setTodayCalls] = useState([]);
  const [pastCalls, setPastCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for Past Calls filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // State for Modals
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null); // The call log currently selected for update/view
  const [updateFormData, setUpdateFormData] = useState({ activity: '', comment: '' });
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState('');


  // Helper to fetch call logs based on filters
  const fetchCallLogs = async (filters, setter) => {
    setLoading(true);
    setError(null);
    try {
      const data = await callLogService.getAllCallLogs(filters);
      setter(data);
    } catch (err) {
      console.error('Failed to fetch call logs:', err);
      setError(err.response?.data?.message || err.message || 'An unexpected error occurred.');
      setter([]); // Clear data on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch Today's Calls on component mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD for backend
    fetchCallLogs({ date: today }, setTodayCalls);
  }, []);

  // Handle Past Calls search
  const handlePastCallsSearch = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setError('Please select both start and end dates for past calls.');
      return;
    }
    fetchCallLogs({ startDate, endDate }, setPastCalls);
  };

  // --- Modal Logic ---
  const openUpdateModal = (call) => {
    setSelectedCall(call);
    setUpdateFormData({ activity: call.activity, comment: call.comment });
    setUpdateError(null);
    setUpdateSuccess('');
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedCall(null);
    setUpdateFormData({ activity: '', comment: '' });
  };

  const handleUpdateChange = (e) => {
    setUpdateFormData({
      ...updateFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUpdateError(null);
    setUpdateSuccess('');

    try {
      const updatedCall = await callLogService.updateCallLog(selectedCall._id, updateFormData);
      setUpdateSuccess('Call log updated successfully!');
      // Update the call in the lists
      const updatedLists = (list) => list.map(call => call._id === updatedCall._id ? updatedCall : call);
      setTodayCalls(updatedLists);
      setPastCalls(updatedLists);
      // Optionally close modal after success or keep open to show message
      // setTimeout(closeUpdateModal, 1500); // Close after 1.5 seconds
    } catch (err) {
      setUpdateError(err.response?.data?.message || err.message || 'Failed to update call log.');
    } finally {
      setLoading(false);
    }
  };

  const openViewModal = (call) => {
    setSelectedCall(call);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedCall(null);
  };
  // --- End Modal Logic ---


  if (loading && !todayCalls.length && !pastCalls.length) { // Only show full spinner if no data is loaded yet
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.content}>
      <h1 className={reportStyles.pageTitle}>Call List Report</h1>

      {error && <p className={reportStyles.errorMessage}>{error}</p>}

      {/* Today's Call List */}
      <div className={reportStyles.reportSection}>
        <h2 className={reportStyles.sectionTitle}>Today's Call List</h2>
        {loading && <LoadingSpinner />} {/* Show smaller spinner if fetching specific list */}
        {todayCalls.length === 0 && !loading && <p>No calls logged today.</p>}
        {todayCalls.length > 0 && (
          <table className={reportStyles.reportTable}>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Client Name</th>
                <th>Email ID</th>
                <th>Contact No.</th>
                <th>Reminder Date</th>
                <th>Activity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {todayCalls.map(call => (
                <tr key={call._id}>
                  <td>{call.companyName}</td>
                  <td>{call.clientName}</td>
                  <td>{call.emailId}</td>
                  <td>{call.contactNo}</td>
                  <td>{call.prospect?.reminderDate ? new Date(call.prospect.reminderDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{call.activity}</td>
                  <td>
                    <button onClick={() => openUpdateModal(call)} className={reportStyles.actionButton}>Update</button>
                    <button onClick={() => openViewModal(call)} className={reportStyles.actionButton}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Past Call List */}
      <div className={reportStyles.reportSection}>
        <h2 className={reportStyles.sectionTitle}>Past Call List</h2>
        <form onSubmit={handlePastCallsSearch} className={reportStyles.filterForm}>
          <div className={reportStyles.formGroup}>
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={reportStyles.formInput}
            />
          </div>
          <div className={reportStyles.formGroup}>
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={reportStyles.formInput}
            />
          </div>
          <button type="submit" className={reportStyles.searchButton} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {loading && !pastCalls.length && <LoadingSpinner />} {/* Show spinner if search initiated */}
        {pastCalls.length === 0 && !loading && startDate && endDate && <p>No calls found for the selected date range.</p>}
        {pastCalls.length > 0 && (
          <table className={reportStyles.reportTable}>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Client Name</th>
                <th>Email ID</th>
                <th>Contact No.</th>
                <th>Reminder Date</th>
                <th>Activity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pastCalls.map(call => (
                <tr key={call._id}>
                  <td>{call.companyName}</td>
                  <td>{call.clientName}</td>
                  <td>{call.emailId}</td>
                  <td>{call.contactNo}</td>
                  <td>{call.prospect?.reminderDate ? new Date(call.prospect.reminderDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{call.activity}</td>
                  <td>
                    <button onClick={() => openUpdateModal(call)} className={reportStyles.actionButton}>Update</button>
                    <button onClick={() => openViewModal(call)} className={reportStyles.actionButton}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Update Call Modal */}
      {showUpdateModal && selectedCall && (
        <Modal onClose={closeUpdateModal} title="Update Call Details">
          <form onSubmit={handleUpdateSubmit} className={reportStyles.modalForm}>
            <div className={reportStyles.formGroup}>
              <label>Company Name</label>
              <input type="text" value={selectedCall.companyName} disabled className={reportStyles.formInput} />
            </div>
            <div className={reportStyles.formGroup}>
              <label>Client Name</label>
              <input type="text" value={selectedCall.clientName} disabled className={reportStyles.formInput} />
            </div>
            <div className={reportStyles.formGroup}>
              <label htmlFor="activity">Activity</label>
              <select
                id="activity"
                name="activity"
                value={updateFormData.activity}
                onChange={handleUpdateChange}
                className={reportStyles.formInput}
                required
              >
                <option value="">Select Activity</option>
                <option value="Talked">Talked</option>
                <option value="Not Talked">Not Talked</option>
                <option value="Follow Up">Follow Up</option>
                <option value="Delete Client's Profile">Delete Client's Profile</option>
              </select>
            </div>
            <div className={reportStyles.formGroup}>
              <label htmlFor="comment">Comment</label>
              <textarea
                id="comment"
                name="comment"
                value={updateFormData.comment}
                onChange={handleUpdateChange}
                className={reportStyles.formTextarea}
                rows="3"
              ></textarea>
            </div>
            {updateError && <p className={reportStyles.errorMessage}>{updateError}</p>}
            {updateSuccess && <p className={reportStyles.successMessage}>{updateSuccess}</p>}
            <button type="submit" className={reportStyles.submitButton} disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
            </button>
          </form>
        </Modal>
      )}

      {/* View Call Modal */}
      {showViewModal && selectedCall && (
        <Modal onClose={closeViewModal} title="Call Details">
          <div className={reportStyles.detailItem}>
            <strong>Company Name:</strong> {selectedCall.companyName}
          </div>
          <div className={reportStyles.detailItem}>
            <strong>Client Name:</strong> {selectedCall.clientName}
          </div>
          <div className={reportStyles.detailItem}>
            <strong>Email ID:</strong> {selectedCall.emailId || 'N/A'}
          </div>
          <div className={reportStyles.detailItem}>
            <strong>Contact No.:</strong> {selectedCall.contactNo || 'N/A'}
          </div>
          <div className={reportStyles.detailItem}>
            <strong>Call Date:</strong> {new Date(selectedCall.callDate).toLocaleString()}
          </div>
          <div className={reportStyles.detailItem}>
            <strong>Activity:</strong> {selectedCall.activity}
          </div>
          <div className={reportStyles.detailItem}>
            <strong>Comment:</strong> {selectedCall.comment || 'No comment'}
          </div>
          {selectedCall.prospect && (
            <div className={reportStyles.detailItem}>
              <strong>Related Prospect:</strong> {selectedCall.prospect.companyName} - {selectedCall.prospect.clientName}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default ReportPage;