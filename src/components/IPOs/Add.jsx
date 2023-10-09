import React, { useState } from "react";
import "firebase/firestore";
import Swal from "sweetalert2";
import { addNewIpos } from "../../firebaseConfig/firestore";
import LoadingScreen from "../LoadingScreen";
import CurrencyInput from 'react-currency-input-field';

const AddNewIpos = ({ setIsAdding, refreshIpos }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    description: "",
    expListingPrice: 0,
    expectedDate: "",
    minInvestment: 0,
    preAllocation: "",
    preSharePrice: 0,
    sharePrice: 0,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Check if the field is a monetary value (expListingPrice, preSharePrice, minInvestment, sharePrice)
    if (
      name === 'expListingPrice' ||
      name === 'sharePrice' ||
      name === 'minInvestment' ||
      name === 'preSharePrice'
    ) {
      const formattedValue = parseFloat(value.replace(/,/g, ""))
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
    const formattedFormData = {
      ...formData,
      minInvestment: parseFloat(formData.minInvestment.replace(/,/g, '')).toFixed(2),
      sharePrice: parseInt(formData.sharePrice.replace(/,/g, ''), 10),
      preSharePrice: parseInt(formData.preSharePrice.replace(/,/g, ''), 10),
      expListingPrice: parseFloat(formData.expListingPrice.replace(/,/g, '')).toFixed(2),
    };
  
    try {
      await addNewIpos(formattedFormData);
      Swal.fire({
        icon: "success",
        title: "Added!",
        text: `IPOs added succesfully.`,
        showConfirmButton: false,
        timer: 2000,
      });
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
      refreshIpos();
      setIsAdding(false);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Error adding IPOs: ${error}`,
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
          <h1>Add New IPOs</h1>
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
          <label htmlFor="expectedDate">Expected Date:</label>
          <input
            type="text"
            name="expectedDate"
            onChange={handleChange}
            value={formData.expectedDate}
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
              onClick={() => {
                setIsAdding(false);
                refreshIpos();
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

export default AddNewIpos;
