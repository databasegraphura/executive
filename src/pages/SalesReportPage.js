// src/pages/SalesReportPage.js
import React, { useEffect, useState } from 'react';
import salesService from '../services/salesService'; // Our sales service
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';
import styles from '../components/Layout/Layout.module.css'; // General layout styles
import reportStyles from './ReportPage.module.css'; // Reusing report table styles for consistency

const SalesReportPage = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        setError(null);
        // The backend's getAllSales API automatically filters by the logged-in user's role
        const data = await salesService.getAllSales();
        setSalesData(data);
      } catch (err) {
        console.error('Failed to fetch sales data:', err);
        setError(err.response?.data?.message || err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className={`${styles.content} ${reportStyles.errorContainer}`}>
        <h2>Error Loading Sales Report</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.content}>
      <h1 className={reportStyles.pageTitle}>Sales Report</h1>

      <div className={reportStyles.reportSection}>
        <h2 className={reportStyles.sectionTitle}>Your Sales</h2>
        {salesData.length === 0 && !loading ? (
          <p>No sales records found.</p>
        ) : (
          <table className={reportStyles.reportTable}>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Client Name</th>
                <th>Email ID</th>
                <th>Contact No.</th>
                <th>Services</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((sale) => (
                <tr key={sale._id}>
                  <td>{sale.companyName}</td>
                  <td>{sale.clientName}</td>
                  <td>{sale.emailId || 'N/A'}</td>
                  <td>{sale.contactNo || 'N/A'}</td>
                  <td>{sale.services || 'N/A'}</td>
                  <td>Rs. {sale.amount ? sale.amount.toFixed(2) : '0.00'}</td>
                  <td>{sale.saleDate ? new Date(sale.saleDate).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SalesReportPage;