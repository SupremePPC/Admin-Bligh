import React from 'react';

const Table = ({ users, handleEdit, handleDelete }) => {
  
  return (
    <div className="contain-table">
      <table className="striped-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th colSpan={2} className="text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
           users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.mobilePhone}</td>
                <td className="text-right">
                  <button
                    onClick={() => handleEdit(user)}
                    className="button muted-button"
                  >
                    Edit
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
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>No User</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
