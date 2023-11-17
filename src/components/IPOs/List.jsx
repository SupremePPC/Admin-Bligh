import React, {useState} from 'react';
import "./style.css";
import { formatNumber } from '../../firebaseConfig/firestore';

export default function List({
    ipos, handleDelete, handleEditClick
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [visibleDropdownIndex, setVisibleDropdownIndex] = useState(null);

  const toggleDropdown = (index) => {
    if (visibleDropdownIndex === index) {
      setVisibleDropdownIndex(null); // if clicked again on the open dropdown, close it
    } else {
      setVisibleDropdownIndex(index); // open the clicked dropdown and close any other open dropdown
    }
  };
  return (
    <div className="iposPage_Wrapper">
    <div className="contentBody">
      {!ipos || ipos.length === 0 ? (<h5 className='no_data'>No IPOs Available.</h5>) :
        ipos.map((ipo, index) => (
      isLoading ? (
        <LoadingScreen />
      ) : (
          <div
            key={index}
            onClick={() => toggleDropdown(index)}
            className="ipoCard"
          >
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
              </div>
            </div>
             <div
                className={`iposDropdown ${
                  visibleDropdownIndex === index ? "show" : ""
                }`}
              >
                <div className="dropdownCol">
                  <div className="dropdownRow">
                    <p className="boldText">Pre Allocation :</p>
                    <span className="regText"> {ipo.preAllocation} </span>
                  </div>
                  <div className="dropdownRow">
                    <p className="boldText">Pre Share Price :</p>
                    <span className="regText">$ {ipo.preSharePrice} </span>
                  </div>
                  <div className="dropdownRow">
                    <p className="boldText">Share Price :</p>
                    <span className="regText">$ {ipo.sharePrice} </span>
                  </div>
                </div>
                <div style={{ marginTop: "30px" }}>
                  <input
                    type="submit"
                    value="Delete IPOs"
                    onClick={() => handleDelete(ipo.id)}
                  />
                  <input
                    style={{ marginLeft: "12px" }}
                    className="mutedButton"
                    type="button"
                    value="Edit IPOs"
                    onClick={() => handleEditClick(ipo)}
                  />
                </div>
              </div> 
          </div>
        ))
      )}
    </div>
  </div>
  )
}
