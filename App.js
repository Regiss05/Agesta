import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import InputScreen from './screens/InputScreen';
import ResultScreen from './screens/ResultScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="InputScreen">
        <Stack.Screen name="InputScreen" component={InputScreen} options={{ title: 'Entrez les détails de la facture' }} />
        <Stack.Screen name="ResultScreen" component={ResultScreen} options={{ title: 'Détails de la facture' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
