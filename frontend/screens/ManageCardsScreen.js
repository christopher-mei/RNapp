// screens/ManageCardsScreen.js
import React from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../api';

const ManageCardsScreen = ({ navigation }) => {
  const queryClient = useQueryClient();

  // Fetch cards
  const { data: cards, isLoading } = useQuery('cards', async () => {
    const response = await api.get('/cards/');
    return response.data;
  });

  // Delete card mutation
  const deleteCardMutation = useMutation(
    async (id) => {
      await api.delete(`/cards/${id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('cards');
      },
    }
  );

  const addCard = () => {
    navigation.navigate('EditCard', { id: null }); // Navigate to EditCard with no id to indicate a new card
  };

  const editCard = (id) => {
    navigation.navigate('EditCard', { id });
  };

  const viewCard = (id) => {
    navigation.navigate('ViewCard', { id });
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Button title="Add Card" onPress={addCard} />
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => viewCard(item.id)}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Button title="Edit" onPress={() => editCard(item.id)} />
            <Button title="Delete" onPress={() => deleteCardMutation.mutate(item.id)} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default ManageCardsScreen;