import React from 'react';

const Header = ({handleDeleteAll}) => {
  return (
    <header >
      <h1 className='header_title'>Notifications</h1>
      <div className="header__wrap">
        <div className="addRow_btn">
        <button onClick={handleDeleteAll}>Delete All</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
