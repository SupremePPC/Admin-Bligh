import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { addTransaction } from '../../firebaseConfig/firestore';

const AddTransaction = ({ setTransactions, setIsAdding, userId, onClose}) => {
  const [fullName, setFullName] = useState("");
  const [amount, setAmount] = useState("");
  const [accountType, setAccountType] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
  
    if (!fullName || !amount || !accountType || !type || !status || !date) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }
  
    const newTransaction = {
      fullName,
      amount,
      accountType,
      type,
      status,
      date,
    };
  
    try {
      const result = await addTransaction(userId, newTransaction);
      if (result.success) {
        setTransactions(prevTransactions => [...prevTransactions, { ...newTrans, id: result.id }]);
        setIsAdding(false);
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `Transaction for ${fullName} has been added.`,
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        throw new Error("Failed to add transaction");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Error adding transaction: ${error}`,
        showConfirmButton: true,
      });
    }
  };
  
  return (
    <div className="small-container">
      <form onSubmit={handleUpdate}>
        <h1>Add Transaction</h1>
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
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

export default AddTransaction;
