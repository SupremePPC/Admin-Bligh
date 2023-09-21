import React, { useState } from "react";
import "firebase/firestore";

const Edit = ({ bondToEdit, setIsEditPageOpen }) => {
  const [formData, setFormData] = useState(bondToEdit);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.isin) {
      newErrors.isin = "ISIN is required";
      isValid = false;
    }

    if (!formData.issuerName) {
      newErrors.issuerName = "Issuer Name is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await updateBond(formData.id, formData);
      alert("Bond updated successfully");
    } catch (error) {
      alert("Error updating bond: ", error);
    }
  };

  return (
    <div className="small-container">
    <form onSubmit={handleSubmit}>
      <h1>Edit Bond</h1>
      <label htmlFor="image">Issuer Logo:</label>
      <input
        type="url"
        name="image"
        onChange={handleChange}
        value={formData.image}
      />
      <label htmlFor="issuerName">Issuer Name:</label>
      <input
        type="url"
        name="issuerName"
        onChange={handleChange}
        value={formData.issuerName}
      />
      <label htmlFor="type">Type:</label>
      <input
        type="url"
        name="type"
        onChange={handleChange}
        value={formData.type}
      />
      <label htmlFor="isin">ISIN:</label>
      <input
        type="text"
        name="type"
        onChange={handleChange}
        value={formData.isin}
      />
      <label htmlFor="quantity">Quantity:</label>
      <input
        type="number"
        max={9}
        min={0}
        name="quantity"
        onChange={handleChange}
        value={formData.quantity}
      />
      <label htmlFor="purchaseDate">Purchase Date:</label>
      <input
        type="text"
        name="purhaseDate"
        onChange={handleChange}
        value={formData.purchaseDate}
      />
      <label htmlFor="sector">Sector:</label>
      <input
        type="url"
        name="sector"
        onChange={handleChange}
        value={formData.sector}
      />
      <label htmlFor="maturityDate">Maturity Date:</label>
      <input
        type="url"
        name="maturityDate"
        onChange={handleChange}
        value={formData.maturityDate}
      />
      <label htmlFor="minimumAmount">Minimum Amount:</label>
      <input
        type="url"
        name="minimumAmount"
        onChange={handleChange}
        value={formData.minimumAmount}
      />
      <label htmlFor="currentValue">Current Value:</label>
      <input
        type="url"
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
        type="url"
        name="couponRate"
        onChange={handleChange}
        value={formData.couponRate}
      />
      <label htmlFor="couponFrequency">Coupon Frequency:</label>
      <input
        type="number"
        name="couponFrequency"
        onChange={handleChange}
        value={formData.couponFrequency}
      />

      <div style={{ marginTop: "30px" }}>
        <input type="submit" value="Add" />
        <input
          style={{ marginLeft: "12px" }}
          className="muted-button"
          type="button"
          value="Cancel"
          onClick={() => setIsEditPageOpen(false)}
        />
      </div>
      {errors.isin && <div>{errors.isin}</div>}
      {errors.issuerName && <div>{errors.issuerName}</div>}
    </form>
    </div>
  );
};

export default Edit;
