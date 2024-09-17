import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from 'react-query';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to fetch user data
const fetchUserData = async () => {
  const token = await AsyncStorage.getItem('authToken');
  console.log('Retrieved token:', token); // Debugging line
  if (!token) {
    throw new Error('No token found');
  }
  const response = await axios.get('https://clever-peace-production.up.railway.app/users/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};

const MainScreen = () => {
  const { data, error, isLoading } = useQuery('userData', fetchUserData);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {data.email}!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default MainScreen;