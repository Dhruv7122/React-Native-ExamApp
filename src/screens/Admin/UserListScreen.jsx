import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {fetchUsers, deleteUser} from '../../../database/database';
import { useFocusEffect } from '@react-navigation/native';

const UserListScreen = ({navigation}) => {
  const [users, setUsers] = useState([]);
  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [loadUsers])
  );

  const loadUsers = useCallback(() => {
    fetchUsers(
      users => setUsers(users),
      error => console.error('Error fetching users: ', error),
    );
  }, []);

  const handleDelete = id => {
    deleteUser(
      id,
      () => {
        alert('User deleted successfully');
        loadUsers();
      },
      error => console.error('Error deleting user: ', error),
    );
  };

  const renderUser = ({item}) => (
    <View style={styles.userContainer}>
      <Text>{item.username}</Text>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('EditUser', {user: item})
        }>
        <Text style={styles.editText}>Edit</Text>
      </TouchableOpacity>
      <Button title="Delete" onPress={() => handleDelete(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

export default UserListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  editText: {
    color: 'blue',
    marginRight: 8,
  },
});
