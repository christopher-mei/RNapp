import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const ApiTestPage = () => {
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [buttonVisible, setButtonVisible] = useState(true);

  const fetchMessage = () => {
    axios.get('https://accurate-rebirth-production.up.railway.app/')
      .then(response => {
        setMessage(response.data.message);
        setButtonVisible(false);
        setErrorMessage(''); // Clear any previous error message
      })
      .catch(error => {
        console.error('Error fetching message:', error);
        setErrorMessage('Failed to fetch message. Please try again.');
      });
  };

  return (
    <View style={styles.container}>
      {buttonVisible && <Button title="Fetch Message" onPress={fetchMessage} />}
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    margin: 20,
    padding: 10,
    backgroundColor: 'grey',
    color: 'white',
    borderRadius: 5,
  },
  error: {
    fontSize: 18,
    textAlign: 'center',
    margin: 20,
    padding: 10,
    backgroundColor: 'red',
    color: 'white',
    borderRadius: 5,
  },
});

export default ApiTestPage;