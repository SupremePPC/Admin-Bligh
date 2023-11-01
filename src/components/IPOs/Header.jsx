import React from "react";
import { Link } from "react-router-dom";

const Header = ({ setIsAdding }) => {
  return (
    <header>
      <h1 className="header_title">IPOs Dashboard</h1>
      <div className="header__wrap">
        <div className="addRow_btn">
          <button onClick={() => setIsAdding(true)}>Add IPO</button>
        </div>
        <Link to="/dashboard/ipos-requests">
          <button>View IPO requests</button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
