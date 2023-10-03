import React, {useState} from 'react';
import "./style.css";

export default function List({
    ipos, handleDelete, setIsEditPageOpen, handleEditClick
}) {
    const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="iposPage_Wrapper">
    
    <div className="contentBody">
      {ipos.length === 0 && <h5>No IPOs Available.</h5>}
      {isLoading ? (
        <LoadingScreen />
      ) : (
        ipos.map((ipo, index) => (
          <div
            key={index}
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
                        € {ipo.preSharePrice}{" "}
                      </span>
                    </div>
                    <div className="detailsRow">
                      <p className="boldText">Minimum Investment:</p>
                      <span className="regularText">
                        {" "}
                        € {ipo.minInvestment}{" "}
                      </span>
                    </div>
                    <div className="detailsRow">
                      <p className="boldText">Expected Listing Price:</p>
                      <span className="regularText">
                        {" "}
                        € {ipo.expListingPrice}{" "}
                      </span>
                    </div>
                  </div>
                </div>
                  <button
                    onClick={() => {
                        setIsEditPageOpen(true);
                        handleEditClick(ipo);
                    }}
                    className="purchaseButton"
                  >
                    Edit
                  </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
  )
}
