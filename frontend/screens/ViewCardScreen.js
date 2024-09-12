// screens/ViewCardScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ViewCardScreen = ({ route }) => {
  const { id } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>View Card {id}</Text>
      {/* Display card details (you can fetch the card details from the state or backend) */}
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
});

export default ViewCardScreen;