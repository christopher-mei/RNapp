import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useMutation, QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

const SignUpSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const signUpUser = async (values) => {
  const response = await axios.post('https://clever-peace-production.up.railway.app/users/', {
    email: values.email,
    password: values.password,
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*',
    }
  });
  return response.data;
};

const SignUpScreen = () => {
  const mutation = useMutation(signUpUser, {
    onSuccess: (data) => {
      Alert.alert("Success", "User registered successfully");
    },
    onError: (error) => {
      if (error.response) {
        // Server responded with a status other than 200 range
        console.error("Error response", error.response.data);
        Alert.alert("Error", `Failed to register user: ${error.response.data.message}`);
      } else if (error.request) {
        // Request was made but no response received
        console.error("Error request", error.request);
        Alert.alert("Error", "No response from server. Please try again later.");
      } else {
        // Something else happened
        console.error("Error message", error.message);
        Alert.alert("Error", `Failed to register user: ${error.message}`);
      }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={SignUpSchema}
        onSubmit={(values, { setSubmitting }) => {
          mutation.mutate(values, {
            onSettled: () => {
              setSubmitting(false);
            }
          });
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
          <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
            <Button onPress={handleSubmit} title="Sign Up" disabled={mutation.isLoading} />
          </View>
        )}
      </Formik>
    </QueryClientProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
});

export default SignUpScreen;