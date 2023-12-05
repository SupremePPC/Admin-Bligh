import React, {useState} from 'react';
import { FaAngleRight } from "react-icons/fa";
import { BiImageAdd } from "react-icons/bi";
import { RiLockPasswordLine } from "react-icons/ri";
import { PiPassword } from "react-icons/pi";
import { MdDescription } from "react-icons/md"
import ChangePassword from '../ChangePassword';
import ChangeLogo from '../ChangeLogo';
import GeneralSetting from '../GeneralSetting';
import "./style.css";
import ChangeMetaData from '../ChangeMeta';

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
                activeTab === "changeMeta" ? "active" : ""
              }`}
              onClick={() => handleTabClick("changeMeta")}
            >
              <span>
                <MdDescription className="icon" />
                Change Meta
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
                <RiLockPasswordLine />
                Change Password
              </span>
              <FaAngleRight size={20}/>
            </li>
             <li
              className={`account_item ${
                activeTab === "generalSetting" ? "active" : ""
              }`}
              onClick={() => handleTabClick("generalSetting")}
            >
              <span>
                <PiPassword className="icon" />
                General Setting
              </span>
              <FaAngleRight size={20}/>
            </li>
           
          </ul>
        </div>
  
        <div className="content__area">
          {activeTab === "changeLogo" && <ChangeLogo />}
          {activeTab === "changeMeta" && <ChangeMetaData />}
          {activeTab === "changePassword" && <ChangePasswordTab />}
          {activeTab === "generalSetting" && <GeneralSetting />}
          {/* 
          {activeTab === "bankingDetails" && <BankingDetailsTab />} */}
        </div>
      </div>
        </div>
    );
  }
  
  const ChangePasswordTab = () => {
    return <ChangePassword/>;
  };
  