import React from 'react';

const Header = ({setIsAdding}) => {
  return (
    <header >
      <h1 className='header_title'>Bonds Dashboard</h1>
      <div className="header__wrap">
        <div className="addRow_btn">
          <button onClick={() => setIsAdding(true)}>Add Bond</button>
        </div>
        <button>
          View Bond requests
        </button>
        </div>
    </header>
  );
};

export default Header;
