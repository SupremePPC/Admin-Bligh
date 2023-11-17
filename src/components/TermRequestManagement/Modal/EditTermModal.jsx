import React, { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import Swal from "sweetalert2";
import {
  deleteTermFromUserCollection,
  formatNumber,
  getCurrentDate,
  updateTermInUserCollection,
} from "../../../firebaseConfig/firestore";

export default function EditTermUser({
  termId,
  fixedTerm,
  refreshDetails,
  userId,
  onClose,
}) {
  const [depositAmount, setDepositAmount] = useState(fixedTerm.principalAmount);
  const [isLoading, setIsLoading] = useState(false);

  const onDeposit = async () => {
    setIsLoading(true);
    try {
      setIsLoading(true);
      if (!fixedTerm) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Please select a term to deposit into.",
          showConfirmButton: false,
          timer: 2000,
        });
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
        status: "Approved",
        bankName: fixedTerm.bankName,
        term: fixedTerm.term,
        interestRate: fixedTerm.interestRate,
        type: "deposit",
        logo: fixedTerm.logo,
        minAmount: fixedTerm.minAmount,
      }
      await updateTermInUserCollection(userId.userId, termId, newDeposit);
      
      Swal.fire({
        icon: "success",
        title: "Succesful!",
        text: `You have successfully updated a deposit of $${formatNumber(depositAmount)} on behalf of this user.`,
        showConfirmButton: false,
        timer: 2000,
      });
      setDepositAmount(0);
      refreshDetails();
      onClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `There was an issue adding this deposit: ${error}`,
        showConfirmButton: false,
        timer: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteTermFromUserCollection(userId.userId, termId);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "You have successfully deleted this deposit.",
        showConfirmButton: false,
        timer: 2000,
      });
      refreshDetails();
      onClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "There was an issue deleting this deposit. Try again later.",
        showConfirmButton: false,
        timer: 2000,
      });
      console.error(error.message);
    } finally {
      setIsLoading(false);
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
            defaultValue={depositAmount}
            decimalsLimit={2}
            onValueChange={(value) => {
              const formattedValue = parseFloat(value).toFixed(2);
              setDepositAmount(parseFloat(formattedValue));
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input type="submit" value="Save" onClick={onDeposit} />
          {isLoading && (
            <div className="spinner" style={{ marginLeft: "12px" }}></div>
          )}
          <input
            style={{ marginLeft: "12px" }}
            className="reject_btn"
            type="button"
            value="Delete"
            onClick={handleDelete}
          />
          <input
            style={{ marginLeft: "auto", marginRight: "0" }}
            className="muted-button"
            type="button"
            value="Cancel"
            onClick={() => {
              onClose();
              setDepositAmount(0);
            }}
          />
        </div>
      </div>
    </div>
  );
}
