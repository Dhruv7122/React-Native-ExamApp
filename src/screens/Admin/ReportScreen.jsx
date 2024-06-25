import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { getUsersWithSubmissions, getUserReport } from '../../../database/database';

const ReportScreen = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [report, setReport] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    getUsersWithSubmissions(
      (users) => setUsers(users),
      (error) => console.error('Error fetching users with submissions:', error)
    );
  };

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
    fetchUserReport(userId);
  };

  const fetchUserReport = (userId) => {
    getUserReport(
      userId,
      (report) => setReport(report),
      (error) => console.error('Error fetching user report:', error)
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {selectedUser === null ? (
        <>
          <Text style={styles.title}>Users who submitted the test</Text>
          {users.map((user) => { 
            console.log(user.profileimage)
            return(
            
            <TouchableOpacity key={user.id} onPress={() => handleUserSelect(user.id)} style={styles.userButton}>
              <Image source={{ uri: user.profileimage }} style={styles.profileImage} />
              <Text style={styles.userButtonText}>{user.username}</Text>
            </TouchableOpacity>
          )})}
        </>
      ) : (
        <>
          <TouchableOpacity onPress={() => setSelectedUser(null)} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back to Users</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Report for User ID: {selectedUser}</Text>
          {report.map((item, index) => (
            <View key={index} style={styles.reportItem}>
              <Text style={styles.questionText}>{item.question}</Text>
              <Text>Selected Option: {item.selected_option}</Text>
              <Text>Correct Answer: {item.correct_answer}</Text>
              <Text>Result: {item.selected_option === item.correct_answer ? 'Correct' : 'Wrong'}</Text>
            </View>
          ))}
        </>
      )}
    </ScrollView>
  );
};

export default ReportScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userButton: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    backgroundColor: '#1E90FF',
    alignItems: 'center',
  },
  userButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  backButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#1E90FF',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  reportItem: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    backgroundColor: '#ddd',
    alignItems: 'flex-start',
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  }
});
