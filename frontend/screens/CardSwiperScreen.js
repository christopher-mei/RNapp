import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import CardStack, { Card } from 'react-native-card-stack-swiper';

const CardSwiperScreen = () => {
  const swiperRef = useRef(null);
  const cards = [
    { id: 1, text: 'Card 1', image: 'https://via.placeholder.com/300' },
    { id: 2, text: 'Card 2', image: 'https://via.placeholder.com/300' },
    { id: 3, text: 'Card 3', image: 'https://via.placeholder.com/300' },
  ];

  return (
    <View style={styles.container}>
      <CardStack
        style={styles.cardStack}
        cardContainerStyle={styles.cardContainer}
        ref={swiperRef}
        renderNoMoreCards={() => <Text style={styles.noMoreCardsText}>No more cards</Text>}
      >
        {cards.map(card => (
          <Card key={card.id} style={styles.card}>
            <Image source={{ uri: card.image }} style={styles.image} />
            <Text style={styles.label}>{card.text}</Text>
          </Card>
        ))}
      </CardStack>
      <View style={styles.buttonsWrapper}>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={() => { swiperRef.current.swipeLeft() }}>
            <Text style={styles.buttonText}>← swipe left</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => { swiperRef.current.swipeRight() }}>
            <Text style={styles.buttonText}>swipe right →</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.resetButton} onPress={() => { swiperRef.current.goBackFromTop() }}>
          <Text style={styles.resetButtonText}>undo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardStack: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    margin: 0,
  },
  cardContainer: {
    width: '95%',
    height: '85%',
  },
  card: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 20,
  },
  image: {
    width: '100%',
    height: '80%',
    borderRadius: 10,
  },
  label: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  noMoreCardsText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },
  buttonsWrapper: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    width: 150,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#FF6347',
    width: 150,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default CardSwiperScreen;