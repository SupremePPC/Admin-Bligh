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
            
              return (
                <tr key={cashDeposit.id}>
                  <td>{i + 1}</td>
                  <td>{cashDeposit.userName}</td>
                  <td>{cashDeposit.depositType}</td>
                  <td>{cashDeposit.date}</td>
                  <td>$ {formatNumber(cashDeposit.amount)}</td>
                  <td>{cashDeposit.depositRef}</td>
                  <td>{cashDeposit.status}</td>
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
