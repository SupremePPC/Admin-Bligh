import React, { useState } from "react";
import { addTermToUserCollection } from "../../firebaseConfig/firestore";
import LoadingScreen from "../LoadingScreen";
import CurrencyInput from 'react-currency-input-field';
import "firebase/firestore";
import Swal from "sweetalert2";

const AddNewTerm = ({ setFixedTerm, fixedTerm, userId, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    bankName: "",
    date: "",
    interestRate: 0,
    logo: "",
    minAmount: 0,
    status: "",
    term: "",
    type: "",
    userId: "",
  });

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Check if the field is a monetary value (minAmount)
    if (name === "minAmount") {
      // Format the value with commas and two decimal places
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

    if (
      !formData.logo ||
      !formData.bankName ||
      !formData.minAmount ||
      !formData.interestRate ||
      !formData.term ||
      !formData.type
    ) {
      setIsLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "All fields are required.",
        showConfirmButton: true,
      });
    }

    const newData = {
      bankName: formData.bankName,
      date: getCurrentDate(),
      interestRate: parseFloat(formData.interestRate.replace(/,/g, "")), // Convert to a float
      logo: formData.logo,
      principalAmount: parseFloat(formData.minAmount.replace(/,/g, "")), // Convert to a float
      status: formData.status,
      term: formData.term,
      type: formData.type,
      userId: userId.userId,
    };
    console.log(newData);
    try {
      await addTermToUserCollection(userId, newData);
      Swal.fire({
        icon: "success",
        title: "Added!",
        text: `Term added successfully.`,
        showConfirmButton: false,
        timer: 2000,
      });
      setFormData({
        bankName: "",
        interestRate: 0,
        logo: "",
        minAmount: "0.00", // Reset to string
        status: "",
        term: "",
        type: "",
      });
      // setFixedTerm([...fixedTerm, { ...newData, id: result.id }]);
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
          <h3>Add New Term for {userId.userId}</h3>
          <label htmlFor="logo">Logo:</label>
          <input
            type="url"
            name="logo"
            onChange={handleChange}
            value={formData.logo}
            title="Must be a URL"
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
          <CurrencyInput
            decimalSeparator="."
            prefix="€"
            name="minAmount"
            placeholder="0.00"
            defaultValue={0.00}
            decimalsLimit={2}
            onValueChange={formData.minAmount}
          />
          <label htmlFor="interestRate">Interest Rate:</label>
          <input
            type="number"
            name="interestRate"
            onChange={handleChange}
            value={formData.interestRate}
            required
          />
           <label htmlFor="accountType">Term Type</label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value })
            }
          >
            <option value="">--Select--</option>
            <option value="Deposit">Deposit</option>
            <option value="Withdrawal">Withdrawal</option>
          </select>
           <label htmlFor="accountType">Status</label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <option value="">--Select--</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Declined">Declined</option>
          </select>
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

export default AddNewTerm;
