import React, { useState } from "react";
import {
  addIposToUserCollection,
  formatNumber,
  getCurrentDate,
} from "../../../firebaseConfig/firestore";
import CurrencyInput from "react-currency-input-field";
import Swal from "sweetalert2";
import "./style.css";

export default function InvestIpoModal({ onInvestSuccess, onClose, ipo, userId }) {
  const [investmentAmount, setInvestmentAmount] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInvestInIpo = async () => {
    // if (!investmentAmount || investmentAmount < ipo.minInvestment) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Error!",
    //     text: `Investment amount must be greater than minimum investment value of $${formatNumber(ipo.minInvestment)}`,
    //     showConfirmButton: true,
    //   });
    //   return;
    // }

    const investmentData = {
      amountInvested: parseFloat(investmentAmount),
      logo: ipo.logo,
      name: ipo.name,
      expectedDate: ipo.expectedDate,
      sharePrice: ipo.sharePrice,
      expListingPrice: ipo.expListingPrice,
      date: getCurrentDate(),
      minInvestment: ipo.minInvestment,
      numberOfShares: numberOfShares,
    };
    setIsLoading(true);
    try {
      const result = await addIposToUserCollection(userId.userId, investmentData);
      Swal.fire({
        icon: "success",
        title: "Successful!",
        text: "You have successfully made an investment on behalf of this user.",
        showConfirmButton: false,
        timer: 2000,
      });
      setInvestmentAmount(0);
      const iposId = result.id;
      onInvestSuccess(investmentData, iposId);
    } catch (error) {
      setError(
        `There was an issue sending your investment request. Try again later.`
      );
      console.error(error.message);
      setTimeout(() => setError(""), 4000);
    } finally {
      setIsLoading(false);
    }
  };

  const totalCost = investmentAmount * ipo.sharePrice;
  const numberOfShares =
    (Math.ceil((investmentAmount / ipo.sharePrice) * 100) / 100).toFixed(2);

  return (
    <>
      {/* {!isEditing && ( */}
        <div
          className="invest_ipo_overlay"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="invest_ipo_modal">
            <div className="section_header">
              <img src={ipo.logo} alt={`${ipo.name} Logo`} className="logo" />
              <h2 className="title">{ipo.name}</h2>
              <div className="subtitle">
              </div>
            </div>
            <div className="section_body">
              <div className="more_dets">
                <p className="bold_text">IPO Expected Date:</p>
                <p className="reg_text">{ipo.expectedDate}</p>
              </div>
              <div className="more_dets">
                <p className="bold_text">IPO Share Price: </p>
                <p className="reg_text">$ {formatNumber(ipo.sharePrice)}</p>
              </div>
              <div className="more_dets">
                <p className="bold_text">Expected Listing Price:</p>
                <p className="reg_text">$ {formatNumber(ipo.expListingPrice)}</p>
              </div>
              <div className="more_dets">
                <p className="bold_text">Minimum Investment Amount:</p>
                <p className="reg_text">$ {formatNumber(ipo.minInvestment)}</p>
              </div>
              <div className="more_dets">
                <p className="bold_text">Number of Shares:</p>
                <p className="reg_text">{numberOfShares || 0}</p>
              </div>
              <div className="more_dets">
                <p className="bold_text">Total Cost:</p>
                <p className="reg_text">$ {formatNumber(totalCost) || 0}</p>
              </div>
              <div className="input_group">
                <label htmlFor="title">Investment Amount:</label>
                <CurrencyInput
                  decimalSeparator="."
                  prefix="$"
                  name="investmentAmount"
                  placeholder="$0"
                  defaultValue={(investmentAmount)}
                  decimalsLimit={2}
                  onValueChange={(value) => {
                    const formattedValue = parseFloat(value).toFixed(2);
                    setInvestmentAmount(parseFloat(formattedValue)); // Store as a number
                  }}
                />
              </div>
            </div>
            {message && <p className="success_msg">{message}</p>}
            {error && <p className="error_msg">{error}</p>}
            <div className="buttons_wrap">
              <button onClick={handleInvestInIpo} className="submit_btn">
                Invest
              </button>
              {isLoading && <div className="spinner"></div>}
              <button onClick={onClose} className="cancel_btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      {/* )} */}
      
    </>
  );
}
