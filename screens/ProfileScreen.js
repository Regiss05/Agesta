import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://192.168.0.255:5000/api/auth';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Unauthorized');
        navigation.navigate('LoginPage');
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        Alert.alert('Error', 'Session expired, please login again');
        await AsyncStorage.removeItem('token');
        navigation.navigate('LoginPage');
      }
    };

    fetchProfile();
  }, []);

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.title}>Welcome, {user.username}!</Text>
          <Button
            title="Logout"
            onPress={async () => {
              await AsyncStorage.removeItem('token');
              navigation.navigate('LoginPage');
            }}
          />
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
});

export default ProfileScreen;
