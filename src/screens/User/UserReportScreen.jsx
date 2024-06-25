import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import db from '../../../database/database';
import { useFocusEffect } from '@react-navigation/native';

const ReportScreen = ({ userId }) => {

  const [reportData, setReportData] = useState([]);
useFocusEffect(
  useCallback(() => {
    fetchReportData(userId);
  }, [userId])
);

  const fetchReportData = useCallback((userId) => {
    // Example query to fetch user's answers along with question details
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT questions.id AS question_id, questions.question, questions.correct_answer, answers.selected_option
         FROM answers
         INNER JOIN questions ON answers.question_id = questions.id
         WHERE answers.user_id = ?`,
        [userId],
        (_, { rows }) => {
          const data = rows.raw(); // Convert SQLite rows to plain JavaScript array
          setReportData(data);
        },
        (_, error) => {
          console.error('Error fetching report data:', error);
        }
      );
    });
  });

  if (reportData.length == 0) {
    return (
      <View style={styles.nodataContainer}>
        <Text style={styles.noReportText}>Opps! No report data available.</Text>
      </View>
    )    
  }

  const renderItem = ({ item }) => {
    const { question_id, question, correct_answer, selected_option } = item;
    let backgroundColor = 'lightgrey';

    if (selected_option === correct_answer) {
      backgroundColor = 'lightgreen';
    } else if (selected_option !== null && selected_option !== correct_answer) {
      backgroundColor = 'lightcoral';
    }

    return (
      <View style={[styles.questionContainer, { backgroundColor }]}>
        <Text style={styles.questionText}>{question}</Text>
        <Text style={styles.answerText}>
          {selected_option === correct_answer
            ? `Your answer: Option ${selected_option} (Correct)`
            : selected_option !== null
            ? `Your answer: Option ${selected_option} (Incorrect)`
            : 'Not Attempted'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Test Report</Text>
      <FlatList
        data={reportData}
        renderItem={renderItem}
        keyExtractor={(item) => item.question_id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default ReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  listContainer: {
    flexGrow: 1,
  },
  questionContainer: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 5,
  },
  answerText: {
    fontSize: 14,
    color: 'black',
  },
  nodataContainer:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  noReportText:{
    fontSize:16,
    fontWeight:"bold",
  }
});
