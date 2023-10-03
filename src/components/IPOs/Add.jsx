import React, { useState } from "react";
import "firebase/firestore";
import Swal from "sweetalert2";
import { addNewIpos } from "../../firebaseConfig/firestore";
import LoadingScreen from "../LoadingScreen";

const AddNewIpos = ({ setIsAdding, refreshIpos }) => {
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
    try {
      await addNewIpos(formData);
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
          <input
            type="number"
            min={0}
            name="expListingPrice"
            onChange={handleChange}
            value={formData.expListingPrice}
          />
          <label htmlFor="expectedate">Expected Date:</label>
          <input
            type="text"
            name="expectedate"
            onChange={handleChange}
            value={formData.expectedate}
          />
          <label htmlFor="minInvestment">Minimum Investment:</label>
          <input
            type="number"
            min={0}
            name="minInvestment"
            onChange={handleChange}
            value={formData.minInvestment}
          />
          <label htmlFor="preAllocation">Pre Allocation:</label>
          <input
            type="text"
            name="preAllocation"
            onChange={handleChange}
            value={formData.preAllocation}
          />
          <label htmlFor="preSharePrice">Pre Share Price:</label>
          <input
            type="number"
            name="preSharePrice"
            onChange={handleChange}
            value={formData.preSharePrice}
          />
          <label htmlFor="sharePrice">Share Price:</label>
          <input
            type="number"
            name="sharePrice"
            onChange={handleChange}
            value={formData.sharePrice}
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
