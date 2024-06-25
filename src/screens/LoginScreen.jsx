import React, { useState } from 'react';
import { View, Text, TextInput, Button, ToastAndroid } from 'react-native';
import { authenticateUser } from '../../database/database';
import commonStyles from '../styles/common';

const LoginScreen = ({ setIsAdmin, setLoggedInUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    authenticateUser(
      trimmedUsername,
      trimmedPassword,
      users => {
        if (users.length > 0) {
          const user = users[0];
          ToastAndroid.show(`Welcome ${user.username}`, ToastAndroid.SHORT);
          setLoggedInUser(user);
          setIsAdmin(user.role === 'admin');
        } else {
          alert('Invalid email or password');
        }
      },
      error => console.error('Error authenticating user: ', error),
    );
  };

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.header}>Sign In</Text>
      <Text>Username</Text>
      <TextInput
        style={commonStyles.input}
        value={username}
        onChangeText={setUsername}
        placeholder='Enter Username'
      />
      <Text>Password</Text>
      <TextInput
        style={commonStyles.input}
        value={password}
        onChangeText={setPassword}
        placeholder='Enter Password'
        secureTextEntry
      />
      <Button style={commonStyles.button} title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
