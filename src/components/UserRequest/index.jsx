import React, { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Header from "./Header";
import Table from "./Table";
import "./style.css";

export default function UserRequest() {
  const [userRequests, setUserRequests] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isRejected, setIsRejected] = useState(false);

  useEffect(() => {
    const fetchUserRequests = async () => {
      const adminDashRef = collection(db, "adminDash");
      const adminDocs = await getDocs(adminDashRef);

      let allUserRequests = [];

      for (const doc of adminDocs.docs) {
        const userRequestsRef = collection(
          db,
          "adminDash",
          doc.id,
          "userRequests"
        );
        const userRequestsSnapshot = await getDocs(userRequestsRef);
        const requests = userRequestsSnapshot.docs.map((userDoc) => ({
          ...userDoc.data(),
          id: userDoc.id,
          uid: doc.id,
        }));
        allUserRequests = allUserRequests.concat(requests);
      }

      setUserRequests(allUserRequests);
    };

    fetchUserRequests();
  }, []);

  useEffect(() => {
    console.log("Updated userRequests:", userRequests);
  }, [userRequests]);

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
      await deleteDoc(
        doc(db, "adminDash", requestData.uid, "userRequests", userId)
      );
      // Remove the user request from the state
      setUserRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== userId)
      );
      setSuccessMessage("User approved successfully.");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("The email is already in use. Please use a different email.");
      } else {
        console.error("Error approving user:", error);
        setError("Error approving user: " + error.message);
      }
      setTimeout(() => {
        setError("");
      }, 4000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejection = async (userId, requestData) => {
    setIsLoading(true);
    console.log("UID:", requestData.uid);
    console.log("User Request ID:", userId);

    try {
      const userRequestDocRef = doc(
        db,
        "adminDash",
        requestData.uid,
        "userRequests",
        userId
      );

      const userDocRef = doc(db, "adminDash", requestData.uid);
      console.log("userDocRef:", userDocRef);
      // First, delete the specific user request from the userRequests sub-collection.
      await deleteDoc(userRequestDocRef);
      console.log("userRequestDocRef:", userRequestDocRef);

      setUserRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== userId)
      );

      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        await deleteDoc(userDocRef);
      }
      setSuccessMessage("User request rejected and removed successfully.");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error rejecting and removing user:", error);
      setError("Error rejecting and removing user");
      setTimeout(() => {
        setError("");
      }, 4000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      {!isApproved && !isRejected && (
        <>
          <Header />
          <Table
            userRequests={userRequests}
            handleApproval={handleApproval}
            handleRejection={handleRejection}
            isApproved={isApproved}
            isRejected={isRejected}
            setIsApproved={setIsApproved}
            setIsRejected={setIsRejected}
          />
        </>
      )}
    </div>
  );
}
