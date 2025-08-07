// src/pages/DashboardPage.js
import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth'; // To get current user info
import reportService from '../services/reportService'; // Our new report service
import prospectService from '../services/prospectService'; // To fetch Hot Clients (Untouched data)
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'; // For loading state
import styles from '../components/Layout/Layout.module.css'; // General layout styles
import dashboardStyles from './DashboardPage.module.css'; // Specific styles for this page (will create next)

const DashboardPage = () => {
  const { user } = useAuth(); // Get current user (name, role, etc.)
  const [dashboardData, setDashboardData] = useState(null);
  const [hotClients, setHotClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch dashboard summary for the current user's role
        const summary = await reportService.getDashboardSummary();
        setDashboardData(summary);

        // Fetch "Hot Clients" data for Sales Executive
        // Assuming "Hot Clients" are active prospects not yet converted/closed
        // We can either filter all prospects or have a dedicated 'hot clients' API.
        // For simplicity, let's fetch all prospects and the component can filter.
        // Or, more accurately, 'Untouched Data' might represent this for SE
        const prospectsResponse = await prospectService.getAllProspects(); // This API is role-filtered already
        // Filter for "Hot Clients" (e.g., active prospects, not converted, not cold)
        const filteredHotClients = prospectsResponse.filter(p => p.activity !== 'Converted' && p.activity !== 'Cold').slice(0, 5); // Show top 5
        setHotClients(filteredHotClients);


      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err.response?.data?.message || err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]); // Re-fetch if user changes (though usually user is constant after login)

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className={`${styles.content} ${dashboardStyles.errorContainer}`}>
        <h2>Error Loading Dashboard</h2>
        <p>{error}</p>
      </div>
    );
  }

  // Ensure dashboardData is not null before rendering
  if (!dashboardData) {
    return (
      <div className={styles.content}>
        <h2>Dashboard</h2>
        <p>No dashboard data available.</p>
      </div>
    );
  }

  return (
    <div className={styles.content}>
      <h1 className={dashboardStyles.pageTitle}>Dashboard</h1>

      {/* KPI Cards Section */}
      <div className={dashboardStyles.kpiCards}>
        <div className={dashboardStyles.kpiCard}>
          <h3>Total Client's Data</h3>
          <p>{dashboardData.totalClientsData || 0}</p>
        </div>
        <div className={dashboardStyles.kpiCard}>
          <h3>Total Sales</h3>
          <p>Rs. {dashboardData.totalSales || 0}</p>
        </div>
        <div className={dashboardStyles.kpiCard}>
          <h3>Last Month Payout</h3>
          <p>Rs. {dashboardData.lastMonthPayout || 0}</p>
        </div>
        <div className={dashboardStyles.kpiCard}>
          <h3>Prospect Number</h3>
          <p>{dashboardData.prospectNumber || 0}</p>
        </div>
      </div>

      {/* Hot Clients Section */}
      <div className={dashboardStyles.hotClientsSection}>
        <h2 className={dashboardStyles.sectionTitle}>Hot Clients</h2>
        {hotClients.length === 0 ? (
          <p>No hot clients to display.</p>
        ) : (
          <table className={dashboardStyles.hotClientsTable}>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Client Name</th>
                <th>Email ID</th>
                <th>Contact No.</th>
                <th>Reminder Date</th>
                <th>Activity</th>
              </tr>
            </thead>
            <tbody>
              {hotClients.map((client) => (
                <tr key={client._id}>
                  <td>{client.companyName}</td>
                  <td>{client.clientName}</td>
                  <td>{client.emailId}</td>
                  <td>{client.contactNo}</td>
                  <td>{client.reminderDate ? new Date(client.reminderDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{client.activity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;