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
    <div className="bonds_page">
      <div className="section_header">
        <h2>Bond - Investment Options</h2>
        <span>Click on the investment below to show more information</span>
        <div>
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
      <div className="section_body">
        {bonds.length === 0 && <h5>NO BONDS FOUND.</h5>}
        {bonds.map((bond, index) => (
          <div
            key={index}
            className="portfolio_card"
            onClick={() => toggleDropdown(index)}
          >
            <div className="portfolio">
              <div className="portfolio_col">
                <div className="portfolio_img">
                  <img src={bond.image} alt="" />
                </div>
                <div className="col_details">
                  <div className="issuer_dets">
                    <p className="name"> {bond.issuerName} </p>
                    <div className="type">
                      <span> {bond.type} </span>
                    </div>
                  </div>
                  <div className="more_dets">
                    <div className="maturity_row">
                      <p className="bold_text">Sector:</p>
                      <span className="reg_text"> {bond.sector} </span>
                    </div>

                    <div className="">
                      <div className="maturity_row">
                        <p className="bold_text">Maturity Date:</p>
                        <span className="reg_text">{bond.maturityDate}</span>
                      </div>
                      <div className="maturity_row">
                        <p className="bold_text">Minimum Amount:</p>
                        <span className="reg_text">
                          $ {bond.minimumAmount}{" "}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="coupon_dets">
                    <div className="coupon_wrap">
                      <div className="coupon_percent">
                        <span className="number"> {bond.couponRate} </span>
                        <span className="percent">%</span>
                      </div>
                      <span className="reg_text">Coupon</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`portfolio_dropdown ${
                visibleDropdownIndex === index ? "show" : ""
              }`}
            >
              <div className="dropdown_col">
                <div className="dropdown_row">
                  <p className="bold_text">Company Website :</p>
                  <span className="reg_text"> {bond.companyWebsite} </span>
                </div>
                <div className="dropdown_row">
                  <p className="bold_text">ISIN :</p>
                  <span className="reg_text"> {bond.isin} </span>
                </div>
                <div className="dropdown_row">
                  <p className="bold_text">Ticker :</p>
                  <span className="reg_text"> {bond.ticker} </span>
                </div>
                <div className="dropdown_row">
                  <p className="bold_text">Coupon Frequency :</p>
                  <span className="reg_text"> {bond.couponFrequency} </span>
                </div>
                <div className="dropdown_row">
                  <p className="bold_text">Minimum Investment Amount :</p>
                  <span className="reg_text">$ {bond.minimumAmount} </span>
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
                  className="muted-button"
                  type="button"
                  value="Edit Bond"
                  onClick={() => handleEditClick(bond)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
