// src/components/Layout/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom'; // To render child routes
import Navbar from './Navbar'; // We'll create this
import Sidebar from './Sidebar'; // We'll create this
import styles from './Layout.module.css'; // For overall layout

const Layout = () => {
  return (
    <div className={styles.layoutContainer}>
      <Sidebar />
      <div className={styles.mainContentArea}>
        <Navbar />
        <main className={styles.pageContent}>
          <Outlet /> {/* This is where nested route components (like DashboardPage) will render */}
        </main>
      </div>
    </div>
  );
};

export default Layout;