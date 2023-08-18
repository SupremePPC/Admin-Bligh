// Dashboard.js
import React from "react";
import Sidebar from "../Sidebar";
import { Outlet } from 'react-router-dom';
import "./style.css";

function Dashboard() {
  return (
    <div className="dashboard_container">
      <Sidebar />
      <div className="main_content">
        <Outlet/>
      </div>
    </div>
  );
}

export default Dashboard;
