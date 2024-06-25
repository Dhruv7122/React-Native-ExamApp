import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './src/screens/LoginScreen';
import AdminNavigation from './src/navigation/AdminNavigation';
import { createTables } from './database/database';
import NonAdminNavigation from './src/navigation/NonAdminNavigation';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  React.useEffect(() => {
    createTables();
  }, []);

  const logout = () => {
    setIsAdmin(false);
    setLoggedInUser(null);
  };

  if (!loggedInUser) {
    return <LoginScreen setIsAdmin={setIsAdmin} setLoggedInUser={setLoggedInUser} />;
  }

  return (
    <NavigationContainer>
      {isAdmin ? <AdminNavigation logout={logout} /> : <NonAdminNavigation logout={logout} user={loggedInUser}/>}
    </NavigationContainer>
  );
}
