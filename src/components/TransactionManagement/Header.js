import React from 'react';

// import Logout from '../Logout';

const Header = ({ setIsAdding, setIsAuthenticated }) => {
  return (
    <header >
      <h1 className='header_title'>Transactions Dashboard</h1>
      <div className='addRow_btn'>
        <button onClick={() => setIsAdding(true)}>Add Employee</button>
        {/* <Logout setIsAuthenticated={setIsAuthenticated} /> */}
      </div>
    </header>
  );
};

export default Header;
