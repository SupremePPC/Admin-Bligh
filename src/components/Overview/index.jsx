import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

export default function DashboardOverview() {
  return (
    <div className="dashboard_overview">
      <h2>Dashboard Overview</h2>
      
      <div className="overview_section">
        <h3><Link to="/dashboard">My Accounts</Link></h3>
        <p>View and manage your account details.</p>
      </div>

      <div className="overview_section">
        <h3><Link to="/dashboard/transactions">Transactions</Link></h3>
        <p>View your transaction history and manage pending transactions.</p>
      </div>

      <div className="overview_section">
        <h3><Link to="/dashboard/account-details">Account Details</Link></h3>
        <p>Update and modify your account and personal details.</p>
      </div>

      <div className="overview_section">
        <h3><Link to="/dashboard/interest-calculator">Interest Calculator</Link></h3>
        <p>Calculate interest based on your account balance.</p>
      </div>

      <div className="overview_section">
        <h3><Link to="/dashboard/admin">Admin Dashboard</Link></h3>
        <p>Admin tools and settings.</p>
      </div>
    </div>
  );
}
