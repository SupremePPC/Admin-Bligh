import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from "../../firebaseConfig/firebase";
import logo from "../../assets/white_logo.png";
import "./style.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user has admin role
        const userRef = doc(db, 'adminUsers', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().role === 'admin') {
          navigate("/dashboard");
        } else {
          setError("Unauthorized access!");
        }
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await setPersistence(auth, browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoading(false);
      // Navigation happens in useEffect after verifying admin role

    } catch (error) {
      console.error("Error during login:", error);
      setError(error.message);
      setIsLoading(false);
      setTimeout(() => {
        setError("");
      }, 4000);
    }
  };

  return (
    <section className="login_container">
      <div className="login_form">
        <img src={logo} alt="Logo" className="logo" />
        <div className="header">
          <h1 className="title">Sign In</h1>
          <p className="subtitle">
            To keep connected with us please login with your personal info.
          </p>
        </div>
        <form className="form_wrap" onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input_field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input_field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex">
            <Link to="/forgot-password" className="forgot_password">
              Forgot password?
            </Link>
          </div>
          {error && <p className="error_msg">{error}</p>}
          {isLoading ? (
            <button className="signin_btn" type="submit" disabled>
              <div className="spinner"></div>
            </button>
          ) : (
            <button className="signin_btn" type="submit">
              Sign In
            </button>
          )}
        </form>
      </div>
    </section>
  );
};

export default Login;
