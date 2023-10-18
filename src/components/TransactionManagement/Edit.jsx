import React, { useState } from "react";
import Swal from "sweetalert2";
import { editTransaction } from "../../firebaseConfig/firestore";

const EditTransaction = ({
  transactions,
  selectedTransactions,
  setTransactions,
  totalBalance,
  // setIsEditing,
  // transactionId,
  // userId,
  onClose
}) => {

  const {
    id: transactionId,
    userId,
    fullName: initFullName,
    amount: initAmount,
    accountType: initAccountType,
    type: initType,
    status: initStatus,
    date: initDate,
  } = selectedTransactions;

  const [fullName, setFullName] = useState(initFullName);
  const [amount, setAmount] = useState(initAmount);
  const [accountType, setAccountType] = useState(initAccountType);
  const [type, setType] = useState(initType);
  const [status, setStatus] = useState(initStatus);
  const [date, setDate] = useState(initDate);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!fullName || !amount || !accountType || !type || !status || !date) {
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "All fields are required.",
        showConfirmButton: true,
      });
    }

       const updatedTransaction = {
      fullName,
      amount,
      accountType,
      type,
      status,
      date,
    };

    try {
      const result = await editTransaction(userId, transactionId, updatedTransaction);
      
      if (result.success) {
        const updatedTransactions = transactions.map(t => 
          t.id === transactionId ? { ...t, ...updatedTransaction } : t
        );
        setTransactions(updatedTransactions);
        // setIsEditing(false);
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `Transaction for ${fullName} has been updated.`,
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        throw new Error("Failed to update the transaction");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Error updating transaction: ${error}`,
        showConfirmButton: true,
      });
    }
  };

  return (
    <div className="small-container">
      <form onSubmit={handleUpdate}>
        <h1>Edit Transaction</h1>
        <div className="text_wrap">
            <label>
              Total Balance: {" "}
              {totalBalance === "0.00" ? "0.00" : totalBalance}
            </label>
          </div>
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <label htmlFor="accountType">Account Type</label>
        <select
          id="accountType"
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
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
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">--Select--</option>
          <option value="Deposit">Deposit</option>
          <option value="Withdrawal">Withdrawal</option>
        </select>
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
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
          value={date}
          onChange={(e) => setDate(e.target.value)}
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
