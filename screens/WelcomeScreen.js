// screens/WelcomeScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Copper Knot</Text>
      <View style={styles.buttonContainer}>
        <Button title="Sign In" onPress={() => navigation.navigate('SignIn')} />
        <Button title="Sign Up" onPress={() => navigation.navigate('SignUp')} />
      </View>
      <View style={styles.apiTestButtonContainer}>
        <Button title="API Connection Test" onPress={() => navigation.navigate('ApiTestPage')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '40%', // Adjust the width as needed
    marginBottom: 80, // Add some space between the rows
  },
  apiTestButtonContainer: {
    width: '30%', // Adjust the width as needed
  },
});

export default WelcomeScreen;