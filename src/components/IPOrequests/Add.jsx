import React, { useState } from "react";
import "firebase/firestore";
import Swal from "sweetalert2";
import { addIposToUserCollection } from "../../firebaseConfig/firestore";
import LoadingScreen from "../LoadingScreen";
import CurrencyInput from "react-currency-input-field";

const AddUserIpos = ({ ipos, setIpos, userId, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    description: "",
    expListingPrice: 0,
    expectedate: "",
    minInvestment: 0,
    preAllocation: "",
    preSharePrice: 0,
    sharePrice: 0,
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

    const {
      name,
      logo,
      description,
      expListingPrice,
      expectedate,
      minInvestment,
      preAllocation,
      preSharePrice,
      sharePrice,
    } = formData;

    if (
      !name ||
      !logo ||
      !description ||
      !expListingPrice ||
      !expectedate ||
      !minInvestment ||
      !preAllocation ||
      !preSharePrice ||
      !sharePrice
    ) {
      setIsLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "All fields are required.",
        showConfirmButton: true,
      });
    }

    const newIpos = {
      name,
      logo,
      description,
      expListingPrice,
      expectedate,
      minInvestment,
      preAllocation,
      preSharePrice,
      sharePrice,
    };

    try {
      const result = await addIposToUserCollection(formData);
      Swal.fire({
        icon: "success",
        title: "Added!",
        text: `IPOs added successfully.`,
        showConfirmButton: false,
        timer: 2000,
      });
      setIpos([...ipos, { ...newIpos, id: result.id }]);
      setFormData({
        name: "",
        logo: "",
        description: "",
        expListingPrice: 0,
        expectedate: "",
        minInvestment: 0,
        preAllocation: "",
        preSharePrice: 0,
        sharePrice: 0,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Error adding IPOs: ${error}`,
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
          <h3>Add New IPOs for {userId.userId}</h3>
          <label htmlFor="logo"> Logo:</label>
          <input
            type="url"
            name="logo"
            onChange={handleChange}
            value={formData.logo}
          />
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            value={formData.name}
          />
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            name="description"
            onChange={handleChange}
            value={formData.description}
          />
          <label htmlFor="expListingPrice">Expected Listing Price:</label>
          <CurrencyInput
            decimalSeparator="."
            prefix="€"
            name="expListingPrice"
            placeholder="0.00"
            defaultValue={0.00}
            decimalsLimit={2}
            onValueChange={formData.expListingPrice}
          />
          <label htmlFor="expectedate">Expected Date:</label>
          <input
            type="text"
            name="expectedate"
            onChange={handleChange}
            value={formData.expectedate}
          />
          <label htmlFor="minInvestment">Minimum Investment:</label>
          <CurrencyInput
            decimalSeparator="."
            prefix="€"
            name="minInvestment"
            placeholder="0.00"
            defaultValue={0.00}
            decimalsLimit={2}
            onValueChange={formData.minInvestment}
          />
          <label htmlFor="preAllocation">Pre Allocation:</label>
          <input
            type="text"
            name="preAllocation"
            onChange={handleChange}
            value={formData.preAllocation}
          />
          <label htmlFor="preSharePrice">Pre Share Price:</label>
          <CurrencyInput
            decimalSeparator="."
            prefix="€"
            name="preSharePrice"
            placeholder="0.00"
            defaultValue={0.00}
            decimalsLimit={2}
            onValueChange={formData.preSharePrice}
          />
          <label htmlFor="sharePrice">Share Price:</label>
          <CurrencyInput
            decimalSeparator="."
            prefix="€"
            name="sharePrice"
            placeholder="0.00"
            defaultValue={0.00}
            decimalsLimit={2}
            onValueChange={formData.sharePrice}
          />
          
          <div style={{ marginTop: "30px" }}>
            <input type="submit" value="Save" />
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
}

export default AddUserIpos;
