import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import firebase from 'firebase/app';
import { auth, db } from '../firebase';

export default function UsersDailies() {
  const [dailies, setDailies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingDailyId, setDeletingDailyId] = useState(null);

  useEffect(() => {
    const fetchDailies = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const snapshot = await db.collection('ConfirmData')
            .where('userid', '==', user.uid)
            .get();

          const userDailies = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          setDailies(userDailies);
        } else {
          console.error('Kullanıcı oturumu açmamış.');
        }
      } catch (error) {
        console.error('Günlükler getirilirken bir hata oluştu: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailies();
  }, []);

  const handleDeleteDaily = async (dailyId) => {
    setDeletingDailyId(dailyId);
    Alert.alert(
      'Onay',
      'Bu günlüğü silmek istediğinizden emin misiniz?',
      [
        {
          text: 'İptal',
          onPress: () => setDeletingDailyId(null),
          style: 'cancel',
        },
        {
          text: 'Evet',
          onPress: async () => {
            try {
              await db.collection('ConfirmData').doc(dailyId).delete();
              setDailies(prevDailies => prevDailies.filter(daily => daily.id !== dailyId));
              Alert.alert('Başarılı', 'Günlük başarıyla silindi.');
            } catch (error) {
              console.error('Günlük silinirken bir hata oluştu: ', error);
              Alert.alert('Hata', 'Günlük silinirken bir hata oluştu.');
            } finally {
              setDeletingDailyId(null);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderDailyItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleDailyPress(item)}>
      <View style={styles.dailyContainer}>
        <Text style={styles.dailyText}>Şehir: {item.city}</Text>
        <Text style={styles.dailyText}>Günlük: {item.daily}</Text>
        <Text style={styles.dailyText}>Tarih: {item.date}</Text>
        <Text style={styles.dailyText}>Onaylandı mı: {item.confirmed ? 'Evet' : 'Hayır'}</Text>
        <TouchableOpacity onPress={() => handleDeleteDaily(item.id)} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Sil</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const handleDailyPress = (daily) => {
    // Günlük detaylarını göstermek için gerekli işlemleri yapabilirsiniz.
    // Örneğin, bir modal gösterilebilir veya başka bir sayfaya yönlendirme yapılabilir.
    console.log('Tıklanan Günlük:', daily);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={dailies}
        keyExtractor={(item) => item.id}
        renderItem={renderDailyItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  dailyContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dailyText: {
    fontSize: 16,
    marginBottom: 8,
  },
  deleteButton: {
    marginTop: 8,
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
  },
});
