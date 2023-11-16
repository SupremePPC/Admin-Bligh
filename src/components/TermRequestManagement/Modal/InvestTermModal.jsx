import React, { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import Swal from "sweetalert2";
import {
  addTermToUserCollection,
  formatNumber,
  getCurrentDate,
} from "../../../firebaseConfig/firestore";

export default function InvestTermModal({
  onInvestSuccess,
  userId,
  onClose,
  fixedTerm,
}) {
  const [depositAmount, setDepositAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const onDeposit = async () => {
    try {
      setIsLoading(true);

      // Check if there is a selectedFixedTerm before proceeding
      if (!fixedTerm) {
        console.error("No selected fixed term deposit.");
        return;
      }

      // const MIN_AMOUNT = fixedTerm.minAmount;
      // if (depositAmount < MIN_AMOUNT) {
      //   Swal.fire({
      //     icon: "error",
      //     title: "Error!",
      //     text: `Cannot deposit less than $${formatNumber(MIN_AMOUNT)}`,
      //     showConfirmButton: false,
      //     timer: 2000,
      //   });
      //   setIsLoading(false);
      //   setDepositAmount("");
      //   return;
      // }

      const newDeposit = {
        date: getCurrentDate(),
        principalAmount: parseFloat(depositAmount),
        minAmount: fixedTerm.minAmount,
        status: "Pending",
        bankName: fixedTerm.bankName,
        term: fixedTerm.term,
        interestRate: fixedTerm.interestRate,
        type: "deposit",
        logo: fixedTerm.logo,
      };

      const result = await addTermToUserCollection(userId.userId, newDeposit);
      const depositId = result.id;
      onInvestSuccess(newDeposit, depositId);

      Swal.fire({
        icon: "success",
        title: "Request Sent!",
        text: `You have successfully made a deposit of $${formatNumber(depositAmount)} on behalf of this user.`,
        showConfirmButton: false,
        timer: 4000,
      });
      setDepositAmount(0);
    } catch (error) {
      console.error("Error adding deposit transaction: ", error);
    }
  };

  return (
    <div className="invest_ipo_overlay">
      <div className="invest_ipo_modal">
        <div className="section_header">
          <div className="logo">
            <img
              src={fixedTerm.logo}
              alt={fixedTerm.bankName}
              height={100}
              width={100}
            />
          </div>
          <h2 className="title">{fixedTerm.bankName}</h2>
        </div>
        <div className="input_group">
          <label>Length:</label>
          <span className="reg_text"> {fixedTerm.term} </span>
        </div>
        <div className="input_group">
          <label className="">Minimum Amount:</label>
          <span className="reg_text">$ {formatNumber(fixedTerm.minAmount)} </span>
        </div>
        <div className="input_group">
          <label>Input Amount ($):</label>
          <CurrencyInput
            decimalSeparator="."
            prefix="$"
            name="depositAmount"
            placeholder="0.00"
            defaultValue={depositAmount} // Use the formData value here
            decimalsLimit={2}
            onValueChange={(value) => {
              const formattedValue = parseFloat(value).toFixed(2);
              setDepositAmount(parseFloat(formattedValue)); // Store as a number
            }}
          />
        </div>
        <div className="buttons_wrap">
          <button onClick={onDeposit} className="submit_btn">
            Request Deposit
          </button>
          {isLoading && <div className="spinner"></div>}
          <button onClick={onClose} className="cancel_btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
