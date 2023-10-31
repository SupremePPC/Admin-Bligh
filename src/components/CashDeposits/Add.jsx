import React, { useState } from "react";
import Swal from "sweetalert2";
import CurrencyInput from "react-currency-input-field";
import { addCashDeposit } from "../../firebaseConfig/firestore";
import LoadingScreen from "../LoadingScreen";

const AddCashDeposits = ({
  cashDeposits,
  setCashDeposits,
  userId,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    amount: 0.0,
    type: "Deposit",
    date: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { amount, type, date } = formData;

    if (!amount || !type || !date) {
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

    const newCashDeposit = {
      amount: formattedAmount,
      type,
      date,
    };

    try {
      const result = await addCashDeposit(userId, newCashDeposit);

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Cash deposit has been added.",
          showConfirmButton: false,
          timer: 3000,
        });

        // Update the state and form data
        setCashDeposits([
          ...cashDeposits,
          { ...newCashDeposit, id: result.id },
        ]);

        setFormData({
          amount: 0.0,
          type: "Deposit",
          date: "",
        });

        onClose();
      } else {
        throw new Error("Failed to add cash deposit.");
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
              <h1>Add Cash Deposit</h1>
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

              <label htmlFor="type">Deposit Type</label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="Deposit">Deposit</option>
                <option value="Withdrawal">Withdrawal</option>
              </select>

              <label htmlFor="reference">Reference</label>
              <input
                id="reference"
                type="text"
                value={formData.reference}
                onChange={(e) =>
                  setFormData({ ...formData, reference: e.target.value })
                }
              />

              <label htmlFor="status">Status</label>
                <select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                    }
                >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Cleared</option>
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

export default AddCashDeposits;
