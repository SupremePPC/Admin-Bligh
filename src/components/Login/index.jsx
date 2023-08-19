import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/white_logo.png";
import {
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import "./style.css";
import { auth, db } from "../../firebase/firebase";

const Login = () => {
  
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("qwerty");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (pass) => {
    // Check if the password is at least 8 characters long and contains at least one number
    const regex = /^(?=.*\d)[\w]{8,}$/;
    return regex.test(pass);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is still authenticated
        console.log("User still logged in with ID:", user.uid);
        navigate("/");
      } else {
        // User is not authenticated
        console.log("No user logged in");
      }
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [auth]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long and contain at least one number."
      );
      setIsLoading(false);
      setTimeout(() => {
        setError("");
      }, 4000); 
      return;
    }
  
    try {
      await setPersistence(auth, browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      console.log("Logged in user's UID:", user.uid);
  
      // Check if the user's UID already exists in the users collection
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        // If UID doesn't exist in the users collection, this means user isn't registered
        setError("User not found. Please sign up.");
        setIsLoading(false);
        setTimeout(() => {
          setError("");
        }, 4000);
        return;
      }
  
      setIsLoading(false); // Set loading to false after successful authentication
      navigate("/");
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
