import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({ route, navigation }) => {
  const [userName, setUserName] = useState(null); // Null means loading
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUserName(user.username || '');
        } else {
          setUserName('Guest'); // Default if no user found
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setUserName('Guest');
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    navigation.replace('LoginPage'); // Navigate back to login screen
  };

  const canalplusSend = async () => {
    navigation.navigate('InputScreen'); // Navigate back to login screen
  };

  return (
    <>
      <View style={{ backgroundColor: '#363636', width: 'full', height: '15%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        {/* <View style={{ backgroundColor: '#eb8e49', width: 'full', height: '20%' }}> */}
        <View style={{ marginTop: 50 }}>
          {/* Dropdown Button */}
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => setDropdownVisible(!isDropdownVisible)}
          >
            {userName === null ? (
              <ActivityIndicator size="small" color={Platform.OS === 'ios' ? 'gray' : '#f98935'} />
            ) : (
              <Text style={{ color: '#f98935', fontWeight: 'bold', fontSize: 18, textTransform: 'uppercase' }}>@{userName}</Text>
            )}
            <Image style={{ width: 20, height: 20, marginLeft: 5 }} source={require('./../assets/down.png')} />
          </TouchableOpacity>

          {/* Dropdown Menu */}
          {isDropdownVisible && (
            <TouchableOpacity
              style={{
                backgroundColor: '#f98935',
                padding: 10,
                borderRadius: 5,
                marginTop: 5,
              }}
              onPress={handleLogout}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Logout</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={{ backgroundColor: '#363636', flex: 1, padding: 20 }}>
        <Text style={{ color: 'white', marginBottom: 10 }}>Dashboard</Text>
        <View style={styles.sectrw}>
          <Text style={{ textAlign: 'center', color: 'white' }}>Money</Text>
          <Text style={{ textAlign: 'center', color: 'white', fontWeight: 'bold', fontSize: 50 }}>540</Text>
        </View>
        <View>
          <Text style={{ color: 'white', marginBottom: 10 }}>Services</Text>
          <View style={styles.mensect}>
            <TouchableOpacity style={styles.logoButton} onPress={() => navigation.navigate('InputScreen')}>
              <Image style={styles.canal} source={require('./../assets/canalplus.png')} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoButton} onPress={() => navigation.navigate('GameScreen')}>
              <Image style={styles.startime} source={require('./../assets/startimes.png')} />
            </TouchableOpacity>
          </View>

          <View style={styles.mensect}>
            <TouchableOpacity style={styles.logoButton} onPress={() => navigation.navigate('GameScreen')}>
              <Image style={styles.dstv} source={require('./../assets/dstv.webp')} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoButton} onPress={() => navigation.navigate('GameScreen')}>
              <Image style={styles.bet} source={require('./../assets/1xbet.png')} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  sectrw: {
    width: 'full',
    backgroundColor: '#eb8e49',
    padding: 30,
    marginBottom: 5,
  },
  mensect: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  canal: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    backgroundColor: 'black',
  },
  startime: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    backgroundColor: 'white',
  },
  dstv: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    backgroundColor: '#0095da',
  },
  bet: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    backgroundColor: '#195685',
  },
  logoButton: {
    width: '50%',
  },
});

export default Home;
