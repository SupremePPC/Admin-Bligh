import React, { useState } from "react";
import Swal from "sweetalert2";
import { addTransaction } from "../../firebaseConfig/firestore";
import LoadingScreen from "../LoadingScreen";

const AddTransaction = ({transactions, setTransactions, userId, setIsAdding }) => {
  const [formData, setFormData] = useState({
    amount: '',
    accountType: '',
    type: '',
    status: '',
    date: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { amount, accountType, type, status, date } = formData;

    if (!amount || !accountType || !type || !status || !date) {
      setIsLoading(false);
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }

    const newTransaction = {
      amount,
      accountType,
      type,
      status,
      date
    };

    try {
      const result = await addTransaction(userId, newTransaction);
      console.log(result);
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Added!',
          text: `Transaction has been added.`,
          showConfirmButton: false,
          timer: 3000,
        });
        setTransactions([...transactions, { ...newTransaction, id: result.id }]);
        setFormData({
          amount: '',
          accountType: '',
          type: '',
          status: '',
          date: ''
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `${error}`,
        showConfirmButton: true,
        timer: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="small-container">
       {isLoading ? <LoadingScreen /> : (
      <form onSubmit={handleAdd}>
        <h1>Add Transaction</h1>
        <label htmlFor="accountType">Account Type</label>
        <select
          id="accountType"
          value={formData.accountType}
          onChange={(e) => setFormData({...formData, accountType: e.target.value})}
        >
          <option value="">--Select--</option>
          <option value="Easy Access">Easy Access</option>
          <option value="1 Year Fixed Saver">1 Year Fixed Saver</option>
          <option value="3 Year Fixed Saver">3 Year Fixed Saver</option>
          <option value="5 Year Fixed Saver">5 Year Fixed Saver</option>
        </select>
       
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        />

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
          <input type="submit" value="Add" />
          <input
            style={{ marginLeft: "12px" }}
            className="muted-button"
            type="button"
            value="Cancel"
            onClick={() => setIsAdding(false)}
          />
        </div>
      </form>
       )}
    </div>
  );
};

export default AddTransaction;
