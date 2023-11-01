import React from 'react';

const Header = ({handleDeleteAll, notifications}) => {
  return (
    <header >
      <h1 className='header_title'>Notifications</h1>
      {
        notifications.length > 0 && (
      <div className="header__wrap">
        <div className="addRow_btn">
        <button onClick={handleDeleteAll}>Delete All</button>
        </div>
      </div>
      )}
    </header>
  );
};

export default Header;
