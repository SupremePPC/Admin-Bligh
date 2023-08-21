import React from "react";

const Header = ({ setIsAdding }) => {
  return (
    <header>
      <h1 className="header_title">All Registered Users</h1>
      <div className="addRow_btn">
        <button onClick={() => setIsAdding(true)}>Add User</button>
      </div>
    </header>
  );
};

export default Header;
