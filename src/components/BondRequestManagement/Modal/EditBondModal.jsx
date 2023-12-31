import React, { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import {
  updateBondUser,
  deleteBondUser,
  formatNumber,
} from "../../../firebaseConfig/firestore";
import Swal from "sweetalert2";
import "./style.css";

export default function EditBondModal({
  bondId,
  onClose,
  bond,
  refreshDetails,
  userId,
}) {
  const [bondsAmount, setBondsAmount] = useState(bond.amountRequested);
  const [purchaseDate, setPurchaseDate] = useState(bond.purchaseDate);
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyBonds = async () => {
    const minimumInvestmentAmount = bond.minimumAmount;
    // if (bondsAmount < minimumInvestmentAmount) {
    //   Swal.fire({
    //     icon: "error",
    //     title: "Oops...",
    //     text: `Cannot buy less than $${formatNumber(minimumInvestmentAmount)}`,
    //     showConfirmButton: false,
    //     timer: 2000,
    //   });
    //   return;
    // }

    // Calculate how many bonds the user is buying
    const amountAsNumber = parseFloat(bondsAmount);
    const numberOfBondsBought = amountAsNumber / minimumInvestmentAmount;

    // Create bond data
    const bondData = {
      amountRequested: amountAsNumber,
      image: bond.image,
      type: bond.type,
      couponRate: bond.couponRate,
      companyWebsite: bond.companyWebsite,
      isin: bond.isin,
      maturityDate: bond.maturityDate,
      purchaseDate: purchaseDate,
      currentValue: numberOfBondsBought,
      issuerName: bond.issuerName,
      sector: bond.sector,
      couponFrequency: bond.couponFrequency,
      minimumAmount: bond.minimumAmount,
      typeOfRequest: "buy",
    };
    setIsLoading(true);
    try {
      await updateBondUser(userId.userId, bondId, bondData);
      Swal.fire({
        icon: "success",
        title: "Successful!",
        text: "You have successfully updated the investment on behalf of this user.",
        showConfirmButton: false,
        timer: 2000,
      });
      setBondsAmount(0);
      refreshDetails();
      onClose();
    } catch (error) {
      console.log(error);
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

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteBondUser(userId.userId, bondId);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "You have successfully deleted this bond investment.",
        showConfirmButton: false,
        timer: 2000,
      });
      refreshDetails();
      onClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "There was an issue deleting this investment. Try again later.",
        showConfirmButton: false,
        timer: 2000,
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bondModal_overlay" onClick={(e) => e.stopPropagation()}>
      <div className="bondModal">
        <div className="section_header">
          <h2 className="title">Edit {bond.issuerName} Bond for User</h2>
          <img src={bond.image} alt={`${bond.name} Logo`} className="logo" />
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
                <span className="reg_text">{bond.maturityDate}</span>
              </div>
              <div className="maturity_row">
                <p className="bold_text">Minimum Amount:</p>
                <span className="reg_text">$ {formatNumber(bond.minimumAmount)}</span>
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
              value={bondsAmount}
              decimalsLimit={2}
              onValueChange={(value) => {
                const formattedValue = parseFloat(value).toFixed(2);
                setBondsAmount(parseFloat(formattedValue)); // Store as a number
              }}
            />
          </div>
          <div className="input_group">
            <label htmlFor="purchaseDate">Purchase Date</label>
            <input type="date" name="purchase-date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
          </div>
        </div>
        <div className="buttons_wrap">
          <input type="submit" value="Save" onClick={handleBuyBonds} />
          <input
            style={{ marginLeft: "12px" }}
            className="reject_btn"
            type="button"
            value="Delete"
            onClick={handleDelete}
          />
          {isLoading && (
            <div className="spinner" style={{ marginLeft: "12px" }}></div>
          )}
          <input
            style={{ marginLeft: "auto", marginRight: "0" }}
            className="muted-button"
            type="button"
            value="Cancel"
            onClick={() => {
              onClose();
              setBondsAmount(0);
              refreshDetails();
            }}
          />
        </div>
      </div>
    </div>
  );
}
