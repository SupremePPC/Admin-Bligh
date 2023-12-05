import React, { useEffect, useState } from "react";
import {
  fetchChatFeature,
  fetchPasswordPolicySetting,
  fetchToolsFeature,
  updateChatFeature,
  updatePasswordPolicySetting,
  updateToolsFeature,
} from "../../firebaseConfig/firestore";
import "./style.css";

export default function GeneralSetting() {
  const [strongPasswordPolicy, setStrongPasswordPolicy] = useState(true);
  const [isChatEnabled, setIsChatEnabled] = useState(false);
  const [isToolsEnabled, setIsToolsEnabled] = useState(false);

  const fetchPasswordSetting = async () => {
    try {
      const passwordPolicy = await fetchPasswordPolicySetting();
      setStrongPasswordPolicy(passwordPolicy);
    } catch (error) {
      console.error("Error fetching password policy:", error);
    }
  };

  const fetchChatSetting = async () => {
    try {
      const chatEnabled = await fetchChatFeature();
      setIsChatEnabled(chatEnabled);
    } catch (error) {
      console.error("Error fetching chat setting:", error);
    }
  };

  const fetchToolsSetting = async () => {
    try {
      const toolsEnabled = await fetchToolsFeature();
      setIsToolsEnabled(toolsEnabled);
    } catch (error) {
      console.error("Error fetching tools setting:", error);
    }
  };

  useEffect(() => {
    fetchPasswordSetting();
    fetchChatSetting();
    fetchToolsSetting();
  }, []);

  const togglePasswordPolicy = () => {
    const updatedValue = !strongPasswordPolicy;
    setStrongPasswordPolicy(updatedValue);

    updatePasswordPolicySetting(updatedValue)
      .then(() => {})
      .catch((error) => {
        console.error("Error updating password policy: ", error);
      });
  };

  const toggleChatFeature = () => {
    const updatedValue = !isChatEnabled;
    setIsChatEnabled(updatedValue);

    updateChatFeature(updatedValue)
      .then(() => {})
      .catch((error) => {
        console.error("Error updating chat feature: ", error);
      });
  };

  const toggleToolsFeature = () => {
    const updatedValue = !isToolsEnabled;
    setIsToolsEnabled(updatedValue);

    updateToolsFeature(updatedValue)
      .then(() => {})
      .catch((error) => {
        console.error("Error updating tools feature: ", error);
      });
  };

  return (
    <div className="passwordSetting_section">
      <div className="section_header">
        <h2 className="title">General Settings</h2>
        <p className="password_label">General Settings for the Client App</p>
      </div>
      <div className="form_group">
        <label>
          Change the password policy for the client app by toggling the switch:
        </label>
        <input
          type="checkbox"
          checked={strongPasswordPolicy}
          onChange={togglePasswordPolicy}
        />
      </div>
      <div className="form_group">
        <label>Change Chat Menu Visibilty for client app:</label>
        <input
          type="checkbox"
          checked={isChatEnabled}
          onChange={toggleChatFeature}
        />
      </div>
      <div className="form_group">
        <label>Change Tools Menu Visibilty for Client App:</label>
        <input
          type="checkbox"
          checked={isToolsEnabled}
          onChange={toggleToolsFeature}
        />
      </div>
    </div>
  );
}
