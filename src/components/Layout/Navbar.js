// src/components/Layout/Navbar.js - CORRECTED
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Import useNavigate
import styles from './Layout.module.css';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleLogout = async () => {
    await logout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <span className={styles.appName}>GRAPHURA CRM</span>
        {user && <span className={styles.userName}>Hello, {user.name}!</span>}
      </div>
      <div className={styles.navbarRight}>
        {/* Placeholder for Proposals, Custom Plan, Work Order from screenshot */}
        <button className={styles.navButton}>Proposals</button>
        <button className={styles.navButton}>Custom Plan</button>
        <button className={styles.navButton}>Work Order</button>
        <div className={styles.profileDropdown}>
          <button className={styles.profileButton}>My Profile ▼</button>
          <div className={styles.dropdownContent}>
            <NavLink to="/my-profile" className={styles.dropdownLink}>Profile</NavLink> {/* Use NavLink for internal link */}
            <button onClick={handleLogout} className={styles.dropdownButton}>Logout</button> {/* Use a specific class */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;