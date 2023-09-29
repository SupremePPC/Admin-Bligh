import React, { useState } from "react";
import "firebase/firestore";
import Swal from "sweetalert2";
import { updateTerm } from "../../firebaseConfig/firestore";
import LoadingScreen from "../LoadingScreen";

const Edit = ({ termToEdit, setIsEditPageOpen, refreshTerms }) => {
  const [formData, setFormData] = useState(termToEdit);
  const [errors, setErrors] = useState({});
  const [isLoaing, setIsLoading] = useState(false);

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
      await updateTerm(formData.id, formData);
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `Term has been updated.`,
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Error updating term: ${error}`,
        showConfirmButton: true,
        timer: 2000,
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="small-container">
      {
        isLoaing ? (
          <LoadingScreen/>
        ): (
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
          <label htmlFor="interestRate">Interest Rate:</label>
          <input
            type="number"
            name="interestRate"
            onChange={handleChange}
            value={formData.interestRate}
            required
          />
          <div style={{ marginTop: "30px" }}>
          <input type="submit" value="Edit" />
          <input
            style={{ marginLeft: "12px" }}
            className="muted-button"
            type="button"
            value="Cancel"
            onClick={() => {
              setIsEditPageOpen(false);
              refreshTerms();
            }}
          />
        </div>
          {errors.isin && <div>{errors.isin}</div>}
          {errors.issuerName && <div>{errors.issuerName}</div>}
        </form>
        )
      }
    </div>
  );
};

export default Edit;
