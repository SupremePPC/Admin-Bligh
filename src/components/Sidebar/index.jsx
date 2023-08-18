// Sidebar.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaUser, FaRegListAlt, FaFileAlt, FaSignOutAlt } from "react-icons/fa";
import { CgMenuGridR } from "react-icons/cg";
import { PiBankFill } from "react-icons/pi";
import "./style.css";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button onClick={() => setCollapsed(!collapsed)}>
        <CgMenuGridR />
      </button>
      <ul>
        <li>
          <Link to="/">
            <FaHome />
            {!collapsed && "Account Overview"}
          </Link>
        </li>
        <li>
          <Link to="/banking-details">
            <PiBankFill />
            {!collapsed && "Banking Details Management"}
          </Link>
        </li>
        <li>
          <Link to="/transactions">
            <FaRegListAlt />
            {!collapsed && "Transactions Management"}
          </Link>
        </li>
        <li>
          <Link to="/user-requests">
            <FaUser />
            {!collapsed && "User Request Management"}
          </Link>
        </li>
        <li>
          <Link to="/documents">
            <FaFileAlt />
            {!collapsed && "Documents Management"}
          </Link>
        </li>
        <li>
          {/* Implement logout functionality */}
          <Link to="/logout">
            <FaSignOutAlt />
            {!collapsed && "Logout"}
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
