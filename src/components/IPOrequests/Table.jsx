import React, { useState } from "react";
import { formatNumber } from "../../firebaseConfig/firestore";

function Table({ ipoRequests, handleUpdateRequest }) {
  const [viewDetailId, setViewDetailId] = useState(null);

  const handleViewClick = (id) => {
    if (viewDetailId === id)
      setViewDetailId(null); // If the detail is already open, close it
    else setViewDetailId(id); // Open the detail of the clicked row
  };

  return (
    <div className="contain-table">
      {ipoRequests.length === 0 ? (
        <h5 style={{ textAlign: "center" }}>NO REQUEST FOUND.</h5>
      ) : (
        <>
          <table className="striped-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Amount</th>
                <th>Status</th>
                <th colSpan={3} className="text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <>
              {ipoRequests.map((request, index) => (
                <tbody key={index}>
                  <tr>
                    <td>{request.userName}</td>
                    <td>${formatNumber(request.amountInvested)}</td>
                    <td>{request.status}</td>
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
                    <td className="text-center">
                      <button
                        className="button muted-button"
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
                    <td className="text-left">
                      {" "}
                      {viewDetailId === request.id ? (
                        <button onClick={() => handleViewClick(request.id)}>
                          Close
                        </button>
                      ) : (
                        <button onClick={() => handleViewClick(request.id)}>
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                  {viewDetailId === request.id && (
                    <tr>
                      <td colSpan={5}>
                        <div className="dropdown_col">
                          <div className="dropdown_row">
                            <p className="bold_text">
                              Expected Listing Price :
                            </p>
                            <span className="reg_text">
                              $ {formatNumber(request.expListingPrice)}{" "}
                            </span>
                          </div>
                          <div className="dropdown_row">
                            <p className="bold_text">Expected Date :</p>
                            <span className="reg_text">
                              {" "}
                              {request.expectedDate}{" "}
                            </span>
                          </div>
                          <div className="dropdown_row">
                            <p className="bold_text">Share Price :</p>
                            <span className="reg_text">
                              $ {formatNumber(request.sharePrice)}{" "}
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              ))}
            </>
          </table>
        </>
      )}
    </div>
  );
}

export default Table;
