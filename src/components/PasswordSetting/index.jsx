import React, { useEffect, useState } from "react";
import {
  fetchPasswordPolicySetting,
  updatePasswordPolicySetting,
} from "../../firebaseConfig/firestore";
import "./style.css";

export default function PasswordSetting() {
  const [strongPasswordPolicy, setStrongPasswordPolicy] = useState(true);

  useEffect(() => {
    fetchPasswordPolicySetting()
      .then((isStrong) => {
        setStrongPasswordPolicy(isStrong);
      })
      .catch((error) => {
        console.error("Error fetching password policy:", error);
      });
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
  return (
    <div className="passwordSetting_section">
      <div className="section_header">
        <h2 className="title">Password Settings</h2>
        <p className="password_label">
          Change the password policy for the client app by toggling the switch
          below.
        </p>
      </div>
      <div className="form_group">
        <label>Enforce Strong Passwords:</label>
        <input
          type="checkbox"
          checked={strongPasswordPolicy}
          onChange={togglePasswordPolicy}
        />
      </div>
    </div>
  );
}
