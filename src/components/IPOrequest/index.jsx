import { useEffect, useState } from "react";
import {
//   addIposToUserCollection,
  addNotification,
//   deleteIposRequestStatus,
  getIposRequests,
  handleIpoApproval,
  handleIpoDecline,
} from "../../firebaseConfig/firestore";
import LoadingScreen from "../../components/LoadingScreen";
import Table from "./Table";
import { db } from "../../firebaseConfig/firebase";
import { getDoc, doc } from "firebase/firestore";
import Header from "./Header";
import Swal from "sweetalert2";

const IposRequestPage = () => {
  const [ipoRequests, setIpoRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchIpoRequests = async () => {
      try {
        setIsLoading(true);
        const allRequests = await getIposRequests();
        const requestsWithUserDetails = await Promise.all(
          allRequests.map(async (request) => {
            const userDoc = await getDoc(doc(db, "users", request.userId));
            const userDetails = userDoc.data();
            return { ...request, userName: userDetails.fullName };
          })
        );
        setIpoRequests(requestsWithUserDetails);
      } catch (error) {
        console.error("Error fetching request:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIpoRequests();
  }, []);

  const handleUpdateRequest = async (userId, requestId, newStatus) => {
    try {
      setIsLoading(true);

      if (newStatus === "Approved") {
        await handleIpoApproval(userId, requestId);
      } else if (newStatus === "Declined") {
        await handleIpoDecline(userId, requestId);
      }
      
      // Refresh the table data
      const allRequests = await getIposRequests();
      setIpoRequests(allRequests);
      
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
            ipoRequests={ipoRequests}
            handleUpdateRequest={handleUpdateRequest}
          />
        </>
      )}
    </div>
  );
};

export default IposRequestPage;
