import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, Alert} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import React from 'react';
import { auth } from '../firebase';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function Profile({navigation}) {

  const user= auth.currentUser;

  const handleChangePassword = () => {
      navigation.navigate('ChangePassword');
    }
  const handleFavorite = () => {
      navigation.navigate('Favorite');
    }
  const handleUsersDailies = () => {
      navigation.navigate('UsersDailies');
    }
  const handleDeleteAccount = () => {
      navigation.navigate('DeleteAccount');
    }
  const handleSignOut = () => {
    // Kullanıcıya emin misin diye sor
    Alert.alert(
        "Çıkış Yap",
        "Çıkış yapmak istediğinizden emin misiniz?",
        [
            {
                text: "Hayır, Geri Dön",
                style: "cancel"
            },
            { text: "Evet", onPress: () => signOut() }
        ]
    );
    };
    const signOut = () => {
        auth
            .signOut()
            .then(() => {
                navigation.navigate('Home Screen');
            })
            .catch((error) => Alert(error.message));
    };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
                <Image style={styles.profilePicture} source={require('../assets/Images/IMG-5353.jpg')} />
                <View>
                    <Text style={styles.profileText}>{`${user.email}`}</Text>
                </View>
            </View>
            <TouchableOpacity style={[styles.buttons, styles.buttonsPrimary]} onPress={handleChangePassword}>
                <Text style={[styles.buttonText, styles.buttonTextPrimary]}>Şifre Değiştir</Text>
                <AntDesign name="right" size={20} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttons, styles.buttonsPrimary]} onPress={handleUsersDailies}>
                <Text style={[styles.buttonText, styles.buttonTextPrimary]}>Tüm Günlüklerim</Text>
                <AntDesign name="right" size={20} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttons, styles.buttonsPrimary]} onPress={handleFavorite}>
                <Text style={[styles.buttonText, styles.buttonTextPrimary]}>Favori Günlüklerim</Text>
                <AntDesign name="right" size={20} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttons, styles.buttonsSecondary]} onPress={handleDeleteAccount}>
                <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Hesabımı Sil</Text>
                <AntDesign name="right" size={20} style={[styles.icon, { color: '#fff' }]} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttons, styles.buttonsSecondary]} onPress={handleSignOut}>
                <Text style={[styles.buttonText, styles.buttonTextSecondary]}>Çıkış Yap</Text>
                <AntDesign name="right" size={20} style={[styles.icon, { color: '#fff' }]} />
            </TouchableOpacity>
        </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
      flexGrow: 1,
      backgroundColor: "#F5F5F5", // Açık gri arka plan rengi
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop:50,
  },
  profileContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 30,
      paddingHorizontal: 20,
  },
  profilePicture: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#ddd', // Gri arka plan rengi
      marginRight: 20,
  },
  profileText: {
      fontSize: 18,
      marginBottom: 5,
  },
  buttons: {
      flexDirection: 'row',
      width: screenWidth * 0.9,
      height: screenHeight * 0.065,
      borderRadius: 8,
      borderWidth: 2,
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
      paddingHorizontal: 20,
  },
  buttonsPrimary: {
      borderColor: '#3498DB', // Mavi renk
  },
  buttonsSecondary: {
      backgroundColor: '#E74C3C', // Kırmızı renk
  },
  buttonText: {
      fontSize: 18,
  },
  buttonTextPrimary: {
      color: '#3498DB', // Mavi renk
  },
  buttonTextSecondary: {
      color: '#fff', // Beyaz renk
  },
  icon: {
      color: '#000', // Siyah renk
  },
})