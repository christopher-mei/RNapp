import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const SignUpSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const SignUpScreen = () => {
  return (
    <Formik
      initialValues={{ username: '', email: '', password: '' }}
      validationSchema={SignUpSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const response = await axios.post('https://copperknot-5bc3aae4292c.herokuapp.com/users/', {
            email: values.email,
            password: values.password,
            username: values.username,
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Accept': '*/*',
            }
          });
          console.log("Response data", response.data);
          Alert.alert("Success", "User registered successfully");
        } catch (error) {
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
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, touched, errors }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Sign Up</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={handleChange('username')}
            onBlur={handleBlur('username')}
            value={values.username}
          />
          {touched.username && errors.username && <Text style={styles.error}>{errors.username}</Text>}
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
          <Button onPress={handleSubmit} title="Sign Up" />
        </View>
      )}
    </Formik>
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
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
});

export default SignUpScreen;