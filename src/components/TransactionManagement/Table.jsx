import React from "react";

const Table = ({ transactions, handleApproval, handleRejection }) => {
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
            <th>Full Name</th>
            <th>Amount</th>
            <th>Account</th>
            <th>Type</th>
            <th>Status</th>
            <th>Date</th>
            <th colSpan={2} className="text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((transaction, i) => {
              const dateObject = transaction.date.toDate
                ? transaction.date.toDate()
                : new Date(transaction.date);
              const day = String(dateObject.getDate()).padStart(2, "0");
              const month = String(dateObject.getMonth() + 1).padStart(2, "0"); // Month is 0-based, so we add 1
              const year = dateObject.getFullYear();
              const formattedDate = `${day}/${month}/${year}`;

              return (
                <tr key={transaction.id}>
                  <td>{i + 1}</td>
                  <td>{transaction.userName}</td>
                  <td>{formatter.format(transaction.amount)}</td>
                  <td>{transaction.accountType}</td>
                  <td>{transaction.type}</td>
                  <td>{transaction.status}</td>
                  <td>{formattedDate}</td>
                  <td className="text-right">
                    <button
                      onClick={() => handleApproval(transaction.id)} // This triggers the modal to open
                      className="button accept_btn muted-button"
                    >
                      Approve
                    </button>
                  </td>
                  <td className="text-left">
                    <button
                      onClick={() => handleRejection(transaction.id)} // This triggers the modal to open
                      className="button reject_btn muted-button"
                    >
                      Decline
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={8}>No Transactions</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
