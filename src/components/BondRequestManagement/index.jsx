import { useEffect, useState } from "react";
import {
  addBondToUserHoldings,
  addNotification,
  deleteRequestFromFirestore,
  fetchRequestData,
  getBondRequests,
  handleBuyApproval,
  handleSellApproval,
  updateRequestStatusInFirestore,
} from "../../firebaseConfig/firestore";
import LoadingScreen from "../LoadingScreen";
import Table from "./Table";
import { db } from "../../firebaseConfig/firebase";
import { getDoc, doc } from "firebase/firestore";
import Header from "./Header";
import Swal from "sweetalert2";
import "./style.css";

const BondsRequestTable = () => {
  const [bondRequests, setBondRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateRequest = async (userId, requestId, newStatus) => {
    try {
      setIsLoading(true);

      // Fetching the request data
      const requestData = await fetchRequestData(userId, requestId);

      // Update the request status in Firestore
      await updateRequestStatusInFirestore(userId, requestId, newStatus);

      let message;
      if (newStatus === "Approved") {
        // If the request is approved, handle buying or selling approval
        if (requestData.typeOfRequest === "buy") {
          await handleBuyApproval(userId, requestData);
          message = `Your bond request to buy $${requestData.amountRequested} worth of bonds has been approved.`;
          // Add bond to user's holdings
          await addBondToUserHoldings(userId, requestData);
        } else if (requestData.typeOfRequest === "sell") {
          await handleSellApproval(userId, requestData);
          message = `Your bond request to sell $${requestData.amountRequested} worth of bonds has been approved.`;
          // Add bond to user's holdings
          await addBondToUserHoldings(userId, requestData);
        }
      } else { // Assuming that newStatus here can only be "Approved" or "Declined"
        // Handle declined request
        if (requestData.typeOfRequest === "buy") {
          message = `Your bond request to buy $${requestData.amountRequested} worth of bonds has been declined.`;
        } else if (requestData.typeOfRequest === "sell") {
          message = `Your bond request to sell $${requestData.amountRequested} worth of bonds has been declined.`;
        }
      }

      // Delete the request from Firestore regardless of whether it's declined or approved
      await deleteRequestFromFirestore(userId, requestId);

      // Refresh the table data
      const allRequests = await getBondRequests();
      setBondRequests(allRequests);

      if (message) {
        await addNotification(userId, message, newStatus);
      }

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `Request status has been updated to ${newStatus}.`,
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (err) {
      console.error("Error updating request:", err);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Error updating request: ${err}`,
        showConfirmButton: true,
        timer: 2000,
      });
    } finally {
      setIsLoading(false);
    }
};

  useEffect(() => {
    const fetchBondRequests = async () => {
      try {
        setIsLoading(true);
        const allRequests = await getBondRequests();
  
        if (allRequests.length === 0) {
          setNoRequestsFound(true);
        } else {
          const requestsWithUserDetails = await Promise.all(
            allRequests.map(async (request) => {
              const userDoc = await getDoc(doc(db, "users", request.userId));
              const userDetails = userDoc.data();
              return { ...request, userName: userDetails.fullName };
            })
          );
          setBondRequests(requestsWithUserDetails);
        }
      } catch (error) {
        console.error("Error fetching request:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchBondRequests();
  }, []);
  
  return (
    <div className="container">

      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Header />
          <Table
            bondRequests={bondRequests}
            handleUpdateRequest={handleUpdateRequest}
          />
        </>
      )}
    </div>
  );
};

export default BondsRequestTable;
