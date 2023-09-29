import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";

const Add = ({ userId, onClose }) => {
    const [formData, setFormData] = useState({
      accountName: "",
      bankName: "",
      iban: "",
      swiftCode: "",
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
  
      const { accountName, bankName, iban, swiftCode, branch } = formData;
  
      if (!accountName || !bankName || !iban || !swiftCode || !branch) {
        return Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'All fields are required.',
          showConfirmButton: true,
        });
      }
  
      try {
        await addBankingDetails(userId, accountName, bankName, branch, iban, swiftCode);
        
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
      }
    };
  

  return (
    <div className="small-container">
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
        <label htmlFor="iban">Iban</label>
        <input
          id="iban"
          type="number"
          name="iban"
          value={formData.iban}
          onChange={handleInputChange}
        />
        <label htmlFor="date">Swift Code</label>
        <input
          id="swiftCode"
          type="text"
          name="swiftCode"
          value={formData.swiftCode}
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
    </div>
  );
};

export default Add;
