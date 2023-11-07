import React, {useState} from 'react';
import { FaAngleRight } from "react-icons/fa";
import { BiImageAdd } from "react-icons/bi";
import { RiLockPasswordFill } from "react-icons/ri";
import ChangePassword from '../ChangePassword';
import ChangeLogo from '../ChangeLogo';
import "./style.css";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("changeLogo");

    const handleTabClick = (tab) => {
      setActiveTab(tab);
    };
  
    return (
        <div className="container">

      <div className="account_layout">
        <div className="account_menu">
          <ul className="account_list">
            <li
              className={`account_item ${
                activeTab === "changeLogo" ? "active" : ""
              }`}
              onClick={() => handleTabClick("changeLogo")}
            >
              <span>
                <BiImageAdd />
                Change Logo
              </span>
              <FaAngleRight size={20}/>
            </li>
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
          {activeTab === "changeLogo" && <ChangeLogo />}
          {/* {activeTab === "documents" && <DocumentsTab />}
          {activeTab === "bankingDetails" && <BankingDetailsTab />} */}
        </div>
      </div>
        </div>
    );
  }
  
  const ChangePasswordTab = () => {
    return <ChangePassword/>;
  };
  