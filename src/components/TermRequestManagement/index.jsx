import { useEffect, useState } from "react";
import {
  addTermToUserCollection,
  addNotification,
  deleteFixedTermRequestStatus,
  getTermRequests,
  updateRequestStatusInFirestore,
  handleDepositApproval,
  handleWithdrawalApproval,
  updateFixedTermRequestStatus,
} from "../../../../admin-app/src/firebaseConfig/firestore";
import LoadingScreen from "../../../../admin-app/src/components/LoadingScreen";
import Table from "./Table";
import { db } from "../../../../admin-app/src/firebaseConfig/firebase";
import { getDoc, doc } from "firebase/firestore";
import Header from "./Header";
import Swal from "sweetalert2";

const TermsRequestTable = () => {
  const [termRequests, setTermRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTermRequests = async () => {
      try {
        setIsLoading(true);
        const allRequests = await getTermRequests();
        const requestsWithUserDetails = await Promise.all(
          allRequests.map(async (request) => {
            const userDoc = await getDoc(doc(db, "users", request.userId));
            const userDetails = userDoc.data();
            return { ...request, userName: userDetails.fullName };
          })
        );
        setTermRequests(requestsWithUserDetails);
      } catch (error) {
        console.error("Error fetching request:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTermRequests();
  }, []);

  const handleUpdateRequest = async (userId, requestId, newStatus) => {
    try {
        setIsLoading(true);
        
        // Fetching the request data
        const requestData = await getTermRequests(userId, requestId);
        const requestObject = requestData[0]; // Accessing the object inside the array
        
        let message;
        if (newStatus === "Approved") {
            if (requestObject.type === "deposit") {
                await handleDepositApproval(userId, requestObject);
                message = `Your fixed term deposit request to deposit €${requestObject.principalAmount} to ${requestObject.bankName} with ${requestObject.term} term and ${requestObject.coupon}% coupon has been approved.`;
                await addTermToUserCollection(userId, requestObject, newStatus);
            } else if (requestObject.type === "withdraw") {
                await handleWithdrawalApproval(userId, requestObject);
                message = `Your fixed term deposit request to withdraw €${requestObject.principalAmount} has been approved.`;
            }
        } else { // Assuming the newStatus here can only be "Approved" or "Declined"
            if (requestObject.type === "deposit") {
                message = `Your fixed term deposit request to deposit €${requestObject.principalAmount} has been declined.`;
            } else if (requestObject.type === "withdraw") {
                message = `Your fixed term deposit request to withdraw €${requestObject.principalAmount} has been declined.`;
            }
        }
        
        // Delete the request from Firestore and update the notifications
        await deleteFixedTermRequestStatus(userId, requestId);
        if (message) await addNotification(userId, message, newStatus);
        
        // Refresh the table data
        const allRequests = await getTermRequests();
        setTermRequests(allRequests);
        
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
        });
    } finally {
        setIsLoading(false);
    }
};
 
  return (
    <div className="container">
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Header />
          <Table
            termRequests={termRequests}
            handleUpdateRequest={handleUpdateRequest}
          />
        </>
      )}
    </div>
  );
};

export default TermsRequestTable;
