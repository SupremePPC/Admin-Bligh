import React, { useState } from "react";
import "firebase/firestore";
import Swal from "sweetalert2";
import { addNewTerm } from "../../firebaseConfig/firestore";
import LoadingScreen from "../LoadingScreen";

const AddNewTerm = ({ setIsAdding, refreshTerm }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    logo: "",
    bankName: "",
    minAmount: 0,
    coupon: 0,
    term: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // const validateForm = () => {
  //   let isValid = true;
  //   const newErrors = {};

  //   if (!formData.isin) {
  //     newErrors.isin = "ISIN is required";
  //     isValid = false;
  //   }

  //   if (!formData.issuerName) {
  //     newErrors.issuerName = "Issuer Name is required";
  //     isValid = false;
  //   }

  //   setErrors(newErrors);
  //   return isValid;
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!validateForm()) return;
    setIsLoading(true);
    try {
      await addNewTerm(formData);
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
        coupon: 0,
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
          <label htmlFor="minimumAmount">Minimum Amount:</label>
          <input
            type="number"
            min={0}
            name="minAmount"
            onChange={handleChange}
            value={formData.minAmount}
            required
          />
          <label htmlFor="couponRate">Interest Rate:</label>
          <input
            type="number"
            name="coupon"
            onChange={handleChange}
            value={formData.coupon}
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
