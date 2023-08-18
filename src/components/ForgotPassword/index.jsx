import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import logo from '../../assets/white_logo.png';
import { auth } from '../../firebase/firebase';
import './style.css';

export default function ForgotPassword () {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = (e) => {
    e.preventDefault();
    setIsLoading(true);

    sendPasswordResetEmail(auth, email)
      .then(() => {
        setMessage("Password reset email sent. Please check your inbox.");
        setTimeout(() => {
            setMessage("");
        }, 5000);
        setIsLoading(false);
        navigate('/');
      })
      .catch((error) => {
        setError("Error sending password reset email. Please try again.");
        setTimeout(() => {
            setError("");
        }, 5000);
        setIsLoading(false);
        console.log(error);
      });
  };

  return (
    <section className="forgotPassword_page">
      <div className="forgotPassword_form">
        <img src={logo} alt="Logo" className="logo" />
        <div className="header">
          <h1 className="title">Forgot Password</h1>
          <p className="subtitle">
            Please enter your email address to reset your password.
          </p>
        </div>
        <form className="form_wrap" onSubmit={handleResetPassword}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input_field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {isLoading ? (
            <button className="reset_btn" type="submit">
              <div className="spinner"></div>
            </button>
          ) : (
            <button className="reset_btn" type="submit">
              Reset Password
            </button>
          )}

          <div className="password_info">
            {message && <p className="success_msg">{message}</p>}
            {error && <p className="error_msg">{error}</p>}
            <p className="text">Remembered your password?{" "}
              <Link to={"/"} className="login_text">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
