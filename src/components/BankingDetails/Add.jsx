import React, { useState } from "react";
import Swal from "sweetalert2";
import { addBankingDetails } from "../../firebaseConfig/firestore";
import LoadingScreen from "../LoadingScreen/index";

const Add = ({ userId, onClose }) => {
  const[isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
      accountName: "",
      bankName: "",
      bsbNumber: "",
      accountNumber: "",
      branch: "",
    });
  
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      const { accountName, bankName, bsbNumber, accountNumber, branch } = formData;
  
      if (!accountName || !bankName || !bsbNumber || !accountNumber || !branch) {
        return Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'All fields are required.',
          showConfirmButton: true,
        });
      }
  
      try {
        await addBankingDetails(userId.userId, accountName, bankName, branch, bsbNumber, accountNumber);
        
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: `Banking details have been added for ${accountName}.`,
          showConfirmButton: false,
          timer: 2000,
        });
  
        onClose();
      } catch (error) {
        console.error("Error adding banking details:", error);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "There was an error adding the banking details.",
          showConfirmButton: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
  

  return (
    <div className="small-container">
        {
          isLoading ? ( <LoadingScreen /> ) :
        (
      <form onSubmit={handleSubmit}>
        <h1>Add Banking Details</h1>
        <label htmlFor="accountName">Account Name</label>
        <input
          id="accountName"
          type="text"
          name="accountName"
          value={formData.accountName}
          onChange={handleInputChange}
        />
        <label htmlFor="bankName">Bank Name</label>
        <input
          id="bankName"
          type="text"
          name="bankName"
          value={formData.bankName}
          onChange={handleInputChange}
        />
        <label htmlFor="branch">Branch</label>
        <input
          id="branch"
          type="text"
          name="branch"
          value={formData.branch}
          onChange={handleInputChange}
        />
        <label htmlFor="bsbNumber">BSB Number</label>
        <input
          id="bsbNumber"
          type="number"
          name="bsbNumber"
          value={formData.bsbNumber}
          onChange={handleInputChange}
        />
        <label htmlFor="accountNumber">Account Number</label>
        <input
          id="accountNumber"
          type="text"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleInputChange}
        />
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
      </form>
        )}
    </div>
  );
};

export default Add;
