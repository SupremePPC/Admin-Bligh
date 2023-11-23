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
import { AiOutlineStock } from "react-icons/ai";
import { getAuth } from "firebase/auth";
import Modal from "../CustomsModal";
import { SumNotifications, countUsersWithChats, sumBondRequests, sumIposRequests, sumTermRequests, sumUserRequests } from "../../firebaseConfig/firestore";
import "./style.css";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();
  const isActive = (path) => location.pathname === path;
  const [collapsed, setCollapsed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [userRequests, setUserRequests] = useState(0);
  const [iposRequests, setIposRequests] = useState(0);
  const [termsRequests, setTermsRequests] = useState(0);
  const [liveChatSum, setLiveChatSum] = useState(0);
  const [bondsRequests, setBondsRequests] = useState(0);


  useEffect(() => {
    SumNotifications(setNotifications);
    sumUserRequests(setUserRequests);
    sumBondRequests(setBondsRequests);
    sumIposRequests(setIposRequests);
    sumTermRequests(setTermsRequests);
    countUsersWithChats(setLiveChatSum);
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

  const iposRequestsBadge = (
    <span className="notification_badge">
      <BsBriefcase size={18} />
      <p className="notification_count">{iposRequests}</p>
    </span>
  );

  const termsRequestsBadge = (
    <span className="notification_badge">
      <PiMoneyLight size={22} />
      <p className="notification_count">{termsRequests}</p>
    </span>
  );

  const bondsRequestsBadge = (
    <span className="notification_badge">
      <BsCreditCard2Front size={18} />
      <p className="notification_count">{bondsRequests}</p>
    </span>
  );

  const liveChatBadge = (
    <span className="notification_badge">
      <BsChatLeftText size={16} />
      <p className="notification_count">{liveChatSum}</p>
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
            title="Dashboard"
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
            title="Registered Users"
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
            title="User Requests"
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
            title="Transactions"
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
            title="Cash Deposits"
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
            title="Bonds"
          >
            {bondsRequestsBadge}
            {!collapsed && "Bonds"}
          </Link>
        </li>
        <li className="menu_list">
          <Link
            className={`menu_link ${
              isActive("/dashboard/fixed-term-deposits") ? "active" : ""
            }`}
            to="/dashboard/fixed-term-deposits"
            title="Fixed Term Deposits"
          >
            {termsRequestsBadge}
            {!collapsed && "Fixed Term Deposits"}
          </Link>
        </li>
        <li className="menu_list">
          <Link
            className={`menu_link ${
              isActive("/dashboard/ipos") ? "active" : ""
            }`}
            to="/dashboard/ipos"
            title="IPOs"
          >
            {iposRequestsBadge}
            {!collapsed && "IPOs"}
          </Link>
        </li>
        <li className="menu_list">
          <Link
            className={`menu_link ${
              isActive("/dashboard/stock-trading") ? "active" : ""
            }`}
            to="/dashboard/stock-trading"
            title="Stock Trading"
          >
            <AiOutlineStock size={22} />
            {!collapsed && "Stock Trading"}
          </Link>
        </li>
        <li className="menu_list">
          <Link
            className={`menu_link ${
              isActive("/dashboard/banking-details") ? "active" : ""
            }`}
            to="/dashboard/banking-details"
            title="Banking Details"
          >
            <BsBank size={16} />
            {!collapsed && "Banking Details"}
          </Link>
        </li>
        <li className="menu_list">
          <Link
            className={`menu_link ${
              isActive("/dashboard/documents") ? "active" : ""
            }`}
            to="/dashboard/documents"
            title="Docs Management"
          >
            <BsFileEarmarkText size={20} />
            {!collapsed && "Docs Management"}
          </Link>
        </li>
        <li className="menu_list">
          <Link
            className={`menu_link ${
              isActive("/dashboard/chat-with-user") ? "active" : ""
            }`}
            to="/dashboard/chat-with-user"
            title="Chat With User"
          >
            {liveChatBadge}
            {!collapsed && "Chat With User"}
          </Link>
        </li>
        <li className="menu_list">
          <Link
            className={`menu_link ${
              isActive("/dashboard/notifications") ? "active" : ""
            }`}
            to="/dashboard/notifications"
            title="Notifications"
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
            title="Settings"
          >
            <IoSettingsOutline size={20} />
            {!collapsed && "Settings"}
          </Link>
        </li>

        <li className="menu_list" title="Logout">
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
