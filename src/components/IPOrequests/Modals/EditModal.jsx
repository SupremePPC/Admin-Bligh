import React, { useState } from "react";
import {
  updateIposToUserCollection,
  deleteIposFromUserCollection,
  getCurrentDate,
} from "../../../firebaseConfig/firestore";
import CurrencyInput from "react-currency-input-field";
import Swal from "sweetalert2";

export default function EditIposUser({
  iposId,
  ipo,
  onClose,
  refreshDetails,
  userId,
}) {
  const [investmentAmount, setInvestmentAmount] = useState(ipo.amountInvested);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    if (!investmentAmount || investmentAmount < ipo.minInvestment) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Investment amount must be greater than minimum investment value of $${ipo.minInvestment}`,
        showConfirmButton: true,
      });
      return;
    }

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
      await updateIposToUserCollection(userId.userId, iposId, investmentData);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "You have successfully updated the investment on behalf of this user.",
        showConfirmButton: false,
        timer: 2000,
      });
      setInvestmentAmount(0);
      onClose();
      refreshDetails();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "There was an issue sending your investment request. Try again later.",
        showConfirmButton: false,
        timer: 2000,
      });
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteIposFromUserCollection(userId.userId, iposId);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "You have successfully deleted this investment.",
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
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const totalCost = ipo.amountInvested * ipo.sharePrice;
  const numberOfShares =
    Math.ceil((investmentAmount / ipo.sharePrice) * 100) / 100;

  return (
    <div className="invest_ipo_overlay" onClick={(e) => e.stopPropagation()}>
      <div className="invest_ipo_modal">
        <div className="section_header">
          <h6>Edit {ipo.name} IPOs for User</h6>
          <img src={ipo.logo} alt={`${ipo.name} Logo`} className="logo" />
          {/* <h2 className="title">{ipo.name}</h2> */}
        </div>
        <div className="section_body">
          <div className="more_dets">
            <p className="bold_text">IPO Expected Date:</p>
            <p className="reg_text">{ipo.expectedDate}</p>
          </div>
          <div className="more_dets">
            <p className="bold_text">IPO Share Price: </p>
            <p className="reg_text">$ {ipo.sharePrice}</p>
          </div>
          <div className="more_dets">
            <p className="bold_text">Expected Listing Price:</p>
            <p className="reg_text">$ {ipo.expListingPrice}</p>
          </div>
          <div className="more_dets">
            <p className="bold_text">Minimum Investment Amount:</p>
            <p className="reg_text">$ {ipo.minInvestment}</p>
          </div>
          <div className="more_dets">
            <p className="bold_text">Number of Shares:</p>
            <p className="reg_text">
              {ipo.numberOfShares || numberOfShares || 0}
            </p>
          </div>
          <div className="more_dets">
            <p className="bold_text">Total Cost:</p>
            <p className="reg_text">$ {totalCost || 0}</p>
          </div>
          <div className="input_group">
            <label htmlFor="title">Investment Amount:</label>
            <CurrencyInput
              decimalSeparator="."
              prefix="$"
              name="investmentAmount"
              placeholder="$0"
              value={investmentAmount}
              decimalsLimit={2}
              onValueChange={(value) => {
                const formattedValue = parseFloat(value).toFixed(2);
                setInvestmentAmount(parseFloat(formattedValue)); // Store as a number
              }}
            />
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <input type="submit" value="Save" onClick={handleUpdate} />
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
              setInvestmentAmount(0);
            }}
          />
        </div>
      </div>
    </div>
  );
}
