import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { addAnswer, getQuestions, checkTestSubmission, deleteOldAnswers } from '../../../database/database';

const StartExamScreen = ({ userId }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkIfSubmitted();
  }, []);

  const checkIfSubmitted = () => {
    checkTestSubmission(userId, (isSubmitted) => {
      if (isSubmitted) {
        setSubmitted(true);
      } else {
        fetchQuestions();
      }
      setLoading(false);
    }, (error) => {
      console.error('Error checking test submission:', error);
      setLoading(false);
    });
  };

  const fetchQuestions = () => {
    getQuestions(
      (questions) => setQuestions(questions),
      (error) => console.error('Error fetching questions:', error)
    );
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setAnswers({
      ...answers,
      [currentQuestionIndex]: option,
    });
  };

  const getOptionStyle = (option) => {
    if (selectedOption === option) {
      if (questions[currentQuestionIndex].correct_answer === option) {
        return styles.correctOption;
      } else{
        return styles.wrongOption;
      }
    }
    return styles.option;
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const submitTest = () => {
    // Submit answers to database
    questions.forEach((question, index) => {
      const selectedOption = answers[index];
      const isCorrect = selectedOption === question.correct_answer ? 1 : 0;
      addAnswer(
        userId,
        question.id,
        selectedOption !== undefined ? selectedOption : null,
        selectedOption !== undefined ? isCorrect : null,
        () => console.log('Answer added successfully'),
        (error) => console.error('Error adding answer:', error)
      );
    });

    setSubmitted(true);
  };

  const restartTest = () => {
    deleteOldAnswers(userId, () => {
      setAnswers({});
      setCurrentQuestionIndex(0);
      setSubmitted(false);
      setSelectedOption(null);
      fetchQuestions();
    }, (error) => console.error('Error deleting old answers:', error));
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (submitted) {
    return (
      <View style={styles.container}>
        <Text>You have already submitted the test.</Text>
        <TouchableOpacity onPress={restartTest} style={styles.navButton}>
          <Text style={styles.navButtonText}>Restart Test</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const userAnswer = answers[currentQuestionIndex];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.questionText}>{currentQuestion.question}</Text>
      {[1, 2, 3, 4].map((i) => (
        <TouchableOpacity
          key={i}
          style={getOptionStyle(i)}
          onPress={() => handleOptionSelect(i)}
          disabled={userAnswer !== undefined}
        >
          <Text style={styles.optionText}>{currentQuestion[`answer${i}`]}</Text>
        </TouchableOpacity>
      ))}
      {userAnswer !== undefined && (
        <Text style={styles.correctAnswer}>
          Correct Answer: {currentQuestion[`answer${currentQuestion.correct_answer}`]}
        </Text>
      )}
      <View style={styles.navigationButtons}>
        {currentQuestionIndex < questions.length - 1 ? (
          <TouchableOpacity onPress={nextQuestion} style={styles.navButton}>
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={submitTest} style={styles.navButton}>
            <Text style={styles.navButtonText}>Submit</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default StartExamScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  option: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    backgroundColor: '#ddd',
    alignItems: 'center',
  },
  correctOption: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  wrongOption: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    backgroundColor: '#f44336',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
  },
  correctAnswer: {
    fontSize: 18,
    color: '#4CAF50',
    marginTop: 20,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  navButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#1E90FF',
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});
