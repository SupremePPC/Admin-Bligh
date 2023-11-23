import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebaseConfig/firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import Header from "./Header";
import Table from "./Table";
import "./style.css";
import Modal from "../CustomsModal";
import LoadingScreen from "../LoadingScreen";
import Swal from "sweetalert2";
import { fetchUserRequests, handleUserApproval, handleUserRejection } from "../../firebaseConfig/firestore";

export default function UserRequest() {
  const [userRequests, setUserRequests] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [pendingRequestData, setPendingRequestData] = useState(null); // Store data of the request being processed

  //FETCH USER REQUESTS
 
  const handleFetch = async (db) => {
    setIsLoading(true);
    try {
      const requests = await handleFetch(db)(db);  // Assuming getUserRequests is the function that fetches data
      setUserRequests(requests);
    } catch (error) {
      console.error("Error fetching user requests:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    handleFetch(db);
  }, [db]);

  //HANDLE APPROVAL
  const handleApproval = async (userId, requestData) => {
    setIsLoading(true);
    try {
      await handleUserApproval(db, auth, userId, requestData);
      // Update UI based on the response
      fetchUserRequests();
      Swal.fire("Approved!", "User request approved successfully.", "success");
    } catch (error) {
      // Handle any errors
      console.error("Error approving user:", error);
      Swal.fire("Error", "Error approving user", "error");
    } finally {
      setIsLoading(false);
    }
  };
  
  //HANDLE REJECTION
  const handleRejection = async (userId, requestData) => {
    setIsLoading(true);
    try {
      await handleUserRejection(db, userId, requestData);
      // Update UI based on the response
      Swal.fire("Removed!", "User request rejected and removed successfully.", "success");

    } catch (error) {
      // Handle any errors
      console.error("Error rejecting user:", error);
      Swal.fire("Error", "Error rejecting user", "error");
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
