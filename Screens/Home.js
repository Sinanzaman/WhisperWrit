import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, BackHandler, Alert } from 'react-native';

const Home = ({navigation}) =>{

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                Alert.alert(
                    'Çıkış Yap',
                    'Uygulamadan çıkmak istediğinize emin misiniz?',
                    [
                        { text: 'Hayır', style: 'cancel' },
                        { text: 'Evet', onPress: () => BackHandler.exitApp() }
                    ]
                );
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    const navigateLogin = () => {
        navigation.navigate('Login');
    }
    const navigateAdmin = () => {
        navigation.navigate('AdminLoginScreen');
    }
    
    return(
       <ScrollView contentContainerStyle={{flex:1}}>
            <View style={styles.container}>
                <View style={{marginTop:100}}>
                    <Image style={{width:230, height:230, borderRadius:40}}
                        source={require('../assets/Images/Logo.png')}
                    />
                </View>

                <View>
                    <Text style={styles.bookShop}>WhisperWrit</Text>
                </View>

                <View style={{width:'70%'}}>
                    <Text style={styles.lorem}>Anonim Günlük Uygulamasına Hoşgeldiniz</Text>
                </View>

                <View style={{justifyContent:'center', alignItems:'center', width:'100%'}}>
                    <TouchableOpacity style={styles.btnTouch} onPress ={navigateLogin}>
                            <Text style={styles.btnSing}>Kullanıcı Girişi</Text>
                    </TouchableOpacity>
                </View>
                <View style={{justifyContent:'center', alignItems:'center', width:'100%'}}>
                    <TouchableOpacity style={styles.btnTouch2} onPress ={navigateAdmin}>
                            <Text style={styles.btnSing}>Admin Girişi</Text>
                    </TouchableOpacity>
                </View>
            </View>
       </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ADD8E6',
      alignItems: 'center',
    },
    bookShop:{
        marginTop:50,
        fontSize:35,
        fontWeight:'bold',
    },
    lorem:{
        marginTop:30,
        fontSize:18,
        textAlign:'center',
    },
    btnTouch:{
        marginTop:60,
        width:'90%', 
        height:50, 
        backgroundColor:'#0984E3', 
        justifyContent:'center', 
        alignItems:'center', 
        borderRadius:15,
    },
    btnTouch2:{
        marginTop:15,
        width:'90%', 
        height:50, 
        backgroundColor:'green', 
        justifyContent:'center', 
        alignItems:'center', 
        borderRadius:15,
    },
    btnSing:{
        color:'#FFFCFC', 
        fontSize:20, 
        fontWeight:'bold',
    }
  });
export default Home;