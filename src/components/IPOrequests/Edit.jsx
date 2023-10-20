import React, { useState } from "react";
import { addIposToUserCollection, getCurrentDate } from "../../firebaseConfig/firestore";
import CurrencyInput from "react-currency-input-field";
import Swal from "sweetalert2";
// import "./style.css";

export default function EditIposUser({
  iposId,
  ipo,
  onClose,
  userId,
}) {
  console.log(iposId, ipo, userId);
  const [investmentAmount, setInvestmentAmount] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
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
      await addIposToUserCollection(userId.userId, investmentData);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "You have successfully made an investment on behalf of this user.",
        showConfirmButton: false,
        timer: 2000,
      });
      setInvestmentAmount(0);
      onClose();
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

  const totalCost = ipo.amountInvested * ipo.sharePrice;
  const numberOfShares = Math.ceil((investmentAmount / ipo.sharePrice) * 100) / 100;

  return (
    
    <div className="small-container">
      {isLoading && <LoadingScreen />}
      <div >
        <div className="section_header">
        <h3>Edit Term for {userId.userId}</h3>
          <img src={ipo.logo} alt={`${ipo.name} Logo`} className="logo" />
          <h2 className="title">{ipo.name}</h2>
        </div>
        <div className="section_body">
        <div className="">
          <label>IPO Expected Date:</label>
          <p className="reg_text">{ipo.expectedDate}</p>
        </div>
        <div className="">
          <label>IPO Share Price: </label>
          <p className="reg_text">$ {ipo.sharePrice}</p>
        </div>
        <div className="">
          <label>Expected Listing Price:</label>
          <p className="reg_text">$ {ipo.expListingPrice}</p>
        </div>
        <div className="">
          <label>Minimum Investment Amount:</label>
          <p className="reg_text">$ {ipo.minInvestment}</p>
        </div>
        <div className="">
          <label>Number of Shares:</label>
          <p className="reg_text">{ipo.numberOfShares}</p>
        </div>
        <div className="">
          <label>Total Cost:</label>
          <p className="reg_text">$ {totalCost}</p>
        </div>
        <div className="input_group">
          <label htmlFor="title">Investment Amount:</label>
          <CurrencyInput
            decimalSeparator="."
            prefix="$"
            name="investmentAmount"
            placeholder="$0"
            value={ipo.amountInvested}
            decimalsLimit={2}
            onValueChange={(value) => {
              const formattedValue = parseFloat(value).toFixed(2);
              setInvestmentAmount(parseFloat(formattedValue)); // Store as a number
            }}
            
          />
        </div>
      </div>
        <div style={{ marginTop: "30px" }}>
          <input type="submit" value="Save" onClick={handleUpdate}/>
          <input
            style={{ marginLeft: "12px" }}
            className="muted-button"
            type="button"
            value="Cancel"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
}
