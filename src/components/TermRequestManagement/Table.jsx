import React, { useState } from "react";
import { formatNumber } from "../../firebaseConfig/firestore";

function Table({ termRequests, handleUpdateRequest }) {
  return (
    <div className="contain-table">
      {termRequests.length === 0 ? (
        <h5 style={{ textAlign: "center" }}>NO REQUEST FOUND.</h5>
      ) : (
        <table className="striped-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Bank Name</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Type</th>
              <th colSpan={3} className="text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {termRequests.map((request, index) => (
              <tr key={index}>
                <td>{request.userName}</td>
                <td>{request.bankName}</td>
                <td>${formatNumber(request.principalAmount)}</td>
                <td>{request.status}</td>
                <td>{request.type}</td>
                <td className="text-right">
                  <button
                    onClick={() =>
                      handleUpdateRequest(
                        request.userId,
                        request.id,
                        "Approved"
                      )
                    }
                  >
                    Approve
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
      )}
    </div>
  );
}

export default Table;
