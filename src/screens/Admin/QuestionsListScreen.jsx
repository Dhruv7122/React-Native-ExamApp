import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { getQuestions, deleteQuestion } from '../../../database/database'; // Adjust the import path as necessary

const QuestionsListScreen = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const fetchQuestions = useCallback(() => {
    getQuestions(
      (questions) => setQuestions(questions),
      (error) => {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch questions: ' + error.message);
        }
    );
  }, []);

//   const fetchQuestions = () => {
//     getQuestions(
//       (questions) => {
//         setQuestions(questions);
//       },
//       (error) => {
//         Alert.alert('Error', 'Failed to fetch questions: ' + error.message);
//       }
//     );
//   };

  const handleDeleteQuestion = (id) => {
    deleteQuestion(
      id,
      () => {
        Alert.alert('Success', 'Question deleted successfully');
        fetchQuestions(); // Refresh the list
      },
      (error) => {
        Alert.alert('Error', 'Failed to delete question: ' + error.message);
      }
    );
  };

  const renderQuestion = ({ item }) => (
    <View style={styles.questionContainer}>
      <Text style={styles.questionText}>{item.question}</Text>
      <Text style={styles.questionText}>Ans = Option {item.correct_answer}</Text>

      <TouchableOpacity onPress={() => handleDeleteQuestion(item.id)}>
        <Text style={styles.deleteButton}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={questions}
        renderItem={renderQuestion}
        keyExtractor={(item) => item.id.toString()}
      />
      <Button title="Add Question" onPress={() => navigation.navigate('AddQuestions', { onAddQuestion: fetchQuestions })} />
    </View>
  );
};

export default QuestionsListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  questionContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  questionText: {
    fontSize: 16,
    marginBottom: 8,
  },
  editButton: {
    color: 'blue',
    marginRight: 16,
  },
  deleteButton: {
    color: 'red',
  },
});
