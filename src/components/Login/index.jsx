import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/white_logo.png";
import {
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import "./style.css";

const Login = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (pass) => {
    const regex = /^(?=.*\d)[\w]{8,}$/;
    return regex.test(pass);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard");
      } else {
        // User is not authenticated
        console.error("No user logged in");
      }
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [auth]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await setPersistence(auth, browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setIsLoading(false);
      navigate("/dashboard");
      
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
            <button className="signin_btn" type="submit">
              <div className="spinner"></div>
            </button>
          ) : (
            <button className="signin_btn" type="submit">
              Sign In
            </button>
          )}

          <div className="signup_info">
            <p className="text">Do not have an account?</p>{" "}
            <Link to={"/signup"} className="signup_text">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
