import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useMutation, QueryClient, QueryClientProvider } from 'react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// Initialize QueryClient
const queryClient = new QueryClient();

// Define validation schema using Yup
const SignInSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

// Function to handle user sign-in
const signInUser = async (values) => {
  const response = await axios.post('https://clever-peace-production.up.railway.app/token', new URLSearchParams({
    username: values.email,
    password: values.password,
  }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  });
  return response.data;
};

const SignInScreen = () => {
  const navigation = useNavigation();
  const mutation = useMutation(signInUser, {
    onSuccess: async (data) => {
      // Store the token securely
      await AsyncStorage.setItem('authToken', data.access_token);
      // Navigate to the main screen
      navigation.navigate('MainScreen');
      // Show success message
      Alert.alert("Success", "Sign In Successful");
    },
    onError: (error) => {
      if (error.response) {
        // Server responded with a status other than 200 range
        console.error("Error response", error.response.data);
        Alert.alert("Error", `Failed to sign in: ${error.response.data.detail}`);
      } else if (error.request) {
        // Request was made but no response received
        console.error("Error request", error.request);
        Alert.alert("Error", "No response from server. Please try again later.");
      } else {
        // Something else happened
        console.error("Error message", error.message);
        Alert.alert("Error", `Failed to sign in: ${error.message}`);
      }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign In</Text>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={SignInSchema}
          onSubmit={(values, { setSubmitting }) => {
            mutation.mutate(values, {
              onSettled: () => {
                setSubmitting(false);
              }
            });
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View>
              <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              <TextInput
                style={styles.input}
                placeholder="Password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                secureTextEntry
              />
              {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              <Button title="Sign In" onPress={handleSubmit} />
            </View>
          )}
        </Formik>
      </View>
    </QueryClientProvider>
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
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
});

export default SignInScreen;