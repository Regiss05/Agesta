import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Checkbox from 'expo-checkbox';

const InputScreen = ({ navigation }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [packageName, setPackageName] = useState('');
  const [duration, setDuration] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [transactionTime, setTransactionTime] = useState('');
  const [prefix, setPrefix] = useState('CGA'); // State for dropdown selection
  const [isChecked, setChecked] = useState(false);

  const getCurrentDate = () => new Date().toISOString().split('T')[0];
  const getCurrentTime = () => new Date().toLocaleTimeString();

  useEffect(() => {
    setTransactionDate(getCurrentDate());
    setTransactionTime(getCurrentTime());

    // Update time every 30 seconds
    const timeInterval = setInterval(() => {
      setTransactionTime(getCurrentTime());
    }, 30000); // 30000 ms = 30 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(timeInterval);
  }, []);

  const handleSubmit = () => {
    navigation.navigate('ResultScreen', {
      cardNumber,
      packageName,
      duration,
      prefix,
      transactionDate,
      transactionTime,
      isChecked,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={{ color: '#f98935', fontWeight: 'bold', position: 'absolute', top: 50, left: '50%', transform: [{ translateX: -50 }] }}>REGISS MUKUBIZA</Text>
      <Image
        style={styles.logo}
        source={require('./../assets/agesta.png')}
      />
      <Text style={styles.title}>AFRICAN GENIUS STAFF / AGESTA</Text>
      <Text style={styles.subtitle}>CANAL + PAYMENT</Text>

      {/* Card Number Input with Dropdown */}
      <View style={styles.row}>
        <Picker
          selectedValue={prefix}
          style={styles.picker}
          onValueChange={(itemValue) => setPrefix(itemValue)}
        >
          <Picker.Item label="CGA" value="CGA" />
          <Picker.Item label="PWY" value="PWY" />
          <Picker.Item label="PFL" value="PFL" />
        </Picker>
        <TextInput
          style={{
            borderColor: '#fff',
            borderWidth: 1,
            borderRadius: 5,
            color: 'white',
            padding: 10,
            width: '65%',
          }}
          placeholder="Card Number"
          placeholderTextColor="gray"
          keyboardType="numeric"
          value={cardNumber}
          onChangeText={setCardNumber}
        />
      </View>

      {/* Package Name Picker */}
      <Picker
        selectedValue={packageName}
        style={styles.input}
        onValueChange={(itemValue) => setPackageName(itemValue)}
      >
        <Picker.Item label="Select a package" value="" />
        <Picker.Item label="ACCESS" value="ACCESS" />
        <Picker.Item label="EVASION" value="EVASION" />
        <Picker.Item label="ACCESS+" value="ACCESS+" />
        <Picker.Item label="EVASION+" value="EVASION+" />
        <Picker.Item label="TOUT CANAL+" value="TOUT CANAL+" />
        <Picker.Item label="ENGLISH PLUS" value="ENGLISH PLUS" />
        <Picker.Item label="ACCESS -> EVASION" value="ACCESS -> EVASION" />
        <Picker.Item label="ACCESS -> ACCESS+" value="ACCESS -> ACCESS+" />
        <Picker.Item label="ACCESS -> EVASION+" value="ACCESS -> EVASION+" />
        <Picker.Item label="ACCESS -> TOUT CANAL+" value="ACCESS -> TOUT CANAL+" />
        <Picker.Item label="EVASION -> ACCESS+" value="EVASION -> ACCESS+" />
        <Picker.Item label="EVASION -> EVASION+" value="EVASION -> EVASION+" />
        <Picker.Item label="EVASION -> TOUT CANAL+" value="EVASION -> TOUT CANAL+" />
        <Picker.Item label="ACCESS+ -> EVASION+" value="ACCESS+ -> EVASION+" />
        <Picker.Item label="ACCESS+ -> TOUT CANAL+" value="ACCESS+ -> TOUT CANAL+" />
        <Picker.Item label="EVASION+ -> TOUT CANAL+" value="EVASION+ -> TOUT CANAL+" />
      </Picker>

      <View style={styles.container12}>
        <View style={styles.section}>
          <Checkbox
            style={styles.checkbox}
            value={isChecked}
            onValueChange={setChecked}
            color={isChecked ? '#f98935' : undefined}
          />
          <Text style={styles.paragraph}>{isChecked ? 'ADDED' : 'ADD ENGLISH PLUS'}</Text>
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Duration/Month"
        placeholderTextColor="gray"
        keyboardType="numeric"
        value={duration}
        onChangeText={setDuration}
      />

      <TextInput
        style={styles.input}
        placeholder="Date of Transaction (YYYY-MM-DD)"
        value={transactionDate}
        onChangeText={setTransactionDate}
      />

      <TextInput
        style={styles.input}
        placeholder="Time of Transaction (HH:MM:SS)"
        value={transactionTime}
        onChangeText={setTransactionTime}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#363636',
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 20,
    resizeMode: 'contain',
  },
  title: {
    alignSelf: 'center',
    marginBottom: 5,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    alignSelf: 'center',
    marginBottom: 15,
    color: 'white',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  picker: {
    flex: 1,
    borderColor: '#fff',
    borderWidth: 1,
    marginRight: 3,
    color: 'white',
  },
  input: {
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    color: 'white',
    padding: 10,
    marginBottom: 5,
  },
  submitButton: {
    backgroundColor: '#f98935',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },

  container12: {
    marginVertical: 10,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paragraph: {
    fontSize: 15,
    color: 'white',
  },
  checkbox: {
    margin: 8,
  },

});

export default InputScreen;
