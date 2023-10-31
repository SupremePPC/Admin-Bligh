import React from "react";

const CashDepositsTable = ({ cashDeposits, handleEdit, handleDelete }) => {
  const formatter = new Intl.NumberFormat("en-MT", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: null,
  });

  return (
    <div className="contain-table">
      <table className="striped-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Type</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Reference</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cashDeposits === null || cashDeposits.length === 0 ? ( // Check if cashDeposits is null or empty
            <tr>
              <td colSpan={7}>No Cash Deposits</td>
            </tr>
          ) : (
            cashDeposits.map((cashDeposit, i) => {
              const dateObject = cashDeposit.date.toDate
                ? cashDeposit.date.toDate()
                : new Date(cashDeposit.date);
              const day = String(dateObject.getDate()).padStart(2, "0");
              const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Month is 0-based, so we add 1
              const year = dateObject.getFullYear();
              const formattedDate = `${day}/${month}/${year}`;

              return (
                <tr key={cashDeposit.id}>
                  <td>{i + 1}</td>
                  <td>{cashDeposit.type}</td>
                  <td>{formattedDate}</td>
                  <td>{formatter.format(cashDeposit.amount)}</td>
                  <td>{cashDeposit.reference}</td>
                  <td>{cashDeposit.status}</td>
                  <td className="text-center">
                    <button
                      onClick={() => handleEdit(cashDeposit.id)} // Handle edit action
                      className="button edit_btn muted-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cashDeposit.id)} // Handle delete action
                      className="button delete_btn muted-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CashDepositsTable;
