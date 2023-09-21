import { useEffect, useState } from "react";
import { getBondRequests } from "../../firebaseConfig/firestore";
import LoadingScreen from "../LoadingScreen"
import Table from "./Table";

const BondsRequestTable = () => {
  const [bondRequests, setBondRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpdateRequest = async (
    userId,
    requestId,
    requestData,
    newStatus
  ) => {
    try {
      setIsLoading(true);

      // Update the request status in Firestore
      await updateRequestStatusInFirestore(userId, requestId, newStatus);

      if (newStatus === "approved") {
        // If the request is approved, handle buying or selling approval
        if (requestData.type === "buy") {
          await handleBuyApproval(userId, requestData.bondData);
        } else if (requestData.type === "sell") {
          await handleSellApproval(userId, requestData.bondData);
        }
      }

      // Delete the request from Firestore if it's declined or approved
      await deleteRequestFromFirestore(userId, requestId);

      // Refresh the table data
      const allRequests = await getBondRequests();
      setBondRequests(allRequests);
      console.log(allRequests)
      setMessage(`Request status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating request:", err);
      setError("Failed to update request status");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchBondRequests = async () => {
      try {
        setIsLoading(true);
        const allRequests = await getBondRequests();

        setBondRequests(allRequests);
        console.log(allRequests);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching request:", error);
        setIsLoading(false);
      }
    };

    fetchBondRequests();
  }, []);

  return (
    <div className="container">
      {message && <div>{message}</div>}
      {error && <div>{error}</div>}
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Table
          bondRequests={bondRequests}
          handleUpdateRequest={handleUpdateRequest}
        />
      )}
    </div>
  );
};

export default BondsRequestTable;
