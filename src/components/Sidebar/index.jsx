// Sidebar.js
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaRegListAlt,
  FaFileAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { CgMenuGridR } from "react-icons/cg";
import { CiMoneyCheck1 } from "react-icons/ci";
import { PiBankFill } from "react-icons/pi";
import { getAuth } from "firebase/auth";
import Modal from "../CustomsModal";
import "./style.css";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [isLoading, setIsLoading] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button onClick={() => setCollapsed(!collapsed)} className="menu_button">
        <CgMenuGridR />
      </button>
      <ul className="menu_items">
        <li className="menu_list">
          <Link
            className={`menu_link ${isActive("/dashboard/") ? "active" : ""}`}
            to="/dashboard/"
          >
            <FaHome />
            {!collapsed && "Registered Users"}
          </Link>
        </li>
        <li className="menu_list">
          <Link
            className={`menu_link ${
              isActive("/dashboard/user-requests") ? "active" : ""
            }`}
            to="/dashboard/user-requests"
          >
            <FaUser />
            {!collapsed && "User Requests"}
          </Link>
        </li>
        <li className="menu_list">
          <Link
            className={`menu_link ${
              isActive("/dashboard/transactions") ? "active" : ""
            }`}
            to="/dashboard/transactions"
          >
            <FaRegListAlt />
            {!collapsed && "Transactions Request"}
          </Link>
        </li>
        <li className="menu_list">
          <Link
            className={`menu_link ${
              isActive("/dashboard/bonds") ? "active" : ""
            }`}
            to="/dashboard/bonds"
          >
            <CiMoneyCheck1 size={24} />
            {!collapsed && "Bonds Request"}
          </Link>
        </li>
        <li className="menu_list">
          <Link
            className={`menu_link ${
              isActive("/dashboard/banking-details") ? "active" : ""
            }`}
            to="/dashboard/banking-details"
          >
            <PiBankFill />
            {!collapsed && "Banking Details"}
          </Link>
        </li>
        <li className="menu_list">
          <Link
            className={`menu_link ${
              isActive("/dashboard/documents") ? "active" : ""
            }`}
            to="/dashboard/documents"
          >
            <FaFileAlt />
            {!collapsed && "Docs Management"}
          </Link>
        </li>
        <li className="menu_list">
          <div
            className="menu_link"
            onClick={() => {
              setIsLogoutModalOpen(true);
            }}
          >
            <FaSignOutAlt className="menu_icon" />
            {!collapsed && "Logout"}
            <Modal
              isOpen={isLogoutModalOpen}
              title="Logout"
              description="Are you sure you want to logout?"
              onClose={() => setIsLogoutModalOpen(false)}
              onPositiveAction={() => {
                setIsLoading(true);
                auth
                  .signOut()
                  .then(() => {
                    setIsLoading(false);
                    console.log("Successfully signed out!");
                    navigate("/");
                  })
                  .catch((error) => {
                    setIsLoading(false);
                    console.error("Error signing out:", error);
                  });
              }}
              positiveLabel="Logout"
              negativeLabel="Cancel"
              isLoading={isLoading}
            />
          </div>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
