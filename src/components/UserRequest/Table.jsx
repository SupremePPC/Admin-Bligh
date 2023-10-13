import React, { useState } from "react";
import Modal from "../CustomsModal";

const Table = ({
  userRequests,
  handleApproval,
  handleRejection,
}) => {
  const firestoreTimestampToDate = (timestamp) => {
    return timestamp
      ? new Date(timestamp.seconds * 1000).toLocaleDateString()
      : "";
  };
  
  return (
    <div className="contain-table">
      <table className="striped-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Date</th>
            <th colSpan={2} className="text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {userRequests && userRequests.length > 0 ? (
            userRequests.map((user, i) => (
              <tr key={user.id}>
                <td>{i + 1}</td>
                <td>{user.fullName.split(" ")[0] || "N/A"}</td>
                <td>{user.fullName.split(" ")[1] || "N/A"}</td>
                <td>{user.email || "N/A"}</td>
                <td>{firestoreTimestampToDate(user.date) || "N/A"}</td>
                <td className="text-right">
                  <button
                    onClick={() => handleApproval(user.id, user)}
                    className="button accept_btn muted-button"
                  >
                    Accept
                  </button>
                </td>
                <td className="text-left">
                  <button
                    onClick={() => handleRejection(user.id, user)}
                    className="button reject_btn muted-button"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>No User Found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};


export default Table;
