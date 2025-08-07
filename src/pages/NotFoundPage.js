// src/pages/NotFoundPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../components/Layout/Layout.module.css'; // Reuse a style or make a separate 404 style

const NotFoundPage = () => {
  return (
    <div className={styles.content} style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/dashboard">Go to Dashboard</Link>
    </div>
  );
};

export default NotFoundPage;