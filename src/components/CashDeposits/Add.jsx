import React, { useState } from "react";
import Swal from "sweetalert2";
import CurrencyInput from "react-currency-input-field";
import { addCashDeposit } from "../../firebaseConfig/firestore";
import LoadingScreen from "../LoadingScreen";
import EditCashDeposits from "./Edit";

const AddCashDeposits = ({
  cashDeposits,
  setCashDeposits,
  userId,
  onClose,
  refreshDetails,
}) => {
  const [formData, setFormData] = useState({
    amount: 0.0,
    type: "Deposit",
    depositRef: "",
    status: "Cleared",
    depositType: "",
    date: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCashDeposit, setSelectedCashDeposit] = useState(null);

  const handleAdd = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { amount, type, depositRef, depositType, status, date } = formData;

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
      type: "Deposit",
      depositType,
      depositRef,
      status,
      date,
    };

    try {
      const result = await addCashDeposit(userId.userId, newCashDeposit);

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Cash deposit has been added.",
          showConfirmButton: false,
          timer: 2000,
        });

        // Update the state and form data
        setCashDeposits([
          ...cashDeposits,
          { ...newCashDeposit, id: result.id },
        ]);

        setFormData({
          amount: 0.0,
          depositType,
          type: "Deposit",
          depositRef: "",
          status: "Cleared",
          date: "",
        });

        setSelectedCashDeposit({ ...newCashDeposit, id: result.id });
        setIsEditing(true);
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
          {isLoading && <LoadingScreen />}
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

            <label htmlFor="depositType">Type</label>
            <input
              type="text"
              name="depositType"
              value={formData.depositType}
              onChange={(e) =>
                setFormData({ ...formData, depositType: e.target.value })
              }
            />

            <label htmlFor="depositRef">Reference</label>
            <input
              name="depositRef"
              type="text"
              value={formData.depositRef}
              onChange={(e) =>
                setFormData({ ...formData, depositRef: e.target.value })
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
              {/* <option value="Pending">Pending</option> */}
              <option value="Cleared">Cleared</option>
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
        </div>
      )}
      {isEditing && (
        <EditCashDeposits
          onClose={() => {
            setIsEditing(false);
            setSelectedCashDeposit(null);
            onClose();
          }}
          selectedCashDeposit={selectedCashDeposit}
          userId={userId}
          refreshDetails={refreshDetails}
        />
      )}
    </>
  );
};

export default AddCashDeposits;
