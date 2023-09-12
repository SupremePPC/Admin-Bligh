import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";

const Edit = ({ userId, bankingDetailsId, bankingDetails, onClose }) => {
  const [accountName, setAccountName] = useState(bankingDetails?.accountName);
  const [bankName, setBankName] = useState(bankingDetails?.bankName);
  const [iban, setIban] = useState(bankingDetails?.iban);
  const [swiftCode, setSwiftCode] = useState(bankingDetails?.swiftCode);
  const [branch, setBranch] = useState(bankingDetails?.branch);
  
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!accountName || !bankName || !iban || !swiftCode || !branch) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }

    const updatedDetails = {
      accountName,
      bankName,
      iban,
      swiftCode,
      branch,
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
      const bankingDetailsRef = doc(db, "users", userId, "bankingDetails", bankingDetailsId);
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
    }
  };

  return (
    <div className="small-container">
      <form onSubmit={handleUpdate}>
        <h1>Edit Employee</h1>
        <label htmlFor="accountName">Account Name</label>
        <input
          id="accountName"
          type="text"
          name="accountName"
          value={accountName}
          onChange={e => setAccountName(e.target.value)}
        />
        <label htmlFor="bankName">Bank Name</label>
        <input
          id="bankName"
          type="text"
          name="bankName"
          value={bankName}
          onChange={e => setBankName(e.target.value)}
        />
        <label htmlFor="branch">Branch</label>
        <input
          id="branch"
          type="text"
          name="branch"
          value={branch}
          onChange={e => setBranch(e.target.value)}
        />
        <label htmlFor="iban">Iban</label>
        <input
          id="iban"
          type="number"
          name="iban"
          value={iban}
          onChange={e => setIban(e.target.value)}
        />
        <label htmlFor="date">Swift Code</label>
        <input
          id="swiftCode"
          type="text"
          name="swiftCode"
          value={swiftCode}
          onChange={e => setSwiftCode(e.target.value)}
        />
        <div style={{ marginTop: '30px' }}>
          <input type="submit" value="Update" />
          <input
            style={{ marginLeft: '12px' }}
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

export default Edit;
