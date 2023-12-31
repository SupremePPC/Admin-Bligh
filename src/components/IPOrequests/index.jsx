import { useEffect, useState } from "react";
import {
getSpecificIpoRequest,
  deleteIposRequestStatus,
  getIposRequests,
  handleIpoApproval,
  handleIpoDecline,
} from "../../firebaseConfig/firestore";
import LoadingScreen from "../LoadingScreen";
import Table from "./Table";
import { db } from "../../firebaseConfig/firebase";
import { getDoc, doc } from "firebase/firestore";
import Header from "./Header";
import Swal from "sweetalert2";

const IposRequestPage = () => {
  const [ipoRequests, setIpoRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchIpoRequests = async () => {
    try {
      setIsLoading(true);
      const allRequests = await getIposRequests();
      const requestsWithUserDetails = await Promise.all(
        allRequests.map(async (request) => {
          const userDoc = await getDoc(doc(db, "users", request.userId));
          if (userDoc.exists()) {
            const userDetails = userDoc.data();
            return { ...request, userName: userDetails.fullName };
          } else {
            // Handle the case where the user document doesn't exist
            return { ...request, userName: "Unknown User" };
          }
        })
      );
      setIpoRequests(requestsWithUserDetails);
    } catch (error) {
      console.error("Error fetching request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIpoRequests();
  }, []);

  const handleUpdateRequest = async (userId, requestId, newStatus) => {
    try {
      setIsLoading(true);
      // Fetch the full request data from Firestore using requestId
      const requestData = await getSpecificIpoRequest(requestId, userId);
      if (newStatus === "Approved") {
        await handleIpoApproval(userId, requestId, requestData);
      } else if (newStatus === "Declined") {
        await handleIpoDecline(userId, requestId);
      }
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `Request status has been updated to ${newStatus}.`,
        showConfirmButton: false,
        timer: 2000,
      });
      await deleteIposRequestStatus (userId, requestId);
      
      // Reload IPO Requests
      const allRequests = await getIposRequests();
      setIpoRequests(allRequests);
      fetchIpoRequests();
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
      {isLoading && (
        <LoadingScreen />
      )}
          <Header />
          <Table
            ipoRequests={ipoRequests}
            handleUpdateRequest={handleUpdateRequest}
          />
    </div>
  );
};

export default IposRequestPage;
