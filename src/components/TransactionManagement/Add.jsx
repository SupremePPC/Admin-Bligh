import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { addTransaction } from '../../firebaseConfig/firestore';
import CurrencyInput from 'react-currency-input-field';

const AddTransaction = ({ setTransactions, setIsAdding, userId, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    amount: "0.00", // Initialize amount with a string value
    accountType: "",
    type: "",
    status: "",
    date: "",
  });

  const handleUpdate = async (e) => {
    e.preventDefault();

    const { fullName, amount, accountType, type, status, date } = formData;

    if (!fullName || !amount || !accountType || !type || !status || !date) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }

    const formattedAmount = parseFloat(amount.replace(/,/g, '')).toFixed(2);
    const newTransaction = {
      fullName,
      amount: formattedAmount,
      accountType,
      type,
      status,
      date,
    };

    try {
      const result = await addTransaction(userId, newTransaction);

      if (result.success) {
        setTransactions((prevTransactions) => [
          ...prevTransactions,
          { ...newTransaction, id: result.id },
        ]);
        setIsAdding(false);
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `Transaction for ${fullName} has been added.`,
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        throw new Error('Failed to add transaction');
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if the field is the "amount" field
    if (name === 'amount') {
      // Format the value with commas and two decimal places
      const formattedValue = parseFloat(value.replace(/,/g, '')).toFixed(2);
      setFormData({
        ...formData,
        [name]: formattedValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
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
          value={formData.fullName}
          onChange={handleChange}
        />
        <label htmlFor="amount">Amount</label>
        <CurrencyInput
            decimalSeparator="."
            prefix="€"
            name="amount"
            placeholder="0.00"
            defaultValue={0.00}
            decimalsLimit={2}
            onValueChange={formData.amount}
          />
        <label htmlFor="accountType">Account Type</label>
        <select
          id="accountType"
          value={formData.accountType}
          onChange={handleChange}
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
          onChange={handleChange}
        >
          <option value="">--Select--</option>
          <option value="Deposit">Deposit</option>
          <option value="Withdrawal">Withdrawal</option>
        </select>
        <label htmlFor="status">Status</label>
        <select
          id="status"
          value={formData.status}
          onChange={handleChange}
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
          onChange={handleChange}
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
