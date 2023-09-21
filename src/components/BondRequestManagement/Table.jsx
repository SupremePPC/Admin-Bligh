import React, { useEffect, useState } from "react";
import { updateRequestStatusInFirestore, getBondRequests } from "../../firebaseConfig/firestore";

function BondsRequestTable({bondRequests}) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Request ID</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bondRequests.map(({ userId, id, status }) => (
            <tr key={id}>
              <td>{userId}</td>
              <td>{id}</td>
              <td>{status}</td>
              <td>
                <button
                  onClick={() => handleUpdateRequest(userId, id, "Accepted")}
                >
                  Accept
                </button>
                <button
                  onClick={() => handleUpdateRequest(userId, id, "Declined")}
                >
                  Decline
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* {message && <div>{message}</div>}
      {error && <div>{error}</div>} */}
    </div>
  );
}

export default BondsRequestTable;
