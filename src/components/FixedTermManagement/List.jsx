import React, { useState } from "react";

export default function List({ fixedTerms, handleDelete, handleEditClick }) {
  const [visibleDropdownIndex, setVisibleDropdownIndex] = useState(null);

  const toggleDropdown = (index) => {
    if (visibleDropdownIndex === index) {
      setVisibleDropdownIndex(null); // if clicked again on the open dropdown, close it
    } else {
      setVisibleDropdownIndex(index); // open the clicked dropdown and close any other open dropdown
    }
  };

  return (
    <div className="fixedTermsContainer">
      <div className="contentSection">
        {fixedTerms.length === 0 && <h5>No Fixed Term Deposits Found.</h5>}
        {fixedTerms.map((fixedTerm, index) => (
          <div
            key={index}
            className="termCard"
            onClick={() => toggleDropdown(index)}
          >
            <div className="termDetails">
              <div className="termColumn">
                <div className="bankLogoWrapper">
                  <img src={fixedTerm.logo} alt="" />
                </div>
                <div className="columnDetails">
                  <div className="bankDetails">
                    <p className="bankName"> {fixedTerm.bankName} </p>
                    <div className="termTypeWrapper">
                      {/* Term details could go here */}
                    </div>
                  </div>
                  <div className="additionalDetails">
                    <div className="termRow">
                      <p className="boldText">Term:</p>
                      <span className="regularText"> {fixedTerm.term} </span>
                    </div>
                    <div className="financialDetails">
                        <p className="boldText">Principal Amount:</p>
                        <span className="regularText">
                          $ {fixedTerm.minAmount}
                        </span>
                    </div>
                  </div>
                  <div className="interestDetails">
                    <div className="interestWrapper">
                      <div className="interestRate">
                        <span className="interestNumber">
                          {" "}
                          {fixedTerm.interestRate}{" "}
                        </span>
                        <span className="percentageSymbol">%</span>
                      </div>
                      <span className="regularText">Interest Rate</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`termDropdown ${
                visibleDropdownIndex === index ? "show" : ""
              }`}
            >
              <div className="dropdownColumn">
                <div className="actionButtonsWrapper">
                  <input
                    type="submit"
                    value="Delete Fixed Term"
                    onClick={() => handleDelete(fixedTerm.id)}
                  />
                  <input
                    style={{ marginLeft: "12px" }}
                    className="editButton"
                    type="button"
                    value="Edit Fixed Term"
                    onClick={() => handleEditClick(fixedTerm)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
