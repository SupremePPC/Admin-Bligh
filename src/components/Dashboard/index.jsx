// Dashboard.js
import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Sidebar from "../Sidebar";
import Overview from "../Overview";
import BankingDetails from "../BankingDetails";
import TransactionDashboard from "../TransactionManagement";
import UserRequestDashboard from "../UserRequest";
import DocumentDashboard from "../DocumentManagement";
import Logout from "../Logout";

function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Assuming you want to handle authentication

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Routes>
            <Route path="/" exact component={() => <Overview setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/banking-details" component={() => <BankingDetails setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/transactions" component={() => <TransactionDashboard setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/user-requests" component={() => <UserRequestDashboard setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/documents" component={() => <DocumentDashboard setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/logout" component={() => <Logout setIsAuthenticated={setIsAuthenticated} />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;
