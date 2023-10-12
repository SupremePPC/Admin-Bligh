import React, { useState } from "react";

export default function List({ bonds, handleDelete, handleEditClick }) {
  const [visibleDropdownIndex, setVisibleDropdownIndex] = useState(null);

  const toggleDropdown = (index) => {
    if (visibleDropdownIndex === index) {
      setVisibleDropdownIndex(null); // if clicked again on the open dropdown, close it
    } else {
      setVisibleDropdownIndex(index); // open the clicked dropdown and close any other open dropdown
    }
  };

  return (
    <div className="bondsPage">
      <div className="sectionBody">
        {!bonds || bonds.length === 0 ? (
          <h5 className="no_data">NO BONDS FOUND.</h5>
        ) : (
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
                    value="Delete Bond"
                    onClick={() => handleDelete(bond.id)}
                  />
                  <input
                    style={{ marginLeft: "12px" }}
                    className="mutedButton"
                    type="button"
                    value="Edit Bond"
                    onClick={() => handleEditClick(bond)}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
