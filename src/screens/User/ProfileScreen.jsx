import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import { getUserProfile } from '../../../database/database'; // Adjust the import path as necessary
// import { AuthContext } from '../../context/AuthContext'; // Assuming you have an AuthContext to get the logged-in user's ID

const ProfileScreen = ({user}) => {
  // const { userId } = useContext(AuthContext);
  const [profile, setProfile] = useState(user);
  const [error, setError] = useState('');

  // useEffect(() => {
  //   if (userId) {
  //     getUserProfile(
  //       userId,
  //       (user) => setProfile(user),
  //       (err) => setError(err)
  //     );
  //   }
  // }, [userId]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: profile.profileimage === null ? "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Image.png" : profile.profileimage}} style={styles.profileImage} />
      <Text style={styles.username}>{profile.username}</Text>
      <Text style={styles.phoneno}>{profile.phoneno}</Text>
      <Text style={styles.role}>{profile.role}</Text>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  phoneno: {
    fontSize: 18,
    color: '#888',
    marginBottom: 10,
  },
  role: {
    fontSize: 18,
    color: '#888',
    marginBottom: 20,
  },
  error: {
    fontSize: 18,
    color: 'red',
  },
});
