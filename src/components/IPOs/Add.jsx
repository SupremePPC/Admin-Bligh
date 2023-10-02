import React, { useState } from "react";
import "firebase/firestore";
import Swal from "sweetalert2";
import { addNewBond } from "../../firebaseConfig/firestore";
import LoadingScreen from "../LoadingScreen";

const AddNewBond = ({ setIsAdding, refreshBond }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyWebsite: "",
    couponFrequency: 0,
    couponRate: 0,
    currentValue: 0,
    image: "",
    isin: "",
    issuerName: "",
    maturityDate: "",
    minimumAmount: 0,
    purchaseDate: "",
    quantity: 0,
    sector: "",
    ticker: "",
    type: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addNewBond(formData);
      Swal.fire({
        icon: "success",
        title: "Added!",
        text: `Bond added succesfully.`,
        showConfirmButton: false,
        timer: 2000,
      });
      setFormData({
        companyWebsite: "",
        couponFrequency: 0,
        couponRate: 0,
        currentValue: 0,
        image: "",
        isin: "",
        issuerName: "",
        maturityDate: "",
        minimumAmount: 0,
        purchaseDate: "",
        quantity: 0,
        sector: "",
        type: "",
      });
      setIsAdding(false);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Error adding bond: ${error}`,
        showConfirmButton: true,
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="small-container">
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <form onSubmit={handleSubmit}>
          <h1>Add New Bond</h1>
          <label htmlFor="image">Issuer Logo:</label>
          <input
            type="url"
            name="image"
            onChange={handleChange}
            value={formData.image}
            title="Must be a url"
            required
          />
          <label htmlFor="issuerName">Issuer Name:</label>
          <input
            type="text"
            name="issuerName"
            onChange={handleChange}
            value={formData.issuerName}
          />
          <label htmlFor="type">Type:</label>
          <input
            type="text"
            name="type"
            onChange={handleChange}
            value={formData.type}
          />
          <label htmlFor="isin">ISIN:</label>
          <input
            type="text"
            name="isin"
            onChange={handleChange}
            value={formData.isin}
          />
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            min={0}
            name="quantity"
            onChange={handleChange}
            value={formData.quantity}
          />
          <label htmlFor="sector">Sector:</label>
          <input
            type="text"
            name="sector"
            onChange={handleChange}
            value={formData.sector}
          />
          <label htmlFor="maturityDate">Maturity Date:</label>
          <input
            type="date"
            name="maturityDate"
            onChange={handleChange}
            value={formData.maturityDate}
          />
          <label htmlFor="minimumAmount">Minimum Amount:</label>
          <input
            type="number"
            min={0}
            name="minimumAmount"
            onChange={handleChange}
            value={formData.minimumAmount}
          />
          <label htmlFor="currentValue">Current Value:</label>
          <input
            type="number"
            min={0}
            name="currentValue"
            onChange={handleChange}
            value={formData.currentValue}
          />
          <label htmlFor="companyWebsite">Company Website:</label>
          <input
            type="url"
            name="companyWebsite"
            onChange={handleChange}
            value={formData.companyWebsite}
          />
          <label htmlFor="couponRate">Coupon Rate:</label>
          <input
            type="number"
            name="couponRate"
            onChange={handleChange}
           
            value={formData.couponRate}
          />
          <label htmlFor="couponFrequency">Coupon Frequency:</label>
          <input
            type="number"
            name="couponFrequency"
            onChange={handleChange}
            min={0}
            value={formData.couponFrequency}
          />

          <div style={{ marginTop: "30px" }}>
            <input type="submit" value="Add" />
            <input
              style={{ marginLeft: "12px" }}
              className="muted-button"
              type="button"
              value="Cancel"
              onClick={() => {
                setIsAdding(false);
                refreshBond();
              }}
            />
          </div>
          {errors.isin && <div>{errors.isin}</div>}
          {errors.issuerName && <div>{errors.issuerName}</div>}
        </form>
      )}
    </div>
  );
};

export default AddNewBond;
