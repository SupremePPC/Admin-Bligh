import React from 'react';

const Table = ({ users, handleEdit, handleDelete, handleDownload }) => {
  users.forEach((user, i) => {
    user.id = i + 1;
  });

  return (
    <div className="contain-table">
      <table className="striped-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Full Name</th>
            <th>Upload Name</th>
            {/* <th>Salary</th> */}
            <th>Date</th>
            <th colSpan={2} className="text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, i) => (
              <tr key={user.id}>
                <td>{i + 1}</td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.date} </td>
                <td className="text-right">
                  <button
                    onClick={() => handleEdit(user.id)}
                    className="button muted-button"
                  >
                    View
                  </button>
                </td>
                <td className="text-left">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="button muted-button"
                  >
                    Delete
                  </button>
                </td>
                <td className="text-left">
                  <button
                    onClick={() => handleDownload(user.id)}
                    className="button muted-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>No users</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
