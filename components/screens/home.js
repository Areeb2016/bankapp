import "react-native-gesture-handler";
import React, {useEffect, useState} from 'react'
import {Card, Input, Button} from 'react-native-elements'
import {Text, View, StyleSheet, TouchableOpacity, FlatList, Image, ScrollView, SafeAreaView, RefreshControl} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {openDatabase} from 'react-native-sqlite-storage';

const db = openDatabase({name: 'db.db', createFromLocation: 1});

const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}


export default function HomeScreen({navigation}) {

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(2000).then(() => setRefreshing(false));
  }, []);
    
    let [flatListItems, setFlatListItems] = useState([]);

    useEffect(() => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM tbl_user',
          [],
          (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i)
              temp.push(results.rows.item(i));
            setFlatListItems(temp);
          });
        });
      }, [refreshing]);

      let listItemView = (item) => {
        return (
          <View>
          <TouchableOpacity key={item.user_id} onPress={() => navigation.navigate('Customer',{user_id:item.user_id})}>
          <Card
            containerStyle={{backgroundColor:'white', padding:20}}>
            <Text style={{fontSize:16, fontWeight:'bold'}}>Id: {item.user_id}</Text>
            <Text style={{fontSize:16, fontWeight:'bold'}}>Name: {item.user_name}</Text>
            <Text style={{fontSize:16, fontWeight:'bold'}}>Email: {item.user_email}</Text>
            <Text style={{fontSize:16, fontWeight:'bold'}}>Balance: ${item.user_balance}</Text>
            </Card>
            </TouchableOpacity>  
          </View>
        );
      };

      return (
        <SafeAreaView style={{flex: 1}}>
          <View style={{flex: 1, marginBottom:10}}>
            
              <FlatList 
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
                data={flatListItems}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => listItemView(item)}
              />
            
            
          </View>
        </SafeAreaView>
      );

}