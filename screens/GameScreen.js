import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const GameScreen = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const animatedValue = new Animated.Value(1);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(time => time - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const moveCircle = () => {
    setPosition({
      x: Math.random() * 300,
      y: Math.random() * 500,
    });
  };

  const handleTap = () => {
    if (timeLeft > 0) {
      setScore(score + 1);
      moveCircle();
      Animated.sequence([
        Animated.timing(animatedValue, { toValue: 1.2, duration: 100, useNativeDriver: true }),
        Animated.timing(animatedValue, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Score: {score}</Text>
      <Text style={styles.timer}>Time Left: {timeLeft}s</Text>
      {timeLeft > 0 ? (
        <Animated.View
          style={[
            styles.circle,
            { top: position.y, left: position.x, transform: [{ scale: animatedValue }] },
          ]}>
          <TouchableOpacity onPress={handleTap} style={styles.touchArea} />
        </Animated.View>
      ) : (
        <Text style={styles.gameOver}>Game Over! Final Score: {score}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#282c34',
  },
  score: {
    fontSize: 24,
    color: 'white',
    marginBottom: 10,
  },
  timer: {
    fontSize: 20,
    color: 'white',
    marginBottom: 20,
  },
  circle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchArea: {
    width: '100%',
    height: '100%',
  },
  gameOver: {
    fontSize: 28,
    color: 'white',
    marginTop: 20,
  },
});

export default GameScreen;
