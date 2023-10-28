import React, { useState } from "react";
import Swal from "sweetalert2";
import { addBankingDetails, updateBankingDetails } from "../../firebaseConfig/firestore";
import LoadingScreen from "../LoadingScreen/index";
import Edit from "./Edit";

const Add = ({ userId, onClose, refreshDetails }) => {
  const[isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBankingDetail, setSelectedBankingDetail] = useState(null);
  const [bankingDetailId, setBankingDetailId] = useState(null);

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
        const uid = userId.userId;
        const result = await addBankingDetails(uid, accountName, bankName, branch, bsbNumber, accountNumber);
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: `Banking details have been added for ${accountName}.`,
          showConfirmButton: false,
          timer: 2000,
        });
  
        setBankingDetailId(result.id);
        setIsEditing(true);
        setSelectedBankingDetail(formData);
        // refreshDetails();
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
    <>
    {!isEditing && (
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
            inputMode="numeric"
            type="number"
            name="bsbNumber"
            value={formData.bsbNumber}
            onChange={handleInputChange}
            min={0}
          />
          <label htmlFor="accountNumber">Account Number</label>
          <input
            id="accountNumber"
            inputMode="numeric"
            type="number"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleInputChange}
            min={0}
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
    )}
    {
      isEditing && selectedBankingDetail && (
        <Edit
        onClose={() => {
          setIsEditing(false);
          setSelectedBankingDetail(null);
          onClose();
        }}
        bankingDetails={selectedBankingDetail}
        bankingDetailsId={bankingDetailId}
        userId={userId}
        refreshDetails={refreshDetails}
        />
      )
    }
    </>
  );
};

export default Add;
