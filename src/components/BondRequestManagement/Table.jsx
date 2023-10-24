import React, { useState } from "react";

function Table({ bondRequests, handleUpdateRequest }) {
  const [viewDetailId, setViewDetailId] = useState(null);

  const handleViewClick = (id) => {
    if (viewDetailId === id)
      setViewDetailId(null); // If the detail is already open, close it
    else setViewDetailId(id); // Open the detail of the clicked row
  };

  return (
    <div className="contain-table">
      {bondRequests.length === 0 ? (
        <h5 className="no_data">NO REQUEST FOUND.</h5>
      ) : (
        <>
          <table className="striped-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Type</th>
                <th colSpan={3} className="text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {bondRequests.map((request, index) => (
                <>
                  <tr key={index}>
                    <td>{request.userName}</td>
                    <td>${request.amountRequested}</td>
                    <td>{request.requestStatus}</td>
                    <td>{request.typeOfRequest}</td>
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
                    <tr>
                  {viewDetailId === request.id && (
                    <td colSpan={5}>
                      <div className="bonds_dropdownCol">
                        <div className="bonds_dropdownRow">
                          <p className="bonds_bold-text">Issuer Name :</p>
                          <span className="bonds_reg-text">
                            {request.issuerName}
                          </span>
                        </div>
                        <div className="bonds_dropdownRow">
                          <p className="bonds_bold-text">Sector :</p>
                          <span className="bonds_reg-text">{request.sector}</span>
                        </div>
                        <div className="bonds_dropdownRow">
                          <p className="bonds_bold-text">Company Website :</p>
                          <span className="bonds_reg-text">
                            {request.companyWebsite}
                          </span>
                        </div>
                        <div className="bonds_dropdownRow">
                          <p className="bonds_bold-text">ISIN :</p>
                          <span className="bonds_reg-text">{request.isin}</span>
                        </div>
                        <div className="bonds_dropdownRow">
                          <p className="bonds_bold-text">Coupon Frequency :</p>
                          <span className="bonds_reg-text">
                            {request.couponFrequency}
                          </span>
                        </div>
                        <div className="bonds_dropdownRow">
                          <p className="bonds_bold-text">Minimum Investment Amount :</p>
                          <span className="bonds_reg-text">
                            $ {request.minimumAmount}
                          </span>
                        </div>
                      </div>
                    </td>
                  )}
                  </tr>
                  
                </>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default Table;
