import "react-native-gesture-handler";
import React, {useState, useEffect} from 'react';
import {Text, View, SafeAreaView, TouchableOpacity, FlatList, Alert, StyleSheet} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';
import { Card, Input, Overlay } from 'react-native-elements'

const db = openDatabase({name: 'db.db', createFromLocation: 1});

export default function CustomrScreen({route, navigation}) {
  const {user_id} = route.params;

  let [userData, setUserData] = useState({});
  let [flatListItems, setFlatListItems] = useState([]);
  let [select, setSelect] = useState(0)
  let [amount, setAmount] = useState(0)
  let [userData1, setUserData1] = useState(0);
  let [currentplus, setCurrentplus] = useState(0);
  let [currentminus, setCurrentminus] = useState(0);
  let [sender, setSender] = useState('')
  let [reciever, setReciever] = useState('')

    const [visible, setVisible] = useState(false);
    const [visible2, setVisible2] = useState(false);
  
    const toggleOverlay = () => {
      setVisible(!visible);
    }; 
    const toggleOverlay2 = () => {
        setVisible2(!visible2);
      }; 

      const toggleOverlaycustom2 = () => {
        setVisible2(!visible2);
        Alert.alert(
            'Amount will be deducted',
            '',
            [
              {
                text: 'Ok',
                onPress: updateUser,
              },
            ],
            {cancelable: false},
          );
      }; 

  //fetching users balance
    const toggleOverlaycustom = () => {
        setVisible(!visible);
        db.transaction((tx) => {
            tx.executeSql(
              'SELECT * FROM tbl_user where user_id = ?',
              [select],
              (tx, results) => {
                var len = results.rows.length;
                console.log('len', len, results.rows.item(0));
                if (len > 0) {
                  setUserData1(results.rows.item(0));
                } else {
                  alert('No user found');
                }
              },
            );
          });
          setVisible2(!visible2);
    };  

  useEffect(() => {
    console.log(user_id);
    setUserData({});
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM tbl_user where user_id = ?',
        [user_id],
        (tx, results) => {
          var len = results.rows.length;
          console.log('len', len);
          if (len > 0) {
            setUserData(results.rows.item(0));
          } else {
            alert('No user found');
          }
        },
      );
    });

    //fetching all customers
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

}, []);

//updating amounts to be entered to database
const updateAmount = () => {
    setCurrentminus(userData.user_balance - amount);
    setCurrentplus(userData1.user_balance + amount);
}

const updateUser = () => {
    
  //updating the reciever
    db.transaction((tx) => {
        tx.executeSql(
          'UPDATE tbl_user set user_balance=? where user_id=?',
          [currentplus, select],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
          },
        );
      });

    //updating the sender
      db.transaction((tx) => {
        tx.executeSql(
          'UPDATE tbl_user set user_balance=? where user_id=?',
          [currentminus, user_id],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) { 
              updateTable();
            } else alert('Updation Failed');
          },
        );
      });
}

const updateTable = () => {
  
  //updating the transaction table
  let sender = userData.user_name;
  let reciever = userData1.user_name;
  
  db.transaction(function (tx) {
    tx.executeSql(
      'INSERT INTO tbl_transaction (transaction_giver, transaction_reciever, transaction_amount) VALUES (?,?,?)',
      [sender, reciever, amount],
      (tx, results) => {
        console.log('Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          Alert.alert(
            'Transaction Successfull',
            '',
            [
              {
                text: 'Ok',
                onPress: () => navigation.popToTop(),
              },
            ],
            {cancelable: false},
          );
        } else alert('Registration Failed');
      },
    );
});

} 

//list view for displaying all customers
  let listItemView = (item) => {
    return (
      <View>
      <TouchableOpacity key={item.user_id} onPressIn={() => setSelect(item.user_id)} onPressOut={toggleOverlaycustom}>
      <Card
        containerStyle={{backgroundColor:'white', padding:20}}>
        <Text>Name: {item.user_name}</Text>
        <Text>Email: {item.user_email}</Text>
        </Card>
        </TouchableOpacity>  
      </View>
    );
  };

    return(
        <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
          
          
            <View style={{marginTop:20}}>
            <Text style={styles.mtext}>User Id: </Text>  
            <Text style={styles.ntext}>{userData.user_id}</Text>
            </View>

            <View style={{marginTop:10}}>
            <Text style={styles.mtext}>User Name: </Text>
            <Text style={styles.ntext}>{userData.user_name}</Text>
            </View>

            <View style={{marginTop:10}}>
            <Text style={styles.mtext}>User Email: </Text>
            <Text style={styles.ntext}>{userData.user_email}</Text>
            </View>

            <View style={{marginTop:10}}>
            <Text style={styles.mtext}>User Balance: </Text>
            <Text style={styles.ntext}>${userData.user_balance}</Text>
            </View>
          

    <TouchableOpacity style={styles.button} onPress={toggleOverlay}>
      <Text style={styles.text}> Transfer Money </Text>
    </TouchableOpacity>

{/* //View all customer Overlay */}
        <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
          <Text style={{color: '#111825', fontSize: 18, fontWeight:'bold'}}>Select a Customer to make the transfer</Text>
                <FlatList
                data={flatListItems}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => listItemView(item)}
              />
        </Overlay>

{/* //Enter Amount Overlay */}
        <Overlay isVisible={visible2} onBackdropPress={toggleOverlay2}>
            <Input placeholder='Amount' label='Enter Amount to Transfer' onChangeText={(e) => setAmount(parseInt(e))} />
        
            <TouchableOpacity style={styles.button} onPressIn={updateAmount} onPressOut={toggleOverlaycustom2}>
              <Text style={styles.text}> Confirm Transfer </Text>
            </TouchableOpacity>
        
        </Overlay>
      
      </View>
    </SafeAreaView>
    )

}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#f4511e',
    color: '#ffffff',
    padding: 10,
    marginTop: 50,
    marginLeft: 35,
    marginRight: 35,
  },
  text: {
    color: '#ffffff',
  },
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