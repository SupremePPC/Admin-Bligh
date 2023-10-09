import React, {useState} from 'react';
import { FaAngleRight } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";

import "./style.css";
import ChangePassword from '../ChangePassword';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("changePassword");

    const handleTabClick = (tab) => {
      setActiveTab(tab);
    };
  
    return (
        <div className="container">

      <div className="account_layout">
        <div className="account_menu">
          <ul className="account_list">
            {/* <li
              className={`account_item ${
                activeTab === "accountInfo" ? "active" : ""
              }`}
              onClick={() => handleTabClick("accountInfo")}
            >
              <span>
                <GoPencil />
                Account Information
              </span>
              <FaAngleRight size={20}/>
            </li> */}
            <li
              className={`account_item ${
                activeTab === "changePassword" ? "active" : ""
              }`}
              onClick={() => handleTabClick("changePassword")}
            >
              <span>
                <RiLockPasswordFill />
                Change Password
              </span>
              <FaAngleRight size={20}/>
            </li>
            {/* <li
              className={`account_item ${
                activeTab === "documents" ? "active" : ""
              }`}
              onClick={() => handleTabClick("documents")}
            >
              <span>
                <IoNewspaperOutline className="icon" />
                Documents
              </span>
              <FaAngleRight size={20}/>
            </li>
            <li
              className={`account_item ${
                activeTab === "bankingDetails" ? "active" : ""
              }`}
              onClick={() => handleTabClick("bankingDetails")}
            >
              <span>
                <BsBank className="icon" />
                Banking Details
              </span>
              <FaAngleRight size={20}/>
            </li> */}
          </ul>
        </div>
  
        <div className="content__area">
          {activeTab === "changePassword" && <ChangePasswordTab />}
          {/* {activeTab === "accountInfo" && <AccountInfoTab />}
          {activeTab === "documents" && <DocumentsTab />}
          {activeTab === "bankingDetails" && <BankingDetailsTab />} */}
        </div>
      </div>
        </div>
    );
  }
  
  const ChangePasswordTab = () => {
    return <ChangePassword/>;
  };
  