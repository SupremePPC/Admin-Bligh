import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebase';
import { createContext, useContext, useEffect, useState } from 'react';
import LoadingScreen from './components/LoadingScreen';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
}

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuthState, setLoadingAuthState] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuthState(false);
    });

    return () => unsubscribe();  
  }, []);
  
  if (loadingAuthState) {
    return <LoadingScreen />; 
  }

  const contextValue = {
    user,
    loadingAuthState
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };