import * as React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Dimensions, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Menu, Provider } from 'react-native-paper';
import { auth, createAnonymousid, db, getUserAnonymousId, saveDailyforConfirm } from '../firebase';

const cities = [
  "Şehir Seç", "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın",
  "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", 
  "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", 
  "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", 
  "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", 
  "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", 
  "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", 
  "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", 
  "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
];

export default function WriteDaily() {
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [dailytext, setDailytext] = useState("");
  const [anonymousId, setAnonymousId] = useState("");
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const user= auth.currentUser;

  useFocusEffect(
    React.useCallback(() => {
      const fetchAnonymousId = async () => {
        try {
          const userDoc = await db.collection('users').doc(user.uid).get(); // Kullanıcının id'sini al
          if (userDoc.exists) {
            const anonymousId = await getUserAnonymousId();
            setAnonymousId(anonymousId);
            return console.log("Kullanıcı Anonim-id bulundu : " + anonymousId);
          } else {
            const anonymousidd = createAnonymousid();
            setAnonymousId(anonymousidd);
            return console.log("Kullanıcı Anonim-id oluşturuldu : " + anonymousidd);
          }
        } catch (error) {
          console.error('Hata oluştu:', error);
        }
      };

      fetchAnonymousId();
    }, [])
  );

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.header}>Günlük Yaz</Text>
        <Text style={{color:'red', fontSize:12, textAlign:'center', marginBottom:4}}>
          Şiddet, cinsel içerikler vb. kelimeler günlüğünüzün yayınlanmamasına neden olur. Lütfen dikkat ediniz!
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Günlüğünüzü yazın..."
          multiline
          value={dailytext}
          onChangeText={(text)=> setDailytext(text)}
        />
        <View >
          <TouchableOpacity onPress={openMenu} style={styles.cityButton}>
            <Text style={styles.cityButtonText}>{selectedCity}</Text>
          </TouchableOpacity>
          {visible && (
            <ScrollView style={styles.menuScroll}>
              {cities.map((city) => (
                <TouchableOpacity
                  key={city}
                  onPress={() => {
                    setSelectedCity(city);
                    closeMenu();
                  }}
                >
                  <Text style={styles.cityOption}>{city}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
        <TouchableOpacity onPress={() => setDailytext("") } style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Yazılanları Temizle</Text>
        </TouchableOpacity>
        {anonymousId && dailytext && selectedCity!=="Şehir Seç" ? <TouchableOpacity onPress={() => {
          saveDailyforConfirm(user.uid, dailytext,selectedCity)
          setDailytext("")
          setSelectedCity("Şehir Seç");
          Alert.alert("Günlüğünüz incelemelerden sonra paylaşılacaktır");
        }
          } style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Gönder</Text>
        </TouchableOpacity> : <Text style={{textAlign:'center', marginTop:8}}>Boş yazı ve Şehir Seçmeden Gönderilemez</Text>}
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: Dimensions.get('window').height * 0.55,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  cityButton: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityButtonText: {
    fontSize: 16,
    color: '#000',
  },
  menuScroll: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginTop: 5,
  },
  cityOption: {
    padding: 10,
  },
  sendButton: {
    backgroundColor: '#6200ee',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:8,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
