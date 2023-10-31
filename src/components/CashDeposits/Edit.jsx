import React, { useState } from "react";
import Swal from "sweetalert2";
import {
  deleteCashDeposit,
  updateCashDeposit,
} from "../../firebaseConfig/firestore";
import LoadingScreen from "../LoadingScreen";
import CurrencyInput from "react-currency-input-field";

const EditCashDeposits = ({
  selectedCashDeposit,
  onClose,
  totalBalance,
  userId,
  refreshDetails,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: selectedCashDeposit.amount,
    type: selectedCashDeposit.type,
    reference: selectedCashDeposit.reference,
    status: selectedCashDeposit.status,
    date: selectedCashDeposit.date,
  });

  const { amount, type, reference, status, date } = formData;

  const handleDelete = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await deleteCashDeposit(userId.userId, selectedCashDeposit.id);

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Cash deposit has been deleted.",
          showConfirmButton: false,
          timer: 2000,
        });

        refreshDetails();
        onClose();
      } else {
        throw new Error("Failed to delete the cash deposit.");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Error deleting cash deposit: ${error}`,
        showConfirmButton: false,
        timer: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurrencyChange = (value, name) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const updatedCashDeposit = {
      amount: parseFloat(amount), // Convert the amount to a float
      type,
      reference,
      status,
      date,
    };

    if (
      amount === selectedCashDeposit.amount &&
      type === selectedCashDeposit.type &&
      reference === selectedCashDeposit.reference &&
      status === selectedCashDeposit.status &&
      date === selectedCashDeposit.date
    ) {
      Swal.fire({
        icon: "warning",
        title: "No changes were made",
        text: "No updates were performed as no changes were detected.",
        showConfirmButton: false,
        timer: 2000,
      });
    }

    try {
      const result = await updateCashDeposit(userId.userId, selectedCashDeposit.id, updatedCashDeposit);

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Cash deposit has been updated.",
          showConfirmButton: false,
          timer: 2000,
        });

        refreshDetails();
        onClose();
      } else {
        throw new Error("Failed to update the cash deposit.");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: `Error updating cash deposit: ${error}`,
        showConfirmButton: false,
        timer: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="small-container">
        {isLoading && <LoadingScreen /> }
      <form onSubmit={handleUpdate}>
        <h1>Edit Cash Deposit</h1>
        <label htmlFor="amount">Amount</label>
        <CurrencyInput
          decimalSeparator="."
          prefix="$"
          name="amount"
          placeholder="0.00"
          value={formData.amount}
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
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="Pending">Pending</option>
          <option value="Approved">Cleared</option>
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
            type="button"
            value="Delete"
            onClick={handleDelete}
            className="reject_btn"
          />
          <input
            type="button"
            value="Cancel"
            onClick={onClose}
          />
        </div>
      </form>
    </div>
  );
};

export default EditCashDeposits;
