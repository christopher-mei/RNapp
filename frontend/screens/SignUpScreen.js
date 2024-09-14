import React from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const SignUpSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const SignUpScreen = () => {
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={SignUpSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const response = await axios.post('https://copperknot-5bc3aae4292c.herokuapp.com/users/', {
            email: values.email,
            password: values.password,
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
          <Button onPress={handleSubmit} title="Register" />
        </View>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default SignUpScreen;