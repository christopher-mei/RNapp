import React from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Formik } from 'formik';
import * as Yup from 'yup';
import api from '../api';

const EditCardScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const queryClient = useQueryClient();

  // Fetch card details if editing an existing card
  const { data: card, isLoading } = useQuery(['card', id], async () => {
    if (id !== null) {
      const response = await api.get(`/cards/${id}`);
      return response.data;
    }
    return { title: '', image: '' }; // Default values for a new card
  }, {
    enabled: id !== null, // Only fetch if id is not null
  });

  // Add or edit card mutation
  const saveCardMutation = useMutation(
    async (cardData) => {
      if (id === null) {
        const response = await api.post('/cards/', cardData);
        return response.data;
      } else {
        const response = await api.put(`/cards/${id}`, cardData);
        return response.data;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('cards');
        navigation.goBack();
      },
    }
  );

  const cardSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    image: Yup.string().required('Image is required'),
  });

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{id === null ? 'Add Card' : `Edit Card ${id}`}</Text>
      <Formik
        initialValues={{ title: card?.title || '', image: card?.image || '' }}
        validationSchema={cardSchema}
        onSubmit={(values) => saveCardMutation.mutate(values)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Title"
              onChangeText={handleChange('title')}
              onBlur={handleBlur('title')}
              value={values.title}
            />
            {touched.title && errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
            <TextInput
              style={styles.input}
              placeholder="Image"
              onChangeText={handleChange('image')}
              onBlur={handleBlur('image')}
              value={values.image}
            />
            {touched.image && errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
            <Button title="Save" onPress={handleSubmit} />
          </View>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default EditCardScreen;