// Dashboard.js
import React from "react";
import Sidebar from "../Sidebar";
import Overview from "../Overview";
import BankingDetails from "../BankingDetails";
import TransactionDashboard from "../TransactionManagement";
import UserRequestDashboard from "../UserRequest";
import DocumentDashboard from "../DocumentManagement";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../../protectedRoutes";
import "./style.css";

function Dashboard() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        
      </div>
    </div>
  );
}

export default Dashboard;
