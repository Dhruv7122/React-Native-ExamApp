import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Image,
  Alert,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import React, { useState } from 'react';
import { insertUser } from '../../../database/database';

const CreateUserScreen = () => {
  const [username, setUsername] = useState('');
  const [phoneno, setPhoneno] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({});

  const pickImage = () => {
    launchImageLibrary({mediaType: 'photo', includeBase64: false}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setProfileImage(response.assets[0].uri);
      }
    });
  };

  const validate = () => {
    let valid = true;
    let errors = {};

    if (username.length < 3) {
      errors.username = 'Username must be at least 3 characters long';
      valid = false;
    }
    if (password.length < 4) {
      errors.password = 'Password must be at least 4 characters long';
      valid = false;
    }
    if (phoneno.length !== 10) {
      errors.phoneno = 'Phone number must be exactly 10 characters long';
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const addUser = () => {
    if (!validate()) {
      return;
    }
    // console.log(username , password, phoneno, profileImage);
    insertUser(
      username,
      phoneno,
      password,
      profileImage,
      () => {
        Alert.alert('Success', 'User added successfully');
        setUsername('');
        setPhoneno('');
        setPassword('');
        setProfileImage(null);
      },
      error => {
        Alert.alert('Error', 'Error adding user: ' + error.message);
      },
    );

  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Profile Image</Text>
      <Button title="Pick an image from gallery" onPress={pickImage} />
      {profileImage && (
        <Image source={{uri: profileImage}} style={styles.image} />
      )}

      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
      />
      {errors.username && <Text style={styles.error}>{errors.username}</Text>}

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={phoneno}
        onChangeText={setPhoneno}
        placeholder="Phone Number"
        keyboardType="phone-pad"
      />
      {errors.phoneno && <Text style={styles.error}>{errors.phoneno}</Text>}

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      {errors.password && <Text style={styles.error}>{errors.password}</Text>}

      <Button title="Create User" onPress={addUser} />
    </View>
  );
};

export default CreateUserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 8,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
});
