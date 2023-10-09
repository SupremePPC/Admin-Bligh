import React, { useState } from "react";
import "firebase/firestore";
import Swal from "sweetalert2";
import { addTermToUserCollection } from "../../firebaseConfig/firestore";
import LoadingScreen from "../LoadingScreen";

const AddNewTerm = ({ setFixedTerm, fixedTerm, userId }) => {
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
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { logo, bankName, minAmount, interestRate, term } = formData;

    if (!logo || !bankName || !minAmount || !interestRate || !term) {
      setIsLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "All fields are required.",
        showConfirmButton: true,
      });
    }

    const newTerm = {
      logo,
      bankName,
      minAmount,
      interestRate,
      term,
    };

    try {
      const result = await addTermToUserCollection(userId.userId, newTerm);
      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: `Term added successfully.`,
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
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Error adding term: ${error}`,
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
