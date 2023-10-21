import React, { useEffect, useState } from "react";
import LoadingScreen from "../LoadingScreen";
import "firebase/firestore";
import { getAllTerms } from "../../firebaseConfig/firestore";
import InvestTermModal from "./Modal/InvestTermModal";
import EditTermUser from "./Modal/EditTermModal";

const AddNewTerm = ({ userId, onClose, refreshDetails }) => {
  const [fixedTerms, setFixedTerm] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [termModalOpen, setTermModalOpen] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [selectedForEdit, setSelectedForEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [visibleDropdownIndex, setVisibleDropdownIndex] = useState(null);

  const fetchTerm = async () => {
    try {
      setIsLoading(true);
      const fetchedTerm = await getAllTerms();
      setFixedTerm(fetchedTerm);
    } catch (error) {
      console.error("Error fetching term:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTerm();
  }, []);

  const handleInvestSuccess = (investmentData, termId) => {
    setTermModalOpen(false);
    setIsEditing(true);
    setSelectedId(termId);
    setSelectedForEdit(investmentData);
  };

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
        {!fixedTerms ||
          (fixedTerms.length === 0 && (
            <h5 className="no_data">No Fixed Term Deposits Found.</h5>
          ))}
        {isLoading && <LoadingScreen />}

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
                  <input
                    type="submit"
                    value="Buy Fixed Term"
                    onClick={() => {
                      setTermModalOpen(true);
                      setSelectedTerm(fixedTerm);
                    }}
                  />
              </div>
            </div>
            {termModalOpen && (
                <InvestTermModal
                  onClose={() => {
                    setTermModalOpen(false);
                    setSelectedTerm(null);
                  }}
                  term={selectedTerm}
                  userId={userId}
                  onInvestSuccess={handleInvestSuccess}
                />
              )}
              {isEditing && (
                <EditTermUser
                  termId={selectedId}
                  term={selectedForEdit}
                  onClose={onClose}
                  userId={userId}
                  refreshDetails={refreshDetails}
                />
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddNewTerm;
