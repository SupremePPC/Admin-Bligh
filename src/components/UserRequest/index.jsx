import React, { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebaseConfig/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import Header from "./Header";
import Table from "./Table";
import "./style.css";
import Modal from "../CustomsModal";
import LoadingScreen from "../LoadingScreen";
import Swal from "sweetalert2";

export default function UserRequest() {
  const [userRequests, setUserRequests] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [pendingRequestData, setPendingRequestData] = useState(null); // Store data of the request being processed

  //FETCH USER REQUESTS
  useEffect(() => {
    const fetchUserRequests = async () => {
      try {
        const adminDashRef = collection(db, "admin_users");
        const adminDocs = await getDocs(adminDashRef);

        let allUserRequests = [];
        setIsLoading(true);
        for (const doc of adminDocs.docs) {
          const userRequestsRef = collection(
            db,
            "admin_users",
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
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching banking details:", error);
      }
    };
    fetchUserRequests();
  }, []);

  useEffect(() => {
  }, [userRequests]);

  //HANDLE APPROVAL
  const handleApproval = async (userId, requestData) => {
    setIsLoading(true);
    try {
      // Step 1: Create the user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        requestData.email,
        requestData.password
      );

      const user = userCredential.user;
      // Send email verification
      await sendEmailVerification(user);
  
      // Step 2: Use the User ID as the document ID in the 'users' collection
      const newUserId = userCredential.user.uid;
      await setDoc(doc(db, "users", newUserId), {
        fullName: requestData.fullName,
        email: requestData.email,
        address: requestData.address,
        mobilePhone: requestData.mobilePhone,
        country: requestData.country,
      });
  
      // Delete the admin request
      await deleteDoc(
        doc(db, "admin_users", requestData.uid, "userRequests", userId)
      );

      // Remove the user request from the state
      setUserRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== userId)
      );
  
      Swal.fire({
        icon: "success",
        title: "Approved!",
        text: `User request approved successfully.`,
        showConfirmButton: false,
        timer: 2000,
      });
  
      // After successfully adding the user to the 'users' collection:
      const mailRef = collection(db, "mail");
      await addDoc(mailRef, {
        to: requestData.email,
        message: {
          subject: "Signup Request Approved",
          html: `<p>Hello ${requestData.fullName},</p>
          <p>Your signup request has been approved! You can now log in using your credentials.</p>
          <p>Thank you for joining us!</p>`,
        },
      });
      // Delete the admin request document from 'admin_users' collection
      await deleteDoc(doc(db, "admin_users", requestData.uid, "userRequests", userId));
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("The email is already in use. Please use a different email.");
      } else {
        console.error("Error approving user:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Error approving user: ${error.message}`,
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRejection = async (userId, requestData) => {
    setIsLoading(true);
  
    try {
      const userRequestDocRef = doc(
        db,
        "admin_users",
        requestData.uid,
        "userRequests",
        userId
      );
  
      // First, delete the specific user request from the userRequests sub-collection.
      await deleteDoc(userRequestDocRef);
  
      setUserRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== userId)
      );
  
      Swal.fire({
        icon: "success",
        title: "Removed!",
        text: `User request rejected and removed successfully.`,
        showConfirmButton: false,
        timer: 2000,
      });
  
      const mailRef = collection(db, "mail");
      await addDoc(mailRef, {
        to: requestData.email,
        message: {
          subject: "Signup Request Rejected",
          html: `<p>Hello ${requestData.fullName},</p>
            <p>We regret to inform you that your signup request has been rejected. 
            If you believe this is an error or want to inquire further, please contact our support team.</p>
            <p>Thank you for your understanding!</p>`,
        },
      });
      Swal.fire({
        icon: "success",
        title: "Removed!",
        text: `User request rejected and removed successfully.`,
        showConfirmButton: false,
        timer: 2000,
      });
      // Delete the admin request document from 'admin_users' collection
      await deleteDoc(doc(db, "admin_users", requestData.uid, "userRequests", userId));
    } catch (error) {
      console.error("Error rejecting and removing user:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Error rejecting and removing user: ${error.message}`,
        showConfirmButton: false,
        timer: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="container">
      <Header />
      {isLoading && (
        <LoadingScreen />
      )}
        <Table
          userRequests={userRequests}
          handleApproval={(userId, requestData) => {
            setPendingRequestData({ userId, requestData });
            setIsApproved(true);
          }}
          handleRejection={(userId, requestData) => {
            setPendingRequestData({ userId, requestData });
            setIsRejected(true);
          }}
        />
      
      {isApproved && pendingRequestData && (
        <Modal
          isOpen={isApproved}
          onClose={() => setIsApproved(false)}
          title="Accept User Request"
          description="Are you sure you want to accept this user request?"
          onPositiveAction={() => {
            handleApproval(
              pendingRequestData.userId,
              pendingRequestData.requestData
            );
            setIsApproved(false);
            setPendingRequestData(null);
          }}
          positiveLabel="Accept"
          negativeLabel="Cancel"
        />
      )}

      {isRejected && pendingRequestData && (
        <Modal
          isOpen={isRejected}
          onClose={() => setIsRejected(false)}
          title="Reject User Request"
          description="Are you sure you want to reject this user request?"
          onPositiveAction={() => {
            handleRejection(
              pendingRequestData.userId,
              pendingRequestData.requestData
            );
            setIsRejected(false);
            setPendingRequestData(null);
          }}
          onNegativeAction={() => setIsRejected(false)}
          positiveLabel="Reject"
          negativeLabel="Cancel"
        />
      )}
    </div>
  );
}
