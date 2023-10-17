import React from 'react';

const Table = ({ bankingDetails, handleEdit, handleDelete }) => {
  
  return (
    <div className="contain-table">
      <table className="striped-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Full Name</th>
            <th>Bank Name</th>
            <th>Branch Address</th>
            <th>BSB Number</th>
            <th>Account Number</th>
            <th colSpan={2} className="text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {bankingDetails.length > 0 ? (
            bankingDetails.map((detail, i) => (
              <tr key={detail.id}>
                <td>{i + 1}</td>
                <td>{detail.accountName}</td>
                <td>{detail.bankName}</td>
                <td>{detail.branch}</td>
                <td>{detail.bsbNumber} </td>
                <td>{detail.accountNumber} </td>
                <td className="text-right">
                  <button
                    onClick={() => handleEdit(detail.id)}
                    className="button muted-button"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>No Banking Details</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
