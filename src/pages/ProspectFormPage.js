// src/pages/ProspectFormPage.js
import React, { useState } from 'react';
import prospectService from '../services/prospectService'; // For creating prospects
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import styles from '../components/Layout/Layout.module.css'; // General layout styles
import formStyles from './ProspectFormPage.module.css'; // Specific form styles (will create next)

const ProspectFormPage = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    clientName: '',
    emailId: '',
    contactNo: '',
    reminderDate: '', // Date input will handle this
    comment: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear messages on input change
    setError(null);
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      // Sales Executive doesn't provide assignedToExecutiveEmail; backend defaults to current user
      await prospectService.createProspect(formData);
      setSuccessMessage('Prospect added successfully!');
      // Clear form after successful submission
      setFormData({
        companyName: '',
        clientName: '',
        emailId: '',
        contactNo: '',
        reminderDate: '',
        comment: '',
      });
    } catch (err) {
      console.error('Failed to add prospect:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || err.message || 'Failed to add prospect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.content}>
      <h1 className={formStyles.pageTitle}>Prospect Form</h1>

      <div className={formStyles.formCard}>
        {loading && <LoadingSpinner />}
        {successMessage && <p className={formStyles.successMessage}>{successMessage}</p>}
        {error && <p className={formStyles.errorMessage}>{error}</p>}

        <form onSubmit={handleSubmit} className={formStyles.prospectForm}>
          <div className={formStyles.formGroup}>
            <label htmlFor="companyName">Company Name</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className={formStyles.formInput}
              required
            />
          </div>

          <div className={formStyles.formGroup}>
            <label htmlFor="clientName">Client Name</label>
            <input
              type="text"
              id="clientName"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className={formStyles.formInput}
              required
            />
          </div>

          <div className={formStyles.formGroup}>
            <label htmlFor="emailId">Email ID</label>
            <input
              type="email"
              id="emailId"
              name="emailId"
              value={formData.emailId}
              onChange={handleChange}
              className={formStyles.formInput}
            />
          </div>

          <div className={formStyles.formGroup}>
            <label htmlFor="contactNo">Contact No.</label>
            <input
              type="text"
              id="contactNo"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              className={formStyles.formInput}
            />
          </div>

          <div className={formStyles.formGroup}>
            <label htmlFor="reminderDate">Reminder Date</label>
            <input
              type="date"
              id="reminderDate"
              name="reminderDate"
              value={formData.reminderDate}
              onChange={handleChange}
              className={formStyles.formInput}
            />
          </div>

          <div className={formStyles.formGroup}>
            <label htmlFor="comment">Comment</label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              className={formStyles.formTextarea}
              rows="4"
            ></textarea>
          </div>

          <button type="submit" className={formStyles.submitButton} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProspectFormPage;