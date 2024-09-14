import React from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

// Define validation schema using Yup
const SignInSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const SignInScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={SignInSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const response = await axios.post('https://copperknot-5bc3aae4292c.herokuapp.com/token', {
              email: values.email,
              password: values.password,
            }, {
              headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
              }
            });
            console.log("Response data", response.data);
            Alert.alert("Success", "User logged in successfully");
            // Save the token or navigate to another screen
          } catch (error) {
            if (error.response) {
              // Server responded with a status other than 200 range
              console.error("Error response", error.response.data);
              Alert.alert("Error", `Failed to log in: ${error.response.data.detail}`);
            } else if (error.request) {
              // Request was made but no response received
              console.error("Error request", error.request);
              Alert.alert("Error", "No response from server. Please try again later.");
            } else {
              // Something else happened
              console.error("Error message", error.message);
              Alert.alert("Error", `Failed to log in: ${error.message}`);
            }
          } finally {
            setSubmitting(false);
          }
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default SignInScreen;