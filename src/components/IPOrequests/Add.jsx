import React, { useEffect, useState } from "react";
import "firebase/firestore";
import { formatNumber, getAllIpos } from "../../firebaseConfig/firestore";
import LoadingScreen from "../LoadingScreen";
import InvestIpoModal from "./Modals/InvestModal";
import EditIposUser from "./Modals/EditModal";

const AddUserIpos = ({ userId, onClose }) => {
  const [ipos, setIpos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [iposModalOpen, setIposModalOpen] = useState(false);
  const [selectedIpo, setSelectedIpo] = useState(null);
  const [selectedForEdit, setSelectedForEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchIpos = async () => {
    try {
      setIsLoading(true);
      const fetchedIpos = await getAllIpos();
      setIpos(fetchedIpos);
    } catch (error) {
      console.error("Error fetching ipos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIpos();
  }, []);

  const handleInvestSuccess = (investmentData, iposId) => {
    setIposModalOpen(false);
    setIsEditing(true);
    setSelectedId(iposId);
    setSelectedForEdit(investmentData);
  };

  return (
    <div className="iposPage_Wrapper">
      <div className="headerSection">
        <h2 className="title">Choose IPOs</h2>
        <div className="svgWrapper">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="180"
            height="9"
            viewBox="0 0 230 9"
          >
            <rect
              id="Rectangle_28"
              data-name="Rectangle 28"
              width="230"
              height="9"
              rx="4.5"
              fill="#688fb7"
            ></rect>
          </svg>
        </div>
      </div>
      <div className="contentBody">
        {ipos.length === 0 && <h5>No IPOs Available.</h5>}
        {isLoading && (
          <LoadingScreen />
        )}
        {!isLoading && (
          ipos.map((ipo, index) => (
            <div key={index} className="ipoCard">
              <div className="ipoDetails">
                <div className="ipoColumn">
                  <div className="companyLogoWrapper">
                    <img src={ipo.logo} alt="Logo" />
                  </div>
                  <div className="columnDetails">
                    <div className="companyDetails">
                      <p className="companyName"> {ipo.name} </p>
                    </div>
                    <div className="additionalDetails">
                      <div className="detailsRow">
                        <span className="regularText"> {ipo.description} </span>
                      </div>
                      <div className="detailsRow">
                        <p className="boldText">Expected IPO Date:</p>
                        <span className="regularText">
                          {" "}
                          {ipo.expectedDate}{" "}
                        </span>
                      </div>
                      <div className="detailsRow">
                        <p className="boldText">Pre-IPO Share Price:</p>
                        <span className="regularText">
                          {" "}
                          $ {formatNumber(ipo.preSharePrice)}{" "}
                        </span>
                      </div>
                      <div className="detailsRow">
                        <p className="boldText">Minimum Investment:</p>
                        <span className="regularText">
                          {" "}
                          $ {formatNumber(ipo.minInvestment)}{" "}
                        </span>
                      </div>
                      <div className="detailsRow">
                        <p className="boldText">Expected Listing Price:</p>
                        <span className="regularText">
                          {" "}
                          $ {formatNumber(ipo.expListingPrice)}{" "}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIposModalOpen(true);
                      setSelectedIpo(ipo);
                    }}
                    className="purchaseButton"
                  >
                    Invest Now
                  </button>
                </div>
              </div>
              {iposModalOpen && (
                <InvestIpoModal
                  onClose={() => {
                    setIposModalOpen(false);
                    setSelectedIpo(null);
                  }}
                  ipo={selectedIpo}
                  userId={userId}
                  onInvestSuccess={handleInvestSuccess}
                />
              )}
              {isEditing && (
                <EditIposUser
                  iposId={selectedId}
                  ipo={selectedForEdit}
                  onClose={onClose}
                  userId={userId}
                  refreshDetails={fetchIpos}
                />
              )}
            </div>
          ))
        )}
      </div>
      <div style={{ marginTop: "30px" }}>
        <input
          style={{ marginLeft: "12px" }}
          className="muted-button"
          type="button"
          value="Close"
          onClick={() => {
            fetchIpos();
            onClose();
          }}
        />
      </div>
    </div>
  );
};

export default AddUserIpos;
