import React, { useState } from "react";
import Swal from "sweetalert2";
import { editTransaction } from "../../firebaseConfig/firestore";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import LoadingScreen from "../LoadingScreen";

const EditTransaction = ({
  selectedTransaction,
  onClose,
  totalBalance,
  userId,
  refreshDetails,
}) => {
  const transactionId = selectedTransaction.id;
    const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: selectedTransaction.amount,
    accountType: selectedTransaction.accountType,
    type: selectedTransaction.type,
    status: selectedTransaction.status,
    date: selectedTransaction.date,
  });

  const {
    amount,
    accountType,
    type,
    status,
    date,
  } = formData;
  

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    const updatedTransaction = {
      amount: parseFloat(amount), // Convert the amount to a float
      accountType,
      type,
      status,
      date,
    };
  
    const uid = userId.userId;
  
    try {
      const result = await editTransaction(uid, transactionId, updatedTransaction);
      if (result.success) {
        const accountTypeRef = collection(db, "users", userId.userId, "accountTypes");
        const docRef = doc(accountTypeRef, accountType);
  
        // Check if the document exists before updating
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          // Document exists, update the amount based on transaction type and status
          const existingData = docSnap.data();
          let updatedAmount = existingData.amount;
  
          if (type === "Deposit") {
            updatedAmount + updatedTransaction.amount;
          } else if (type === "Withdrawal") {
            updatedAmount - updatedTransaction.amount;
          }
  
          if (status !== "Approved") {
            // If status is not "Approved," don't update the transaction amount in the doc
            updatedAmount = existingData.amount;
          }
  
          // Check if the label has changed and update it
          if (existingData.label !== accountType) {
            await updateDoc(docRef, {
              label: accountType,
              amount: updatedAmount,
            });
          } else {
            await updateDoc(docRef, { amount: updatedAmount });
          }
        } else {
          // Document doesn't exist, create a new one
          await setDoc(docRef, {
            label: accountType,
            amount: updatedTransaction.amount,
          });
        }
  
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: `Transaction has been updated.`,
          showConfirmButton: false,
          timer: 2000,
        });
        refreshDetails();
        onClose();
      } else {
        throw new Error("Failed to update the transaction");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Error updating transaction: ${error}`,
        showConfirmButton: false,
        timer: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="small-container">
      <form onSubmit={handleUpdate}>
        <h1>Edit Transaction</h1>
        {
          isLoading && ( <LoadingScreen /> )
        }
        <div className="text_wrap">
          <label>
            Total Balance: {totalBalance === "0.00" ? "0.00" : totalBalance}
          </label>
        </div>
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          value={formData.amount}
          onChange={(e) =>
            setFormData({ ...formData, amount: e.target.value })
          }
        />
        <label htmlFor="accountType">Account Type</label>
        <select
          id="accountType"
          value={formData.accountType}
          onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
        >
          <option value="">--Select--</option>
          <option value="Easy Access">Easy Access</option>
          <option value="1 Year Fixed Saver">1 Year Fixed Saver</option>
          <option value="3 Year Fixed Saver">3 Year Fixed Saver</option>
          <option value="5 Year Fixed Saver">5 Year Fixed Saver</option>
        </select>
        <label htmlFor="type">Transaction Type</label>
        <select
          id="type"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        >
          <option value="">--Select--</option>
          <option value="Deposit">Deposit</option>
          <option value="Withdrawal">Withdrawal</option>
        </select>
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="">--Select--</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Declined">Declined</option>
        </select>
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
    </div>
  );
};

export default EditTransaction;
