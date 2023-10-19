import React from "react";

export default function EditIposUser({
  ipos,
  iposId,
  selectedForEdit,
  onClose,
  userId,
}) {
  console.log(ipos, iposId, selectedForEdit, userId);
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

  if (!isOpen) return null;

  const totalCost = investmentAmount * ipo.sharePrice;
  const numberOfShares = Math.ceil((investmentAmount / ipo.sharePrice) * 100) / 100;

  return (
    <div className="invest_ipo_overlay" onClick={(e) => e.stopPropagation()}>
      <div className="invest_ipo_modal">
        <div className="section_header">
          <img src={ipo.logo} alt={`${ipo.name} Logo`} className="logo" />
          <h2 className="title">{ipo.name}</h2>
          <div className="subtitle">{/* <span>{ipo.expIpoDate}</span> */}</div>
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
            <p className="reg_text">{numberOfShares}</p>
          </div>
          <div className="more_dets">
            <p className="bold_text">Total Cost:</p>
            <p className="reg_text">$ {totalCost}</p>
          </div>
          <div className="input_group">
            <label htmlFor="title">Investment Amount:</label>
            <CurrencyInput
              decimalSeparator="."
              prefix="$"
              name="investmentAmount"
              placeholder="$0"
              defaultValue={investmentAmount}
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
        {isLoading && (
          <div className="spinner" style={{ margin: "0 auto" }}></div>
        )}
        <div className="buttons_wrap">
          <button onClick={handleInvestInIpo} className="submit_btn">
            Invest
          </button>
          <button onClick={onClose} className="cancel_btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
