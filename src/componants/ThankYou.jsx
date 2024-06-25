import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

const ThankYouScreen = ({ navigation }) => {
  const handlePress = () => {
    navigation.navigate('Report'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.thankYouText}>Thank You for Submitting the Test!</Text>
      <Button title="Go to Home" onPress={handlePress} />
    </View>
  );
};

export default ThankYouScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  thankYouText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
});
