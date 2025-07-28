import React, { useState, useEffect } from 'react';
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
  const [balance, setBalance] = useState(null);
  const [recipientUsername, setRecipientUsername] = useState('');
  const [userList, setUserList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [transferHistory, setTransferHistory] = useState([]);

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

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/balance', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBalance(data.balance);
        } else {
          setBalance(0);
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance(0);
      }
    };

    fetchBalance();
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/transfer/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setTransferHistory(data);
        }
      } catch (err) {
        console.error('Failed to load history', err);
      }
    };

    fetchHistory();
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
      const response = await fetch('http://localhost:5000/api/transfer', {
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
        setBalance(prev => prev - Number(amountToSend));
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
      <View style={styles.header}>
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
              <Text style={styles.username}>@{userName}</Text>
            )}
            <Image
              style={{ width: 20, height: 20, marginLeft: 5 }}
              source={require('./../assets/down.png')}
            />
          </TouchableOpacity>

          {isDropdownVisible && (
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={handleLogout}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Logout</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <Text style={{ color: 'white', marginTop: 20, marginBottom: 10 }}>Transfer History</Text>
      <View style={{ maxHeight: 200 }}>
        {transferHistory.length === 0 ? (
          <Text style={{ color: 'gray' }}>No transfers yet.</Text>
        ) : (
          [...transferHistory].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map((t, index) => (
            <View key={index} style={{ padding: 10, backgroundColor: '#222', marginBottom: 5, borderRadius: 5 }}>
              <Text style={{ color: 'white' }}>
                Sent <Text style={{ fontWeight: 'bold' }}>{t.amount}</Text> to <Text style={{ color: '#f98935' }}>@{t.recipient.username}</Text>
              </Text>
              <Text style={{ color: 'gray', fontSize: 12 }}>{new Date(t.timestamp).toLocaleString()}</Text>
            </View>
          ))
        )}
      </View>


      {/* Send Amount Section */}
      <View style={{ paddingHorizontal: 20, backgroundColor: '#363636' }}>
        <Text style={{ color: 'black', marginBottom: 5 }}>Send Amount</Text>

        <View style={styles.sectrw}>
          <Text style={{ color: 'white' }}>Money</Text>
          <Text style={styles.balanceText}>
            {balance === null ? '...' : balance}
          </Text>
        </View>

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
          style={styles.input}
          placeholder="Amount"
          placeholderTextColor="gray"
          keyboardType="numeric"
          value={amountToSend}
          onChangeText={setAmountToSend}
        />

        {recipientUsername ? (
          <Text style={styles.recipientText}>
            Sending to: <Text style={{ fontWeight: 'bold' }}>@{recipientUsername}</Text>
          </Text>
        ) : null}

        <TouchableOpacity
          style={styles.sendBtn}
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
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#363636',
    width: 'full',
    height: '15%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    color: '#f98935',
    fontWeight: 'bold',
    fontSize: 18,
    textTransform: 'uppercase',
  },
  logoutBtn: {
    backgroundColor: '#f98935',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
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
  sectrw: {
    backgroundColor: '#444',
    padding: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  balanceText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
  },
  input: {
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    color: 'white',
    padding: 10,
    marginBottom: 5,
  },
  recipientText: {
    color: 'white',
    marginBottom: 10,
  },
  sendBtn: {
    backgroundColor: '#f98935',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default Home;
