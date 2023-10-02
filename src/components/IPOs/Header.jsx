import React from 'react';
import { Link } from 'react-router-dom'

const Header = ({setIsAdding}) => {
  return (
    <header >
      <h1 className='header_title'>Bonds Dashboard</h1>
      <div className="header__wrap">
        <div className="addRow_btn">
          <button onClick={() => setIsAdding(true)}>Add Bond</button>
        </div>
        <Link to="/dashboard/bond-requests">
        <button>
          View Bond requests
        </button>
        </Link>
        </div>
    </header>
  );
};

export default Header;
