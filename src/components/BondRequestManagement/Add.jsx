import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { addBondUser, getAllBonds } from "../../firebaseConfig/firestore";
import LoadingScreen from "../LoadingScreen";
import AddBondModal from "./Modal/AddBondModal";
import EditBondModal from "./Modal/EditBondModal";

const AddBond = ({ userId, onClose, refreshDetails }) => {
  const [bonds, setBonds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBond, setSelectedBond] = useState(null);
  const [visibleDropdownIndex, setVisibleDropdownIndex] = useState(null);
  const [bondModalOpen, setBondModalOpen] = useState(false);
  const [selectedForEdit, setSelectedForEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(false);

  const fetchBonds = async () => {
    try {
      setIsLoading(true);
      const fetchedBonds = await getAllBonds();
      setBonds(fetchedBonds);
    } catch (error) {
      console.error("Error fetching bonds:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBonds();
  }, []);

  const handleInvestSuccess = (investmentData, iposId) => {
    setBondModalOpen(false);
    setIsEditing(true);
    setSelectedId(iposId);
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
    <div className="iposPage_Wrapper">
        <div className="headerSection">
        <h2 className="title">Choose Bonds</h2>
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
        {!bonds || bonds.length === 0 && (
          <h5 className="no_data">NO BONDS FOUND.</h5>
        )}
          {isLoading && (
            <LoadingScreen />
          )}
          {!isLoading && (
          bonds.map((bond, index) => (
            <div
              key={index}
              className="portfolioCard"
              onClick={() => toggleDropdown(index)}
            >
              <div className="portfolio">
                <div className="portfolioCol">
                  <div className="portfolioImg">
                    <img src={bond.image} alt="" />
                  </div>
                  <div className="colDetails">
                    <div className="issuerDets">
                      <p className="name"> {bond.issuerName} </p>
                      <div className="type">
                        <span> {bond.type} </span>
                      </div>
                    </div>
                    <div className="moreDets">
                      <div className="maturityRow">
                        <p className="boldText">Sector:</p>
                        <span className="regText"> {bond.sector} </span>
                      </div>
                      <div className="">
                        <div className="maturityRow">
                          <p className="boldText">Maturity Date:</p>
                          <span className="regText">{bond.maturityDate}</span>
                        </div>
                        <div className="maturityRow">
                          <p className="boldText">Minimum Amount:</p>
                          <span className="regText">
                            $ {bond.minimumAmount}{" "}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="couponDets">
                      <div className="couponWrap">
                        <div className="couponPercent">
                          <span className="number"> {bond.couponRate} </span>
                          <span className="percent">%</span>
                        </div>
                        <span className="regText">Coupon</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`bondsDropdown ${
                  visibleDropdownIndex === index ? "show" : ""
                }`}
              >
                <div className="dropdownCol">
                  <div className="dropdownRow">
                    <p className="boldText">Company Website :</p>
                    <span className="regText"> {bond.companyWebsite} </span>
                  </div>
                  <div className="dropdownRow">
                    <p className="boldText">ISIN :</p>
                    <span className="regText"> {bond.isin} </span>
                  </div>
                  <div className="dropdownRow">
                    <p className="boldText">Coupon Frequency :</p>
                    <span className="regText"> {bond.couponFrequency} </span>
                  </div>
                  <div className="dropdownRow">
                    <p className="boldText">Minimum Investment Amount :</p>
                    <span className="regText">$ {bond.minimumAmount} </span>
                  </div>
                </div>
                <div style={{ marginTop: "30px" }}>
                  <input
                    type="submit"
                    value="Invest Bond"
                    onClick={() => {
                      setBondModalOpen(true);
                    setSelectedBond(bond);
                    }}
                  />
                </div>
              </div>
              {bondModalOpen && (
                <AddBondModal
                  onClose={() => {
                    setBondModalOpen(false);
                    setSelectedBond(null);
                  }}
                  bond={selectedBond}
                  userId={userId}
                  onInvestSuccess={handleInvestSuccess}
                />
              )}
              {isEditing && (
                <EditBondModal
                  bondId={selectedId}
                  bond={selectedForEdit}
                  onClose={onClose}
                  userId={userId}
                  refreshDetails={fetchBonds}
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
            fetchBonds();
            onClose();
          }}
        />
      </div>
    </div>
  );
};

export default AddBond;
