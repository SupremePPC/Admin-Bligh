import React, { useState, useEffect } from 'react';

import Login from '../Login';
import Overview from '../Overview';
import BankingDetails from '../BankingDetails';
import TransactionDashboard from '../TransactionManagement';
import UserRequestDashboard from '../UserRequest';
import DocumentDashboard from '../DocumentManagement';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    setIsAuthenticated(JSON.parse(localStorage.getItem('is_authenticated')));
  }, []);

  return (
    <>
      {isAuthenticated ? (
        <>
        <Overview setIsAuthenticated={setIsAuthenticated} />
        <BankingDetails setIsAuthenticated={setIsAuthenticated} />
        <TransactionDashboard setIsAuthenticated={setIsAuthenticated} />
        <UserRequestDashboard setIsAuthenticated={setIsAuthenticated} />
        <DocumentDashboard setIsAuthenticated={setIsAuthenticated} />
        </>
      ) : (
        <Login setIsAuthenticated={setIsAuthenticated} />
      )}
    </>
  );
};

export default App;
