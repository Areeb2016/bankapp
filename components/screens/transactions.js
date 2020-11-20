import "react-native-gesture-handler";
import React, {useEffect, useState} from 'react'
import {Text, View, FlatList, SafeAreaView, StyleSheet} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';

const db = openDatabase({name: 'db.db', createFromLocation: 1});

export default function TransactionScreen({}) {

    let [flatListItems, setFlatListItems] = useState([]);

    //fetching all transactions from the table
    useEffect(() => {
        db.transaction((tx) => {
          tx.executeSql('SELECT * FROM tbl_transaction',
          [],
          (tx, results) => {
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i)
              temp.push(results.rows.item(i));
            setFlatListItems(temp);
          });
        });
      }, []);

      //view for the transaction
      let listItemView = (item) => {
        return (
          <View>
        
          <View>
            <Text style={styles.mtext}>Transaction Id: </Text>  
            <Text style={styles.ntext}>{item.transaction_id}</Text>
            </View>

            <View>
            <Text style={styles.mtext}>Sender: </Text>
            <Text style={styles.ntext}>{item.transaction_giver}</Text>
            </View>

            <View>
            <Text style={styles.mtext}>Reciever: </Text>
            <Text style={styles.ntext}>{item.transaction_reciever}</Text>
            </View>

            <View>
            <Text style={styles.mtext}>Transaction Amount: </Text>
            <Text style={styles.ntext}>${item.transaction_amount}</Text>
            </View>
             
             <View style={{borderColor:'black', borderWidth:1, marginTop:10}}/>
          </View>
        );
      };

      return (
        <SafeAreaView style={{flex: 1}}>
          <View style={{flex: 1, marginBottom:10}}>
            
              <FlatList 
                data={flatListItems}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => listItemView(item)}
              />

          </View>
        </SafeAreaView>
      );

}

const styles = StyleSheet.create({
  mtext: {
      color: '#111825',
      fontSize: 18,
      marginTop: 10,
      marginBottom: 10,
      marginLeft: 20,
    },
    ntext: {
      color: '#111825', 
      fontSize: 18, 
      alignSelf:'flex-end', 
      marginTop:-34, 
      fontWeight:'bold', 
      marginRight:20
    },
    tview: {
      flexDirection:'row'
    }
});