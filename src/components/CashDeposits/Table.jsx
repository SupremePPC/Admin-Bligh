import React from "react";
import { formatNumber } from "../../firebaseConfig/firestore";

const CashDepositsTable = ({ cashDeposits, openEdit, handleDelete }) => {

  return (
    <div className="contain-table">
      <table className="striped-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th>Type</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Reference</th>
            <th>Status</th>
            {/* <th>Actions</th> */}
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
                  <td>{cashDeposit.userName}</td>
                  <td>{cashDeposit.type}</td>
                  <td>{formattedDate}</td>
                  <td>$ {formatNumber(cashDeposit.amount)}</td>
                  <td>{cashDeposit.depositRef}</td>
                  <td>{cashDeposit.status}</td>
                  {/* <td className="text-right">
                    <button
                      onClick={openEdit} // Handle edit action
                      className="button edit_btn muted-button"
                    >
                      Edit
                    </button>
                  </td>
                  <td className="text-left">
                    <button
                      onClick={() => handleDelete(cashDeposit.id, )} // Handle delete action
                      className="button delete_btn muted-button"
                    >
                      Delete
                    </button>
                  </td> */}
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
