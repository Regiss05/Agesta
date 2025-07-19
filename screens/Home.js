import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const Home = ({ route, navigation }) => {
  const [userName, setUserName] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [amountToSend, setAmountToSend] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [amountSent, setAmountSent] = useState(0);

  const [recipientUsername, setRecipientUsername] = useState('');
  const [userList, setUserList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUserName(user.username || '');
        } else {
          setUserName('Guest');
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setUserName('Guest');
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/users/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserList(data);
        } else {
          setUserList([]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUserList([]);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchAllUsers();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    navigation.replace('LoginPage');
  };

  const handleSendAmount = async () => {
    if (!recipientUsername || !amountToSend) {
      Alert.alert('Error', 'Please select a recipient and enter an amount.');
      return;
    }

    if (isNaN(amountToSend) || Number(amountToSend) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    setIsSending(true);

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('http://192.168.0.102:5000/api/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recipientUsername,
          amount: Number(amountToSend),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Error', data.message || 'Failed to send amount.');
      } else {
        Alert.alert('Success', 'Amount sent successfully!');
        setRecipientUsername('');
        setAmountToSend('');
        setAmountSent(prev => prev + Number(amountToSend));
      }
    } catch (error) {
      console.error('Error sending amount:', error);
      Alert.alert('Error', 'Network error, please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {/* Header */}
      <View
        style={{
          backgroundColor: '#363636',
          width: 'full',
          height: '15%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={{ marginTop: 50 }}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => setDropdownVisible(!isDropdownVisible)}
          >
            {userName === null ? (
              <ActivityIndicator
                size="small"
                color={Platform.OS === 'ios' ? 'gray' : '#f98935'}
              />
            ) : (
              <Text
                style={{
                  color: '#f98935',
                  fontWeight: 'bold',
                  fontSize: 18,
                  textTransform: 'uppercase',
                }}
              >
                @{userName}
              </Text>
            )}
            <Image
              style={{ width: 20, height: 20, marginLeft: 5 }}
              source={require('./../assets/down.png')}
            />
          </TouchableOpacity>

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

      {/* Send Amount */}
      <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
        <Text style={{ color: 'white', marginBottom: 5 }}>Send Amount</Text>

        <View style={{ marginBottom: 10, backgroundColor: '#222', borderRadius: 5 }}>
          {loadingUsers ? (
            <ActivityIndicator
              size="small"
              color={Platform.OS === 'ios' ? 'gray' : '#f98935'}
              style={{ padding: 10 }}
            />
          ) : (
            <Picker
              selectedValue={recipientUsername}
              onValueChange={(itemValue) => setRecipientUsername(itemValue)}
              style={{ color: 'white' }}
              dropdownIconColor="#f98935"
            >
              <Picker.Item label="Select user" value="" />
              {userList.map((user, index) => (
                <Picker.Item key={index} label={user} value={user} />
              ))}
            </Picker>
          )}
        </View>

        <TextInput
          style={{
            borderColor: '#fff',
            borderWidth: 1,
            borderRadius: 5,
            color: 'white',
            padding: 10,
            marginBottom: 10,
          }}
          placeholder="Amount"
          placeholderTextColor="gray"
          keyboardType="numeric"
          value={amountToSend}
          onChangeText={setAmountToSend}
        />

        <TouchableOpacity
          style={{
            backgroundColor: '#f98935',
            padding: 15,
            borderRadius: 5,
            alignItems: 'center',
          }}
          onPress={handleSendAmount}
          disabled={isSending}
        >
          {isSending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Send</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Dashboard */}
      <View style={{ backgroundColor: '#363636', flex: 1, padding: 20 }}>
        <Text style={{ color: 'white', marginBottom: 10 }}>Dashboard</Text>
        <View style={styles.sectrw}>
          <Text style={{ textAlign: 'center', color: 'white' }}>Money</Text>
          <Text
            style={{
              textAlign: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: 50,
            }}
          >
            {amountSent}
          </Text>
        </View>
        <View>
          <Text style={{ color: 'white', marginBottom: 10 }}>Services</Text>
          <View style={styles.mensect}>
            <TouchableOpacity
              style={styles.logoButton}
              onPress={() => navigation.navigate('InputScreen')}
            >
              <Image
                style={styles.canal}
                source={require('./../assets/canalplus.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.logoButton}
              onPress={() => navigation.navigate('GameScreen')}
            >
              <Image
                style={styles.startime}
                source={require('./../assets/startimes.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.mensect}>
            <TouchableOpacity
              style={styles.logoButton}
              onPress={() => navigation.navigate('GameScreen')}
            >
              <Image
                style={styles.dstv}
                source={require('./../assets/dstv.webp')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.logoButton}
              onPress={() => navigation.navigate('GameScreen')}
            >
              <Image
                style={styles.bet}
                source={require('./../assets/1xbet.png')}
              />
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
