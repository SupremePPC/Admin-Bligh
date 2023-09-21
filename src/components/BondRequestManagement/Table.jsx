import React, { useState } from "react";
import { db } from "../../firebaseConfig/firebase";

function Table({ bondRequests, handleUpdateRequest }) {
  const [selectedRequest, setSelectedRequest] = useState(null);
  return (
    <div className="small-container">
      {!bondRequests ? (
        <h5>NO REQUEST FOUND.</h5>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                {/* <th>User ID</th> */}
                <th>User Name</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Request Type</th>
                <th colSpan={3} className="text-center">
              Actions
            </th>
              </tr>
            </thead>
            <tbody>
              {bondRequests.map((request) => (
                <tr key={request.id}>
                  {/* <td>{request.userId}</td> */}
                  <td>{request.userName}</td>
                  <td>{request.amountRequested}</td>
                  <td>{request.requestStatus}</td>
                  <td>{request.typeOfRequest}</td>
                  <td className="text-right">
                    <button
                      onClick={() =>
                        handleUpdateRequest(
                          request.userId,
                          request.id,
                          "Accepted"
                        )
                      }
                    >
                      Accept
                    </button>
                  </td>
                  <td className="text-left">
                    <button
                      onClick={() =>
                        handleUpdateRequest(
                          request.userId,
                          request.id,
                          "Declined"
                        )
                      }
                    >
                      Decline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedRequest && (
            <RequestDetailsModal
              request={selectedRequest}
              onClose={() => setSelectedRequest(null)}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Table;
