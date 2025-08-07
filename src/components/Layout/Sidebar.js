// src/components/Layout/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom'; // Use NavLink for active styling
import styles from './Layout.module.css';
import useAuth from '../../hooks/useAuth';

const Sidebar = () => {
  const { user } = useAuth();
  // Sales Executive specific navigation items based on screenshots
  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'User Data', path: '/my-profile' }, // Mapping 'User Data' to 'My Profile'
    { name: 'Prospect', path: '/prospect-form' }, // Mapping 'Prospect' to the form for SE
    { name: 'Report', path: '/report' }, // For Call List
    { name: 'Sales Report', path: '/sales-report' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoSection}>
        <img src="/logo.png" alt="Graphura Logo" className={styles.logo} /> {/* Place your logo in public/logo.png */}
        <div className={styles.userInfo}>
          <div className={styles.userIcon}>👤</div> {/* Placeholder for user icon */}
          <span className={styles.userName}>{user.name}</span> {/* Will be dynamic */}
          <span className={styles.userRole}>Sales Executive</span> {/* Will be dynamic */}
        </div>
      </div>
      <nav className={styles.navbarNav}>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.activeNavItem}` : styles.navItem
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;