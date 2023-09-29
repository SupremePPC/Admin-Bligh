import React from "react";
import { Link } from "react-router-dom";

const Header = ({ setIsAdding }) => {
  return (
    <header>
      <h1 className="header_title">Fixed Term Deposits Dashboard</h1>
      <div className="header__wrap">
        <div className="addRow_btn">
          <button onClick={() => setIsAdding(true)}>Add Term</button>
        </div>
        <Link to="/dashboard/fixed-terms-table">
          <button>View Term requests</button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
