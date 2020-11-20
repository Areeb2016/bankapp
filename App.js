import 'react-native-gesture-handler';
import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './components/screens/home';
import CustomerScreen from './components/screens/customer';
import { View, Animated, Easing, Text } from 'react-native'

console.disableYellowBox = true;

const Stack = createStackNavigator();

function App(){

  const [progress] = React.useState(new Animated.Value(0))
  const [show, setShow] = React.useState(true)

  React.useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
      easing: Easing.linear,
    }
    ).start(() => {
      setTimeout(() => {
        setShow(false)
      }, 100); 
    });
  })
  
  return (
    <NavigationContainer>
      
      {(show == true) && 
        <View style={{flex:1, justifyContent:'center', alignSelf:'center'}}>
            <Text style={{fontSize:40, fontStyle:'italic', fontWeight:'bold'}}>BANK APP</Text>
        </View>
      }
      {(show == false) && 
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} 
        options={{
          title: 'Home',
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff', 
          headerTitleStyle: {
            fontWeight: 'bold', 
          },
        }}
        />
        <Stack.Screen name="Customer" component={CustomerScreen} 
        options={{
          title: 'Customer', 
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff', 
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
        />
        </Stack.Navigator>
        }
    </NavigationContainer>
  );
}

export default App;