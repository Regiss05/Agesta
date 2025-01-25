import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import ViewShot from 'react-native-view-shot';

const LoginPage = ({ route, navigation }) => {
  const viewShotRef = useRef();

  const handleSubmit = () => {
    navigation.navigate('InputScreen');
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
          <Text style={{ color: '#C4C4C4', fontSize: 13, marginVertical: 25 }}>Your subscription ensures access to the best in entertainment,
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
          // value={duration}
          // onChangeText={setDuration}
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
          // value={duration}
          // onChangeText={setDuration}
          />
        </View>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Login</Text>
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
    marginBottom: 50,
  },
  agestaText: {
    color: 'white',
    fontSize: 22,
    lineHeight: 35,
    fontWeight: "black",
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
});

export default LoginPage;
