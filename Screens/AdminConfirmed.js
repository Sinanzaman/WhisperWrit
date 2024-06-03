import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { db } from '../firebase';

export default function AdminConfirmed() {
  const [confirmedData, setConfirmedData] = useState([]);

  const parseDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };  

  useFocusEffect(
    React.useCallback(() => {
      const fetchconfirmedData = async () => {
        try {
            const querySnapshot = await db.collection('ConfirmData')
            .where('banned', '==', false)
            .where('confirmed', '==', true)
            .get();          
          const confirmedData = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              date: parseDate(data.date)
            };
          });
  
          // Sıralama: Tarihe göre (en eski ilk)
          confirmedData.sort((a, b) => new Date(a.date) - new Date(b.date));
  
          setConfirmedData(confirmedData);
        } catch (error) {
          console.error('Hata: Onaylı veriler alınamadı: ', error);
        }
      };
      fetchconfirmedData();
    }, [])
  );
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Onaylanan Günlükler</Text>
      <FlatList
        data={confirmedData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text>User ID: {item.userid}</Text>
            <Text>Anonymous ID: {item.userAnonymousId}</Text>
            <Text>City: {item.city}</Text>
            <Text>Date: {new Date(item.date).toLocaleString()}</Text>
            <Text>Confirmed: {item.confirmed ? 'Yes' : 'No'}</Text>
            <Text>Banned: {item.banned ? 'Yes' : 'No'}</Text>
          </View>
        )}
      />
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
    marginBottom: 20,
    textAlign: 'center',
  },
  itemContainer: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
});