import React, { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  doc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import "./style.css";
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
// import UserOverview from "../UserManagement"

export default function UserRequest() {
  const [userRequests, setUserRequests] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserRequests = async () => {
      const querySnapshot = await getDocs(collection(db, "admin-requests"));
      setUserRequests(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };

    fetchUserRequests();
  }, []);

  const handleApproval = async (userId, requestData) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        requestData.email,
        requestData.password
      );
      const userRef = collection(db, "users");
      await addDoc(userRef, {
        uid: userCredential.user.uid,
        fullName: requestData.fullName,
        email: requestData.email,
        address: requestData.address,
        mobilePhone: requestData.mobilePhone,
      });
      await deleteDoc(doc(db, "admin-requests", userId));
      setSuccessMessage("User approved successfully.");
    } catch (error) {
      console.error("Error approving user:", error);
      setError("Error approving user: " + error.message);
      setTimeout(() => {
        setError("");
        }, 4000);

    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = async (userId) => {
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, "admin-requests", userId));
      setSuccessMessage("User declined successfully.");
      setTimeout(() => {
        setSuccessMessage("");
        }, 3000);
    } catch (error) {
      console.error("Error declining user:", error);
      setError("Error declining user");
        setTimeout(() => {
            setError("");
        }, 4000);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="adminDash_page">
      <div className="section_header">
        <h2>Admin Dashboard</h2>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="180"
            height="9"
            viewBox="0 0 230 9"
            >
            <rect
              id="Rectangle_28"
              data-name="Rectangle 28"
              width="230"
              height="9"
              rx="4.5"
              fill="#688fb7"
              ></rect>
          </svg>
        </div>
              {
                  isLoading && <p className="spinner"></p>
              }
      </div>
      {
        userRequests.length === 0 && <p className="no_requests">No user requests at this time.</p>
      }
      <ul className="user_list">
        {userRequests.map((user) => (
          <li className="user" key={user.id}>
            <p className="user_name">
              <span className="name_label">Name:</span>{" "}
              <span className="name_value">{user.fullName}</span>
            </p>
            <p className="user_name">
              <span className="name_label">Email:</span>{" "}
              <span className="name_value"> {user.email} </span>
            </p>
            <p className="user_name">
              <span className="name_label">Phone:</span>{" "}
              <span className="name_value"> {user.mobilePhone} </span>
            </p>
            <p className="user_name">
              <span className="name_label">Address:</span>{" "}
              <span className="name_value"> {user.address} </span>
            </p>
            {
                error && <p className="error_msg">{error}</p>
            }
            {
                successMessage && <p className="success_msg">{successMessage}</p>
            }
            <button
              className="approve_btn"
              onClick={() => handleApproval(user.id, true)}
            >
              Approve
            </button>
            <button
              className="decline_btn"
              onClick={() => handleDecline(user.id, false)}
            >Decline
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
