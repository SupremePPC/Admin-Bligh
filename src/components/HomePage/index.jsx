import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoHomeOutline, IoSettingsOutline } from "react-icons/io5";
import { CgMenuGridR } from "react-icons/cg";
import { BiTransfer } from "react-icons/bi";
import {
  BsCardChecklist,
  BsPerson,
  BsFileEarmarkText,
  BsCashCoin,
  BsBriefcase,
} from "react-icons/bs";
import { CiBank } from "react-icons/ci";
import { LiaMoneyCheckAltSolid } from "react-icons/lia";
import { IoMdNotificationsOutline, IoIosLogOut } from "react-icons/io";
import { TbUsersGroup } from "react-icons/tb";
import { getAuth } from "firebase/auth";
import Modal from "../CustomsModal";
import { SumNotifications } from "../../firebaseConfig/firestore";
import "./style.css";

const DashboardCard = ({ to, icon, label }) => {
  return (
    <li className='card'>
      <Link to={to} className="homePage_link">
        <div className="card_body">
          <div className="homePage_icon">{icon}</div>
          <p className="homePage_label">{label}</p>
        </div>
      </Link>
    </li>
  );
};

function HomePage() {
  //   const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    // Call SumNotifications and pass the setter function for notifications
    SumNotifications(setNotifications);
  }, []);

  const notificationBadge = (
    <span className="notification_badge">
      <IoMdNotificationsOutline size={20} />
      <p className="notification_count">{notifications}</p>
    </span>
  );

  return (
    <div className="container homePage">
      <ul className="homePage_cards">
        {/* <DashboardCard
          to="/dashboard/"
          icon={<IoHomeOutline size={18} />}
          label="Dashboard"
        /> */}
        <DashboardCard
          to="/dashboard/registered-users"
          icon={<TbUsersGroup size={18} />}
          label="Registered Users"
        />
        <DashboardCard
          to="/dashboard/user-requests"
          icon={<BsPerson size={18} />}
          label="User Requests"
        />
        <DashboardCard
          to="/dashboard/transactions"
          icon={<BiTransfer stroke="#fff" size={20} />}
          label="Transactions Request"
        />
        <DashboardCard
          to="/dashboard/cash-deposits"
          icon={<BsCashCoin stroke="#fff" size={20} />}
          label="Cash Deposits"
        />
        <DashboardCard
          to="/dashboard/bonds"
          icon={<BsCardChecklist stroke="#fff" size={18} />}
          label="Bonds"
        />
        <DashboardCard
          to="/dashboard/fixed-term-deposits"
          icon={<LiaMoneyCheckAltSolid stroke="#fff" size={22} />}
          label="Fixed Term Deposits"
        />
        <DashboardCard
          to="/dashboard/ipos"
          icon={<BsBriefcase stroke="#fff" size={20} />}
          label="IPOS"
        />
        <DashboardCard
          to="/dashboard/banking-details"
          icon={<CiBank stroke="#fff" size={20} />}
          label="Banking Details"
        />
        <DashboardCard
          to="/dashboard/Documents"
          icon={<BsFileEarmarkText stroke="#fff" size={20} />}
          label="Documents"
        />
        <DashboardCard
          to="/dashboard/notifications"
          icon={notificationBadge}
          label="Notifications"
        />
        <DashboardCard
          to="/dashboard/settings"
          icon={<IoSettingsOutline size={20} />}
          label="Settings"
        />
        <DashboardCard
          to="/dashboard/logout"
          icon={<IoIosLogOut size={20} />}
          label="Logout"
          onClick={() => setIsLogoutModalOpen(true)}
        />
      </ul>
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
  );
}

export default HomePage;
