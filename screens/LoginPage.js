import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import ViewShot from 'react-native-view-shot';
import axios from 'axios';

const LoginPage = ({ route, navigation }) => {
  const viewShotRef = useRef();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);

  const API_URL = 'http://192.168.0.255:5000/api/auth'; // Replace with your actual IP


  const handleSubmit = async () => {
    const endpoint = isSignup ? '/signup' : '/login';
    const url = `${API_URL}${endpoint}`;
  
    try {
      const response = await axios.post(url, { username, password });
  
      if (isSignup) {
        Alert.alert('Success', 'User registered successfully');
        setIsSignup(false);
      } else {
        if (response.data.token) {
          Alert.alert('Success', 'Login successful');
          
          // Save token in AsyncStorage (for authentication)
          await AsyncStorage.setItem('token', response.data.token);
  
          navigation.navigate('InputScreen'); // Navigate after login
        } else {
          Alert.alert('Error', 'Invalid credentials');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', error.response?.data?.message || 'An error occurred');
    }
  };
  

  return (
    <View style={{ backgroundColor: '#363636', flex: 1 }}>
      <ViewShot
        ref={viewShotRef}
        options={{ format: 'jpg', quality: 0.9 }}
        style={styles.container}
      >
        <View style={[styles.rowContainer, { backgroundColor: '#363636', padding: 20 }]}>
          <Image
            style={styles.image}
            source={require('./../assets/agesta.png')}
          />
        </View>
        <View style={styles.login}>
          <Text style={styles.agestaText}>THANK YOU FOR CHOOSING <Text style={{ color: '#EF893D', fontWeight: 'bold' }}>US</Text></Text>
          <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
            <Image
              style={{ width: 60, height: 30, resizeMode: 'contain', backgroundColor: 'black' }}
              source={require('./../assets/canalplus.png')}
            />
            <Image
              style={{ width: 50, height: 40, resizeMode: 'contain', marginTop: -8 }}
              source={require('./../assets/dstv.webp')}
            />
            <Image
              style={{ width: 80, height: 29, resizeMode: 'contain', backgroundColor: 'white' }}
              source={require('./../assets/startimes.png')}
            />
            <Image
              style={{ width: 80, height: 29, backgroundColor: 'white' }}
              source={require('./../assets/1xbet.png')}
            />
          </View>
          <Text style={{ color: '#C4C4C4', fontSize: 13, marginVertical: 15, textAlign: 'center' }}>Your subscription ensures access to the best in entertainment,
            sports, movies, and more. We appreciate your support
            and are excited to bring you a world of content right
            at your fingertips. If you have any questions or need assistance,
            don’t hesitate to reach out!</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.imgIconsrc}>
            <Image
              style={styles.userimage}
              source={require('./../assets/user.png')}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="User's Name"
            placeholderTextColor="gray"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.imgIconsrc}>
            <Image
              style={styles.userimage}
              source={require('./../assets/padlock.png')}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="gray"
            value={password}
            onChangeText={setPassword}
          />
        </View>
        {/* <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{isSignup ? 'Sign Up' : 'Login'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
        <Text style={{ color: '#C4C4C4', textAlign: 'center', marginTop: 10 }}>
          {isSignup ? 'Already have an account? Login' : 'Don’t have an account? Sign Up'}
        </Text>
      </TouchableOpacity>

      </ViewShot>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 35,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    flex: 1,
  },
  image: {
    width: 240,
    height: 240,
    alignSelf: 'center',
    marginTop: 100,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  agestaText: {
    color: 'white',
    fontSize: 22,
    lineHeight: 35,
    fontWeight: "black",
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderColor: '#fff',
    borderWidth: 1,
    color: 'white',
    padding: 10,
    marginBottom: 5,
    width: '85%',
    marginTop: 4,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  submitButton: {
    backgroundColor: '#f98935',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  userimage: {
    width: 30,
    height: 30,
  },
  imgIconsrc: {
    backgroundColor: 'white',
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: "center",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
  },
});

export default LoginPage;
