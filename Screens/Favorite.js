import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { db, auth } from '../firebase'; // Firebase bağlantısı

export default function Favorite() {
  const [favoriteDailies, setFavoriteDailies] = useState([]);
  const [selectedDaily, setSelectedDaily] = useState(null); // Seçilen günlüğü tutacak durum değişkeni

  useEffect(() => {
    fetchFavoriteDailies();
  }, []);

  const fetchFavoriteDailies = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const snapshot = await db.collection('users').doc(userId).collection('users_favorites').get();
        const favorites = snapshot.docs.map(doc => doc.data().docId);

        const dailyPromises = favorites.map(async docId => {
          const doc = await db.collection('ConfirmData').doc(docId).get();
          return { ...doc.data(), docId };
        });

        const favoriteDailiesData = await Promise.all(dailyPromises);
        setFavoriteDailies(favoriteDailiesData);
      } else {
        console.error('Kullanıcı oturumu açmamış.');
      }
    } catch (error) {
      console.error('Favori günlükler alınırken bir hata oluştu: ', error);
    }
  };

  const handleDailyPress = (daily) => {
    setSelectedDaily(daily); // Tıklanan günlüğü seçilen günlük olarak ayarla
  };

  const handleBackPress = () => {
    setSelectedDaily(null); // Geri butonuna basıldığında seçimi temizle
  };

  const removeFromFavorites = async (daily) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        await db.collection('users').doc(userId).collection('users_favorites').doc(daily.docId).delete();
        console.log('Günlük favorilerden çıkarıldı.');
        fetchFavoriteDailies(); // Favori günlükleri yeniden yükle
        handleBackPress(); // Günlük detayından çık
      } else {
        console.error('Kullanıcı oturumu açmamış.');
      }
    } catch (error) {
      console.error('Favorilerden çıkarma işlemi sırasında bir hata oluştu: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favori Günlükler</Text>
      {selectedDaily ? (
        <ScrollView style={styles.scrollView}>
          <View style={styles.dailyDetailContainer}>
            <Text style={styles.dailyText}>{selectedDaily.daily}</Text>
            <Text style={styles.label}>Kullanıcı Anonim ID:</Text>
            <Text style={styles.value}>{selectedDaily.userAnonymousId}</Text>
            <Text style={styles.label}>Şehir:</Text>
            <Text style={styles.value}>{selectedDaily.city}</Text>
            <Text style={styles.label}>Tarih:</Text>
            <Text style={styles.value}>{selectedDaily.date}</Text>
            <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
              <Text style={styles.backButtonText}>Geri</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.removeButton} onPress={() => removeFromFavorites(selectedDaily)}>
              <Text style={styles.removeButtonText}>Favorilerden Çıkar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <ScrollView>
          {favoriteDailies.map((daily, index) => (
            <TouchableOpacity key={index} style={styles.dailyContainer} onPress={() => handleDailyPress(daily)}>
              <Text style={styles.dailyText}>{daily.daily}</Text>
              <Text style={styles.label}>Kullanıcı Anonim ID:</Text>
              <Text style={styles.value}>{daily.userAnonymousId}</Text>
              <Text style={styles.label}>Şehir:</Text>
              <Text style={styles.value}>{daily.city}</Text>
              <Text style={styles.label}>Tarih:</Text>
              <Text style={styles.value}>{daily.date}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  dailyContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  dailyText: {
    fontSize: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 13,
    marginBottom: 5,
  },
  dailyDetailContainer: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  removeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#dc3545',
    borderRadius: 5,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
});
