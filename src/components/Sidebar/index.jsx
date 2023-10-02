// Sidebar.js
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  IoHomeOutline,
} from "react-icons/io5";
import { CgMenuGridR } from "react-icons/cg";
import { BiTransfer } from "react-icons/bi";
import { BsCardChecklist, BsPerson, BsFileEarmarkText } from "react-icons/bs";
import { CiMoneyCheck1, CiBank } from "react-icons/ci";
import { PiBriefcase } from "react-icons/pi";
import { IoMdNotificationsOutline, IoIosLogOut } from "react-icons/io";
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
            <IoHomeOutline  size={18}/>
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
            <BsPerson />
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
            <BiTransfer fill="#fff" stroke="#fff"  size={20}/>
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
            <BsCardChecklist  size={20} />
            {!collapsed && "Bonds Request"}
          </Link>
        </li>
        <li className="menu_list">
          <Link
            className={`menu_link ${
              isActive("/dashboard/fixed-term-deposits") ? "active" : ""
            }`}
            to="/dashboard/fixed-term-deposits"
          >
            <CiMoneyCheck1 size={22} />
            {!collapsed && "Fixed Term Deposits"}
          </Link>
        </li>
        <li className="menu_list">
          <Link
            className={`menu_link ${
              isActive("/dashboard/ipos") ? "active" : ""
            }`}
            to="/dashboard/ipos"
          >
            <PiBriefcase size={20} fill="#fff" />
            {!collapsed && "IPOs"}
          </Link>
        </li>
        <li className="menu_list">
          <Link
            className={`menu_link ${
              isActive("/dashboard/banking-details") ? "active" : ""
            }`}
            to="/dashboard/banking-details"
          >
            <CiBank  size={20} />
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
            <BsFileEarmarkText />
            {!collapsed && "Docs Management"}
          </Link>
        </li>
        
        <li className="menu_list">
          <Link
            className={`menu_link ${
              isActive("/dashboard/notifications") ? "active" : ""
            }`}
            to="/dashboard/notifications"
          >
            <IoMdNotificationsOutline  size={20}/>
            {!collapsed && "Notifications"}
          </Link>
        </li>

        <li className="menu_list">
          <div
            className="menu_link"
            onClick={() => {
              setIsLogoutModalOpen(true);
            }}
          >
            <IoIosLogOut  size={20} className="menu_icon" />
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
