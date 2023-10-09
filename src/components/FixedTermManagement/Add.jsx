import React, { useState } from "react";
import "firebase/firestore";
import Swal from "sweetalert2";
import { addTermToUserCollection } from "../../firebaseConfig/firestore";
import LoadingScreen from "../LoadingScreen";

const AddNewTerm = ({ setIsAdding, refreshTerm }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    logo: "",
    bankName: "",
    minAmount: 0,
    interestRate: 0,
    term: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Check if the field is a monetary value (couponRate, currentValue, minAmount, quantity)
    if (["minAmount"].includes(name)) {
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
    try {
      const formattedData = {
        ...newTerm,
        minAmount: parseFloat(formData.minAmount.replace(/,/g, "")),
      };
      await addNewTerm(formattedData);
      Swal.fire({
        icon: "success",
        title: "Added!",
        text: `Term added succesfully.`,
        showConfirmButton: false,
        timer: 2000,
      });
      setFormData({
        logo: "",
        bankName: "",
        minAmount: 0,
        interestRate: 0,
        term: "",
      });
      setIsAdding(false);
      refreshTerm();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Error adding term: ${error}`,
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
          <h1>Add New Term</h1>
          <label htmlFor="logo">Logo:</label>
          <input
            type="url"
            name="logo"
            onChange={handleChange}
            value={formData.logo}
            title="Must be a url"
            required
          />
          <label htmlFor="bankName">Bank Name:</label>
          <input
            type="text"
            name="bankName"
            onChange={handleChange}
            value={formData.bankName}
            required
          />
          <label htmlFor="term">Terms:</label>
          <input
            type="text"
            name="term"
            onChange={handleChange}
            value={formData.term}
            required
          />
          <label htmlFor="minAmount">Minimum Amount:</label>
          <input
            type="number"
            min={0}
            name="minAmount"
            onChange={handleChange}
            value={formData.minAmount}
            required
          />
          <label htmlFor="interestRate">Interest Rate:</label>
          <input
            type="number"
            name="interestRate"
            onChange={handleChange}
            value={formData.interestRate}
            required
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
                refreshTerm();
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

export default AddNewTerm;
