import React, { useState } from "react";
import Swal from "sweetalert2";
import LoadingScreen from "../LoadingScreen";
import { addBondUser } from "../../firebaseConfig/firestore";

const AddBond = ({ setBond, bonds, userId, onClose }) => {
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
    minimumAmount: 0.00,
    purchaseDate: "",
    quantity: 0,
    sector: "",
    ticker: "",
    type: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Check if the field is a monetary value (couponRate, currentValue, minimumAmount, quantity)
    if (["minimumAmount"].includes(name)) {
      // Remove commas and format as a number with two decimal places
      const formattedValue = parseFloat(value.replace(/,/g, "")).toFixed(2).toLocaleString();
      setFormData({
        ...formData,
        [name]: formattedValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      !companyWebsite ||
      !couponFrequency ||
      !couponRate ||
      !currentValue ||
      !image ||
      !isin ||
      !issuerName ||
      !maturityDate ||
      !issuerName ||
      !maturityDate ||
      !minimumAmount ||
      !purchaseDate ||
      !quantity ||
      !sector ||
      !ticker ||
      !type
    ) {
      setIsLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "All fields are required.",
        showConfirmButton: true,
      });
    }

    const newBond = {
      companyWebsite,
      couponFrequency,
      couponRate,
      currentValue,
      image,
      isin,
      issuerName,
      maturityDate,
      minimumAmount,
      purchaseDate,
      quantity,
      sector,
      type,
    };

    const formattedData = {
      ...newBond,
      minimumAmount: parseFloat(newBond.minimumAmount.replace(/,/g, "")),
    };
    try {
      const result = await addBondUser(userId.userId, formattedData);
      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: `Bond added succesfully.`,
          showConfirmButton: false,
          timer: 2000,
        });
        setBond([...bonds, { ...newBond, id: result.id }]);
        setFormData({
          companyWebsite: "",
          couponFrequency: 0,
          couponRate: 0,
          currentValue: 0,
          image: "",
          isin: "",
          issuerName: "",
          maturityDate: "",
          minimumAmount: 0.00,
          purchaseDate: "",
          quantity: 0,
          sector: "",
          type: "",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Error adding bond: ${error}`,
        showConfirmButton: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="small-container">
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <form onSubmit={handleSubmit}>
          <h3>Add New Bond for {userId.userId}</h3>
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
              onClick={onClose}
            />
          </div>
          {errors.isin && <div>{errors.isin}</div>}
          {errors.issuerName && <div>{errors.issuerName}</div>}
        </form>
      )}
    </div>
  );
};

export default AddBond;
