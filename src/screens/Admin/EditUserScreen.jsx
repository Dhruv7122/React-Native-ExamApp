import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet,Image } from 'react-native';
import { updateUser, fetchUsers } from '../../../database/database';
import {launchImageLibrary} from 'react-native-image-picker';


const EditUserScreen = ({ route, navigation }) => {
  const { user } = route.params;
  const [username, setUsername] = useState(user.username);
  const [phoneno, setPhoneno] = useState(user.phoneno);
  const [password, setPassword] = useState(user.password);
  const [profileImage, setProfileImage] = useState(user.profileimage);
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

  const handleSave = () => {
    if (!validate()) {
        return;
    }

    updateUser(user.id, username, phoneno, password, profileImage,
      () => {
        alert('User updated successfully');
        navigation.goBack();
      },
      error => console.error('Error updating user: ', error),
    );
  };

  return (
    <View style={styles.container}>
    <Text style={styles.label}>Profile Image</Text>
      <Button title="Pick an image from gallery" onPress={pickImage} />
      {profileImage && (
        <Image source={{uri: profileImage}} style={styles.image} />
      )}

      <Text>Username</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      {errors.username && <Text style={styles.error}>{errors.username}</Text>}

      <Text>Phone Number</Text>
      <TextInput
        style={styles.input}
        value={phoneno}
        onChangeText={setPhoneno}
      />
      {errors.phoneno && <Text style={styles.error}>{errors.phoneno}</Text>}

      <Text>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errors.password && <Text style={styles.error}>{errors.password}</Text>}

      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

export default EditUserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
});
