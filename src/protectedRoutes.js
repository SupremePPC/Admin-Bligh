import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authState';
// import LoadingScreen from './components/LoadingScreen';

function ProtectedRoute({children}) {
  const { user, loadingAuthState } = useAuth();
  
  // if (loadingAuthState) {
  //   return <LoadingScreen/>;  // or some other loading indication
  // }

  if (!user) {
    return <Navigate to="/" />;
  }
  
  return children;
}

export default ProtectedRoute;