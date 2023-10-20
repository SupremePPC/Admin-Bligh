import React, { useState } from "react";
import Swal from "sweetalert2";
import LoadingScreen from "../LoadingScreen";
import CurrencyInput from "react-currency-input-field";
import {
  addToAccount,
  addTransaction,
  getAccountTypes,
} from "../../firebaseConfig/firestore";
import EditTransaction from "./Edit";

const AddTransaction = ({
  transactions,
  setTransactions,
  userId,
  onClose,
  totalBalance,
  refreshDetails,
}) => {
  const [formData, setFormData] = useState({
    amount: 0.0,
    accountType: "",
    type: "",
    status: "",
    date: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactionId, setTransactionId] = useState(null);

  const handleAdd = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { amount, accountType, type, status, date } = formData;

    if (!amount || !accountType || !type || !status || !date) {
      setIsLoading(false);
      return Swal.fire({
        icon: "error",
        title: "Error!",
        text: "All fields are required.",
        showConfirmButton: true,
      });
    }
    // Format the amount with commas and two decimal places
    const formattedAmount = parseFloat(amount.replace(/,/g, "")).toFixed(2);

    if (type === "Withdrawal") {
      // Check if the specified accountType exists and has a balance greater than or equal to the withdrawal amount
      const accountTypes = await getAccountTypes(userId.userId);
      const targetAccount = accountTypes.find(
        (acc) => acc.label === accountType
      );
      console.log("targetAccount:", targetAccount);
      if (!targetAccount) {
        setIsLoading(false);
        return Swal.fire({
          icon: "error",
          title: "Error!",
          text: "This account does not exist.",
          showConfirmButton: true,
        });
      }

      // Check if the user is trying to withdraw all the money in the account
      if (parseFloat(targetAccount.amount) !== parseFloat(amount)) {
        setIsLoading(false);
        return Swal.fire({
          icon: "error",
          title: "Error!",
          text: "You can only withdraw the entire amount from this account.",
          showConfirmButton: true,
        });
      }

      // If the withdrawal is successful, update the accountTypes.amount to 0
      const updatedAccountType = {
        ...targetAccount,
        amount: 0,
      };
      console.log("updatedAccountType:", updatedAccountType);
      await addToAccount(
        userId.userId,
        updatedAccountType.label,
        updatedAccountType.amount
      );
    }

    if (type === "Deposit") {
      // Check if the specified accountType exists
      const accountTypes = await getAccountTypes(userId.userId);
      const targetAccount = accountTypes.find(
        (acc) => acc.label === accountType
      );
      console.log("targetAccount:", targetAccount);
      if (!targetAccount) {
        // If the account doesn't exist, create a new one with the specified amount
        await addToAccount(userId.userId, accountType, amount);
      } else {
        // If the account exists, add the amount to the existing amount
        const newAmount = parseFloat(targetAccount.amount) + parseFloat(amount);
        const updatedAccountType = {
          ...targetAccount,
          amount: newAmount,
        };
        console.log("updatedAccountType:", updatedAccountType);
        await addToAccount(
          userId.userId,
          updatedAccountType.label,
          updatedAccountType.amount
        );
      }
    }

    const newTransaction = {
      amount: formattedAmount,
      accountType,
      type,
      status,
      date,
    };

    try {
      const result = await addTransaction(userId.userId, newTransaction);
      if (result.success) {
        // Successfully added the transaction, store the ID in a variable
        const newTransactionId = result.id;
        // Successfully added the transaction, now update the Firestore accountTypes subcollection

        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Transaction has been added.",
          showConfirmButton: false,
          timer: 3000,
        });
        refreshDetails();
        // Update the state and form data
        setTransactions([
          ...transactions,
          { ...newTransaction, id: result.id },
        ]);
        setFormData({
          amount: 0.0,
          accountType: "",
          type: "",
          status: "",
          date: "",
        });
        setIsEditing(true);
        setSelectedTransaction(newTransaction);
        setTransactionId(newTransactionId);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `${error}`,
        showConfirmButton: true,
        timer: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isEditing && (
        <div className="small-container">
          {isLoading ? (
            <LoadingScreen />
          ) : (
            <form onSubmit={handleAdd}>
              <h1>Add Transaction</h1>
              <div className="text_wrap">
                <label>
                  Total Balance:{" "}
                  {totalBalance === "0.00" ? "0.00" : totalBalance}
                </label>
              </div>
              <label htmlFor="accountType">Account Type</label>
              <select
                id="accountType"
                value={formData.accountType}
                onChange={(e) =>
                  setFormData({ ...formData, accountType: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="">--Select--</option>
                <option value="Deposit">Deposit</option>
                <option value="Withdrawal">Withdrawal</option>
              </select>

              <label htmlFor="amount">Amount</label>
              <CurrencyInput
                decimalSeparator="."
                prefix="$"
                name="amount"
                placeholder="0.00"
                defaultValue={0.0}
                decimalsLimit={2}
                onValueChange={(value) => {
                  setFormData((prevState) => ({
                    ...prevState,
                    amount: value,
                  }));
                }}
              />

              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
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
      {isEditing && selectedTransaction && (
        <EditTransaction
          onClose={() => {
            setIsEditing(false);
            setSelectedTransaction(null);
            onClose();
          }}
          selectedTransaction={selectedTransaction}
          setTransactions={setTransactions}
          userId={userId}
          totalBalance={totalBalance}
          refreshDetails={refreshDetails}
          transactionId={transactionId}
        />
      )}
    </>
  );
};

export default AddTransaction;
