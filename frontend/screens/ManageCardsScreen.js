// screens/ManageCardsScreen.js
import React, { useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const ManageCardsScreen = ({ navigation }) => {
  const [cards, setCards] = useState([
    { id: '1', title: 'Card 1', description: 'Description for Card 1' },
    { id: '2', title: 'Card 2', description: 'Description for Card 2' },
  ]);

  const addCard = () => {
    const newCard = { id: (cards.length + 1).toString(), title: `Card ${cards.length + 1}`, description: `Description for Card ${cards.length + 1}` };
    setCards([...cards, newCard]);
  };

  const editCard = (id) => {
    navigation.navigate('EditCard', { id });
  };

  const viewCard = (id) => {
    navigation.navigate('ViewCard', { id });
  };

  return (
    <View style={styles.container}>
      <Button title="Add Card" onPress={addCard} />
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => viewCard(item.id)}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Button title="Edit" onPress={() => editCard(item.id)} />
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