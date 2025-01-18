import React, { useRef } from 'react';
import { View, Text, StyleSheet, Button, Share, Image, Alert } from 'react-native';
import ViewShot from 'react-native-view-shot';

const ResultScreen = ({ route, navigation }) => {
  const { cardNumber, packageName, duration, prefix, transactionDate, transactionTime } = route.params;
  const viewShotRef = useRef(); // Ref for capturing the view

  const shareBillDetails = async () => {
    try {
      const uri = await viewShotRef.current.capture(); // Capture the screenshot

      await Share.share({
        // message: `Bill Details:\nCard Number: ${cardNumber}\nPackage Name: ${packageName}\nDuration/Month: ${duration} ${prefix}\nDate of Transaction: ${transactionDate}`,
        url: uri, // Share the captured screenshot
      });

    } catch (error) {
      Alert.alert('Error', 'Failed to share bill details.');
      console.error('Error sharing bill details:', error);
    }
  };

  return (
    <View style={{ backgroundColor: '#363636', flex: 1 }}>
      <ViewShot
        ref={viewShotRef}
        options={{ format: 'jpg', quality: 0.9 }}
        style={styles.container}
      >
        <View style={{ backgroundColor: '#f98935', padding: 5 }}>
          <Text style={styles.header}>AFRICAN GENIUS STAFF / AGESTA</Text>
          <Text style={styles.header}>CANAL PAYMENT - {prefix}</Text>
        </View>

        <View style={[styles.rowContainer, { backgroundColor: '#363636', padding: 20 }]}>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Card No: {cardNumber}</Text>
            <Text style={styles.label}>Package: {packageName}</Text>
            <Text style={styles.label}>Duration/Month: {duration}</Text>
            <Text style={styles.label}>Date: {transactionDate} {transactionTime}</Text>
          </View>
          <Image
            style={styles.image}
            source={require('./../assets/agesta.png')}
          />
        </View>
        <View style={{ backgroundColor: '#676767', padding: 5, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 15, paddingRight: 15 }}>
          <Image
            style={styles.canallogo}
            source={require('./../assets/canalplus.png')}
          />
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5 }}>
            <Image
              style={styles.wlogo}
              source={require('./../assets/whatsapp.png')}
            />
            <Text style={styles.labelnum}>+257 61 85 40 88</Text>
          </View>
        </View>

        {/* <Button title="Share Bill as Image" onPress={shareBillDetails} /> */}
      </ViewShot>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f98935',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsContainer: {
    flex: 1,
  },
  header: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 15,
    marginBottom: 5,
    color: 'white',
  },
  labelnum: {
    fontSize: 15,
    marginBottom: 5,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 5,
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: -10,
    resizeMode: 'contain',
  },
  wlogo: {
    width: 25,
    height: 25,
  },
  canallogo: {
    width: 100,
    height: 25,
    // marginRight: 25,
  },
});

export default ResultScreen;
