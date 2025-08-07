// src/pages/UserDataPage.js
import React, { useEffect, useState } from 'react';
import userService from '../services/userService'; // Uses getAllUsers()
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import styles from '../components/Layout/Layout.module.css'; // General layout styles
import pageStyles from './UserDataPage.module.css'; // Specific styles for this page

const initialModalState = {
  open: false,
  mode: 'update', // 'update' or 'view'
  prospect: null,
};

const UserDataPage = () => {
  const [userDataList, setUserDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For modal and form inside modal
  const [modal, setModal] = useState(initialModalState);
  const [comment, setComment] = useState('');
  const [activity, setActivity] = useState('');

  // Fetch all prospects on load
  useEffect(() => {
    const fetchAllUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await userService.getAllUsers(); // fetch data from backend
        setUserDataList(data);
      } catch (err) {
        console.error('Failed to fetch prospect data:', err);
        setError(err.response?.data?.message || err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllUserData();
  }, []);

  // Open modal for Update
  const handleUpdate = (prospect) => {
    setModal({ open: true, mode: 'update', prospect });
    setComment(prospect.comment || '');
    setActivity(prospect.activity || 'New');
  };

  // Open modal for View (read-only)
  const handleView = (prospect) => {
    setModal({ open: true, mode: 'view', prospect });
    setComment(prospect.comment || '');
    setActivity(prospect.activity || 'New');
  };

  // Close modal and reset
  const handleCloseModal = () => {
    setModal(initialModalState);
    setComment('');
    setActivity('');
  };

  // Submit update to backend
  const handleUpdateSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      // Assuming you have a backend endpoint for updating prospect, e.g.:
      // await prospectService.updateProspect(modal.prospect._id, { comment, activity });
      // Since you don't have prospectService here, let's simulate:

      // Simulate API call:
      // Replace this with actual API call to update prospect by ID
      const updatedProspect = {
        ...modal.prospect,
        comment,
        activity,
        lastUpdate: new Date().toISOString(),
      };

      // Update the local list to reflect immediately
      setUserDataList((prevList) =>
        prevList.map((p) =>
          (p._id || p.id) === (modal.prospect._id || modal.prospect.id)
            ? updatedProspect
            : p
        )
      );

      handleCloseModal();
    } catch (err) {
      console.error('Failed to update prospect:', err);
      setError('Failed to update prospect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !modal.open) {
    return <LoadingSpinner />;
  }

  if (error && !modal.open) {
    return (
      <div className={`${styles.content} ${pageStyles.errorContainer}`}>
        <h2>Error Loading Data</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.content}>
      <h1 className={pageStyles.pageTitle}>Prospects Data</h1>

      <div className={pageStyles.tableContainer}>
        <table className={pageStyles.dataTable}>
          <thead>
            <tr>
              <th></th> {/* Kebab menu icon placeholder */}
              <th>Company Name</th>
              <th>Client Name</th>
              <th>Email ID</th>
              <th>Contact No.</th>
              <th>Reminder Date</th>
              <th>Activity</th>
              <th>Last Update</th>
            </tr>
          </thead>
          <tbody>
            {userDataList.length > 0 ? (
              userDataList.map((user) => (
                <tr key={user._id || user.id}>
                  <td><span className={pageStyles.kebabMenu}>&#x22EE;</span></td>
                  <td>{user.companyName}</td>
                  <td>{user.clientName}</td>
                  <td>{user.emailId || ''}</td>
                  <td>{user.contactNo || ''}</td>
                  <td>
                    {user.reminderDate ? new Date(user.reminderDate).toLocaleDateString() : ''}
                  </td>
                  <td>
                    <button
                      onClick={() => handleUpdate(user)}
                      className={`${pageStyles.actionButton} ${pageStyles.updateButton}`}
                    >
                      {user.activity || 'Update'}
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleView(user)}
                      className={`${pageStyles.actionButton} ${pageStyles.viewButton}`}
                    >
                      {user.lastUpdate ? new Date(user.lastUpdate).toLocaleDateString() : 'View'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className={pageStyles.noData}>
                  No prospect data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Update/View */}
      {modal.open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{modal.mode === 'update' ? 'Update Call Details' : 'View Details'}</h2>
            <div>
              {/* Radio buttons only enabled in update mode */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ marginRight: '1rem' }}>
                  <input
                    type="radio"
                    name="activity"
                    value="Talk"
                    checked={activity === 'Talk'}
                    onChange={() => setActivity('Talk')}
                    disabled={modal.mode === 'view'}
                  />{' '}
                  Talk
                </label>
                <label style={{ marginRight: '1rem' }}>
                  <input
                    type="radio"
                    name="activity"
                    value="Not Talk"
                    checked={activity === 'Not Talk'}
                    onChange={() => setActivity('Not Talk')}
                    disabled={modal.mode === 'view'}
                  />{' '}
                  Not Talk
                </label>
                <label>
                  <input
                    type="radio"
                    name="activity"
                    value="Deleted"
                    checked={activity === 'Deleted'}
                    onChange={() => setActivity('Deleted')}
                    disabled={modal.mode === 'view'}
                  />{' '}
                  Delete Client’s Profile
                </label>
              </div>

              {/* Comment textarea */}
              <textarea
                rows={5}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={modal.mode === 'view'}
                style={{ width: '100%', resize: 'vertical' }}
                placeholder="Add your comment here..."
              />

              {/* Buttons */}
              <div style={{ marginTop: '1rem' }}>
                {modal.mode === 'update' && (
                  <button
                    onClick={handleUpdateSubmit}
                    className={pageStyles.submitButton}
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update'}
                  </button>
                )}
                <button
                  onClick={handleCloseModal}
                  style={{ marginLeft: '1rem' }}
                  className={pageStyles.cancelButton}
                >
                  Close
                </button>
              </div>

              {/* Show error in modal if any */}
              {error && <p className={pageStyles.errorMessage}>{error}</p>}
            </div>
          </div>

          {/* Modal overlay styles */}
          <style>
            {`
              .modal-overlay {
                position: fixed;
                z-index: 1000;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1rem;
              }
              .modal-content {
                background: white;
                padding: 1.5rem;
                border-radius: 8px;
                max-width: 500px;
                width: 100%;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
              }
            `}
          </style>
        </div>
      )}
    </div>
  );
};

export default UserDataPage;
