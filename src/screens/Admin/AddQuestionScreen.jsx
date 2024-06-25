import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { addQuestion } from '../../../database/database'; // Adjust the import path as necessary
import { Picker } from '@react-native-picker/picker';

const AddQuestionScreen = ({ navigation, route }) => {
  const [question, setQuestion] = useState('');
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [answer3, setAnswer3] = useState('');
  const [answer4, setAnswer4] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');

  const { onAddQuestion } = route.params;

  const handleAddQuestion = () => {
    if (!question || !answer1 || !answer2 || !answer3 || !answer4 || !correctAnswer) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }

    addQuestion(
      question,
      answer1,
      answer2,
      answer3,
      answer4,
      correctAnswer,
      () => {
        Alert.alert('Success', 'Question added successfully');
        onAddQuestion();
        navigation.goBack();
        // Reset form
        // setQuestion('');
        // setAnswer1('');
        // setAnswer2('');
        // setAnswer3('');
        // setAnswer4('');
        // setCorrectAnswer('');
      },
      (error) => {
        Alert.alert('Error', 'Failed to add question: ' + error.message);
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text>Question</Text>
      <TextInput
        style={styles.input}
        value={question}
        onChangeText={setQuestion}
      />
      <Text>Answer 1</Text>
      <TextInput
        style={styles.input}
        value={answer1}
        onChangeText={setAnswer1}
      />
      <Text>Answer 2</Text>
      <TextInput
        style={styles.input}
        value={answer2}
        onChangeText={setAnswer2}
      />
      <Text>Answer 3</Text>
      <TextInput
        style={styles.input}
        value={answer3}
        onChangeText={setAnswer3}
      />
      <Text>Answer 4</Text>
      <TextInput
        style={styles.input}
        value={answer4}
        onChangeText={setAnswer4}
      />
      <Text>Correct Answer</Text>
      <Picker
        selectedValue={correctAnswer}
        style={styles.input}
        onValueChange={(itemValue, itemIndex) => setCorrectAnswer(itemValue)}
      >
        <Picker.Item label="Select Correct Answer" value="" />
        <Picker.Item label="Answer 1" value="1" />
        <Picker.Item label="Answer 2" value="2" />
        <Picker.Item label="Answer 3" value="3" />
        <Picker.Item label="Answer 4" value="4" />
      </Picker>
      <Button title="Add Question" onPress={handleAddQuestion} />
    </View>
  );
};

export default AddQuestionScreen;

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
    padding: 8,
  },
});

