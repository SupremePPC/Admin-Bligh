import { useState } from "react";
import { getAuth, updatePassword } from "firebase/auth";
import "./style.css";

export default function ChangePassword () {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [requiresReauth, setRequiresReauth] = useState(false);

  const validatePassword = (pass) => {
    const regex = /^(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(pass);
  };


  const handleChangePassword = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setTimeout(() => {
        setError("")
      }, 3000);
      return;
    }

    if (!validatePassword(newPassword)) {
      setError(
        "Password must be at least 8 characters long, must contain at least one number and a special character."
      );
      setTimeout(() => {
        setError("")
      }, 3000);
      return;
    }

    setIsLoading(true);

    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      updatePassword(user, newPassword)
        .then(() => {
          setSuccessMessage("Password updated successfully!");
          setTimeout(() => {
            setSuccessMessage("");
          }, 3000);
        })
        .catch((error) => {
          if (error.code === "auth/requires-recent-login") {
            setRequiresReauth(true);
            setError("Please login to change your password.");
            setTimeout (() => {
              setError("")
            }, 3000);
          } else {
            setError(error.message);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <section className="changePassword_section">
      <div className="section_header">
        <h2 className="title">Change Password</h2>
      </div>

      <form onSubmit={handleChangePassword} className="info_form">
        <label htmlFor="password" className="password_label">
          Password must be at least 8 characters long
        </label>

        <div className="input_group">
          <label htmlFor="new_password">New Password:</label>
          <input
            type="password"
            name="new_password"
            className="input_field"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="input_group">
          <label htmlFor="confirm_password">Confirm Password:</label>
          <input
            type="password"
            name="confirm_password"
            className="input_field"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && <p className="error_msg">{error}</p>}
        {successMessage && <p className="success_msg">{successMessage}</p>}
        {isLoading ? (
          <button className="submit_btn" disabled>
            <div className="spinner"></div>
          </button>
        ) : (
          <button className="submit_btn">Update Account</button>
        )}
      </form>
    </section>
  );
}
