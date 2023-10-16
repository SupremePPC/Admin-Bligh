import React, { useState } from "react";
import Swal from "sweetalert2";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import LoadingScreen from "../LoadingScreen/index";

const Edit = ({ userId, bankingDetailsId, bankingDetails, onClose }) => {
  const [formData, setFormData] = useState(bankingDetails);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!accountName || !bankName || !branch || !bsbNumber || !accountNumber) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "All fields are required.",
        showConfirmButton: true,
      });
    }

    const updatedDetails = {
      ...formData,
    };

    // If updatedUser is empty, exit the function
    if (Object.keys(updatedDetails).length === 0) {
      Swal.fire({
        icon: "info",
        title: "No Changes",
        text: "No changes were made.",
        showConfirmButton: true,
      });
      return;
    }

    try {
      const bankingDetailsRef = doc(
        db,
        "users",
        userId.userId,
        "bankingDetails",
        bankingDetailsId
      );
      await updateDoc(bankingDetailsRef, updatedDetails);
      window.location.reload();
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `${updatedDetails.accountName}'s data has been updated.`,
        showConfirmButton: false,
        timer: 2000,
      });

      // Close the edit form
      onClose();
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "There was an error updating the user.",
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
        <form onSubmit={handleUpdate}>
          <h1>Edit Banking Details</h1>
          <label htmlFor="accountName">Account Name</label>
          <input
            id="accountName"
            type="text"
            name="accountName"
            value={formData.accountName}
            onChange={handleChange}
          />
          <label htmlFor="bankName">Bank Name</label>
          <input
            id="bankName"
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
          />
          <label htmlFor="branch">Branch</label>
          <input
            id="branch"
            type="text"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
          />
          <label htmlFor="bsbNumber">BSB Number</label>
          <input
            id="bsbNumber"
            type="number"
            name="bsbNumber"
            value={formData.bsbNumber}
            onChange={handleChange}
          />
          <label htmlFor="accountNumber">Swift Code</label>
          <input
            id="accountNumber"
            type="number"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
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
        </form>
      )}
    </div>
  );
};

export default Edit;
