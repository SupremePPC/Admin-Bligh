import { useEffect, useState } from "react";
import { getBondRequests } from "../../firebaseConfig/firestore";

const BondsRequestTable = () => {
  const [bondRequests, setBondRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpdateRequest = async (userId, requestId, newStatus) => {
    try {
      // Update the request status in Firestore
      await updateRequestStatus(userId, requestId, newStatus);
  
      // Update UI
      setMessage(`Request status updated to ${newStatus}`);
  
      // Refresh the table data
      const allRequests = await getBondRequests();
      setBondRequests(allRequests);
  
    } catch (err) {
      console.error("Error updating request:", err);
      setError("Failed to update request status");
    }
  };

  useEffect(() => {
    const fetchBondRequests = async () => {
      try {
        setIsLoading(true);
        const allRequests = await getBondRequests();

        setBondRequests(allRequests);
        console.log(allRequests)
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching request:", error);
        setIsLoading(false);
      }
    };

    fetchBondRequests();
  }, []);

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>User Name</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bondRequests.map((request) => (
              <tr key={request.id}>
                <td>{request.userId}</td>
                <td>{request.userName}</td>
                <td>{request.amount}</td>
                <td>{request.status}</td>
                <td>
                  <button onClick={() => handleUpdateRequest(request.userId, request.id, "Accepted")}>
                    Accept
                  </button>
                  <button onClick={() => handleUpdateRequest(request.userId, request.id, "Declined")}>
                    Decline
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {message && <div>{message}</div>}
      {error && <div>{error}</div>}
    </div>
  );
};

export default BondsRequestTable;
