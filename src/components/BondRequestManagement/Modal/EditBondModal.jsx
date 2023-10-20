import React, { useState } from "react";
import { getAuthUser } from "../../../firebase/firestore";
import CurrencyInput from "react-currency-input-field";
import { updateBondUser, getCurrentDate } from "../../../firebaseConfig/firestore";
import "./style.css";

export default function AddBondModal({  bondId, onClose, bond, refreshDetails, userId }) {
  const [bondsAmount, setBondsAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyBonds = async () => {
    const minimumInvestmentAmount = bond.minimumAmount;
    if (bondsAmount < minimumInvestmentAmount) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Cannot buy less than $${minimumInvestmentAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }
  
    // Calculate how many bonds the user is buying
    const amountAsNumber = parseFloat(bondsAmount);
    const numberOfBondsBought = amountAsNumber / minimumInvestmentAmount;
  
    // Create bond data
    const bondData = {
      amountRequested: amountAsNumber.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      image: bond.image,
      type: bond.type,
      couponRate: bond.couponRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      companyWebsite: bond.companyWebsite,
      isin: bond.isin,
      maturityDate: bond.maturityDate,
      purchaseDate: getCurrentDate(),
      currentValue: numberOfBondsBought.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      issuerName: bond.issuerName,
      sector: bond.sector,
      couponFrequency: bond.couponFrequency,
      minimumAmount: bond.minimumAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      quantity: numberOfBondsBought.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    };
    setIsLoading(true);
    try {
      await updateBondUser(
        userId,
        bondId,
        bondData
      );
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "You have successfully updated the investment on behalf of this user.",
        showConfirmButton: false,
        timer: 2000,
      });
        setBondsAmount(0);
        onClose();
        refreshDetails();
    } catch (error) {
        console.log(error.message);
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: "There was an issue sending your investment request. Try again later.",
            showConfirmButton: false,
            timer: 2000,
          });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="modal_overlay" onClick={(e) => e.stopPropagation()}>
      <div className="modal">
        <div className="section_header">
          <h2 className="title">{bond.issuerName}</h2>
          <div className="subtitle">
            <span>{bond.type}</span>
          </div>
        </div>
        <div className="bondSection_body">
          <div className="more_dets">
            <div className="maturity_row">
              <p className="bold_text">Sector:</p>
              <span className="reg_text">{bond.sector}</span>
            </div>

            <div className="">
              <div className="maturity_row">
                <p className="bold_text">Maturity Date:</p>
                <span className="reg_text">
                  {bond.maturityDate}
                </span>
              </div>
              <div className="maturity_row">
                <p className="bold_text">Minimum Amount:</p>
                <span className="reg_text">$ {bond.minimumAmount}</span>
              </div>
            </div>
          </div>
          <div className="input_group">
            <label htmlFor="title">Input Amount:</label>
             <CurrencyInput
              decimalSeparator="."
              prefix="$"
              name="bondsAmount"
              placeholder="$0"
              defaultValue={bondsAmount}
              decimalsLimit={2}
              onValueChange={(value) => {
                const formattedValue = parseFloat(value).toFixed(2);
                setBondsAmount(parseFloat(formattedValue)); // Store as a number
              }}
            />
          </div>
        </div>
        {message && <p className="success_msg">{message}</p>}
        {error && <p className="error_msg">{error}</p>}
        {isLoading && <div className="spinner" style={{margin: "0 auto"}}></div> }
        <div className="buttons_wrap">
          <button
            onClick={() => {
              handleBuyBonds();
            }}
            className="submit_btn"
          >
            Request
          </button>
          <button onClick={onClose} className="cancel_btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
