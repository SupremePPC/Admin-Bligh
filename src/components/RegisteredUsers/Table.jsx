import React from "react";
import { Link } from "react-router-dom";

export default function Table({
  users,
  handleEdit,
  handleDelete,
  searchResults,
}) {
  const dataToDisplay = searchResults.length > 0 ? searchResults : users;

  return (
    <div className="contain-table">
      <table className="striped-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th colSpan={3} className="text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {dataToDisplay.length > 0 ? (
            dataToDisplay.map((user, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.mobilePhone}</td>
                <td>
                  <Link to={`/dashboard/user-overview/${user.id}`} className="button muted-button" >
                    View
                  </Link>
                </td>
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
              <td colSpan={7}>No Users</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
