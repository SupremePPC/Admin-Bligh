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
                    <td className="text-left">
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
                    <td>
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
                            <p className="bold_text">Issuer Name :</p>
                            <span className="reg_text">
                              {" "}
                              {request.issuerName}{" "}
                            </span>
                          </div>
                          <div className="dropdown_row">
                            <p className="bold_text">Sector :</p>
                            <span className="reg_text"> {request.sector} </span>
                          </div>
                          <div className="dropdown_row">
                            <p className="bold_text">Company Website :</p>
                            <span className="reg_text">
                              {" "}
                              {request.companyWebsite}{" "}
                            </span>
                          </div>
                          <div className="dropdown_row">
                            <p className="bold_text">ISIN :</p>
                            <span className="reg_text"> {request.isin} </span>
                          </div>
                          {/* <div className="dropdown_row">
                            <p className="bold_text">Ticker :</p>
                            <span className="reg_text"> {request.ticker} </span>
                          </div> */}
                          <div className="dropdown_row">
                            <p className="bold_text">Coupon Frequency :</p>
                            <span className="reg_text">
                              {" "}
                              {request.couponFrequency}{" "}
                            </span>
                          </div>
                          <div className="dropdown_row">
                            <p className="bold_text">
                              Minimum Investment Amount :
                            </p>
                            <span className="reg_text">
                              $ {request.minimumAmount}{" "}
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
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
