import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { db, auth } from '../firebase';
import DailyItem from '../Components/DailyItem';

export default function Explore() {
  const [randomDaily, setRandomDaily] = useState(null);

  useEffect(() => {
    fetchRandomDaily();
  }, []);

  const fetchRandomDaily = async () => {
    try {
      const querySnapshot = await db.collection('ConfirmData').get();
      if (!querySnapshot.empty) {
        const randomIndex = Math.floor(Math.random() * querySnapshot.docs.length);
        const randomDoc = querySnapshot.docs[randomIndex];
        if (randomDoc.exists) {
          const randomDaily = randomDoc.data();
          setRandomDaily(randomDaily);
        } else {
          console.error('Hata: Rastgele günlük bulunamadı.');
        }
      } else {
        console.log('Veri boş');
      }
    } catch (error) {
      console.error('Hata: Rastgele günlük alınamadı: ', error);
    }
  };

  const addToFavorites = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const dailyId = randomDaily.docId;

        const docSnapshot = await db.collection('ConfirmData').doc(dailyId).get();

        if (docSnapshot.exists) {
          const dailyData = docSnapshot.data();
          await db.collection('users').doc(userId).collection('users_favorites').doc(dailyId).set({ docId: dailyData.docId });
          console.log('Günlük favorilere eklendi.');
        } else {
          console.error('Belirtilen günlük bulunamadı.');
        }
      } else {
        console.error('Kullanıcı oturumu açmamış.');
      }
    } catch (error) {
      console.error('Favorilere ekleme işlemi sırasında bir hata oluştu: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Günlük Keşfet</Text>
      <TouchableOpacity style={styles.refreshButton} onPress={fetchRandomDaily}>
        <Text style={styles.refreshButtonText}>Yeni Günlük Keşfet</Text>
      </TouchableOpacity>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.itemContainer}>
          {randomDaily ? (
            <DailyItem daily={randomDaily} />
          ) : (
            <Text style={styles.noDataText}>Günlük bulunamadı, lütfen daha sonra tekrar deneyin.</Text>
          )}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.addToFavoritesButton} onPress={addToFavorites}>
        <Text style={styles.addToFavoritesButtonText}>Favorilere Ekle</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  refreshButton: {
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  addToFavoritesButton: {
    alignItems: 'center',
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
  addToFavoritesButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 20,
  },
});
