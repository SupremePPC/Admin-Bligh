import React from "react";
import { BsDownload } from "react-icons/bs";

const Table = ({ users, handleDelete }) => {
  return (
    <div className="contain-table">
      <table className="striped-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>User</th>
            <th>File Description</th>
            <th colSpan={2} className="text-center">
              Actions
            </th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, i) => (
              <tr key={user.docId}>
                <td>{i + 1}</td>
                <td>{user.fullName}</td>
                <td>{user.fileDescription}</td>
                <td className="text-right">
                  <a
                    href={user.downloadURL}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="button accept_btn muted-button"
                  >
                    View
                  </a>
                </td>
                <td className="text-left">
                  <button
                    onClick={() => handleDelete(user.docId)}
                    className="button muted-button reject_btn"
                  >
                    Delete
                  </button>
                </td>
                <td>
                  <a 
                    href={user.downloadURL}
                    className="button muted-button"
                    download
                  >
                    <BsDownload />
                  </a>
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
