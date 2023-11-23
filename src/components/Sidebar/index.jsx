// Sidebar.js
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoHomeOutline, IoSettingsOutline } from "react-icons/io5";
import { CgMenuGridR } from "react-icons/cg";
import { BiTransfer } from "react-icons/bi";
import {
  BsPerson,
  BsFileEarmarkText,
  BsCashCoin,
  BsBriefcase,
  BsCreditCard2Front,
  BsBank,
  BsChatLeftText
} from "react-icons/bs";
import { PiMoneyLight } from "react-icons/pi";
import { IoMdNotificationsOutline, IoIosLogOut } from "react-icons/io";
import { TbUsersGroup } from "react-icons/tb";
import { getAuth } from "firebase/auth";
import Modal from "../CustomsModal";
import { SumNotifications, sumUserRequests } from "../../firebaseConfig/firestore";
import "./style.css";
import { AiOutlineStock } from "react-icons/ai";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [isLoading, setIsLoading] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [userRequests, setUserRequests] = useState(0);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    // Call SumNotifications and pass the setter function for notifications
    SumNotifications(setNotifications);
    sumUserRequests(setUserRequests);
  }, []);

  const notificationBadge = (
    <span className="notification_badge">
      <IoMdNotificationsOutline size={20} />
      <p className="notification_count">{notifications}</p>
    </span>
  );
  const userRequestsBadge = (
    <span className="notification_badge">
      <BsPerson size={18} />
      <p className="notification_count">{userRequests}</p>
    </span>
  );

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
            <IoHomeOutline size={18} />
            {!collapsed && "Dashboard"}
          </Link>
        </li>
        <li className="menu_list">
          <Link
            className={`menu_link ${
              isActive("/dashboard/registered-users/") ? "active" : ""
            }`}
            to="/dashboard/registered-users/"
          >
            <TbUsersGroup size={18} />
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
            {userRequestsBadge}
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
            <BiTransfer fill="#fff" stroke="#fff" size={20} />
            {!collapsed && "Transactions Request"}
          </Link>
        </li>
        <li className="menu_list">
          <Link
            className={`menu_link ${
              isActive("/dashboard/cash-deposits") ? "active" : ""
            }`}
            to="/dashboard/cash-deposits"
          >
            <BsCashCoin stroke="#fff" size={20} />
            {!collapsed && "Cash Deposits"}
          </Link>
        </li>
        <li className="menu_list">
          <Link
            className={`menu_link ${
              isActive("/dashboard/bonds") ? "active" : ""
            }`}
            to="/dashboard/bonds"
          >
            <BsCreditCard2Front size={18} />
            {!collapsed && "Bonds"}
          </Link>
        </li>
        <li className="menu_list">
          <Link
            className={`menu_link ${
              isActive("/dashboard/fixed-term-deposits") ? "active" : ""
            }`}
            to="/dashboard/fixed-term-deposits"
          >
            <PiMoneyLight size={22} />
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
            <BsBriefcase size={20} />
            {!collapsed && "IPOs"}
          </Link>
        </li>
        <li className="menu_list">
          <Link
            className={`menu_link ${
              isActive("/dashboard/stock-trading") ? "active" : ""
            }`}
            to="/dashboard/stock-trading"
          >
            <AiOutlineStock size={20} />
            {!collapsed && "Stock Trading"}
          </Link>
        </li>
        <li className="menu_list">
          <Link
            className={`menu_link ${
              isActive("/dashboard/banking-details") ? "active" : ""
            }`}
            to="/dashboard/banking-details"
          >
            <BsBank size={20} />
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
              isActive("/dashboard/chat-with-user") ? "active" : ""
            }`}
            to="/dashboard/chat-with-user"
          >
            <BsChatLeftText size={20} />
            {!collapsed && "Chat With User"}
          </Link>
        </li>
        <li className="menu_list">
          <Link
            className={`menu_link ${
              isActive("/dashboard/notifications") ? "active" : ""
            }`}
            to="/dashboard/notifications"
          >
            {notificationBadge}
            {!collapsed && "Notifications"}
          </Link>
        </li>

        <li className="menu_list">
          <Link
            className={`menu_link ${
              isActive("/dashboard/settings") ? "active" : ""
            }`}
            to="/dashboard/settings"
          >
            <IoSettingsOutline size={20} />
            {!collapsed && "Settings"}
          </Link>
        </li>

        <li className="menu_list">
          <div
            className="menu_link"
            onClick={() => {
              setIsLogoutModalOpen(true);
            }}
          >
            <IoIosLogOut size={20} className="menu_icon" />
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
              positiveLabel="Cancel"
              negativeLabel="Logout"
              isLoading={isLoading}
            />
          </div>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
