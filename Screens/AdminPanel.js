import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { db } from '../firebase';

export default function AdminPanel({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchConfirmDataData = async () => {
        try {
          const querySnapshot = await db.collection('ConfirmData').get();
          const ConfirmDataData = querySnapshot.docs
            .map(doc => {
              const data = doc.data();
              // Filtreleme: banned=true olanları alma
              if (data.banned === true) return null;
              if (data.confirmed === true) return null;
              return {
                id: doc.id,
                ...data,
                date: parseDate(data.date).toISOString()
              };
            })
            .filter(Boolean); // null olanları filtrele
            
          // Sıralama: Tarihe göre (en eski ilk)
          ConfirmDataData.sort((a, b) => new Date(a.date) - new Date(b.date));
  
          setData(ConfirmDataData);
          setLoading(false);
        } catch (error) {
          console.error('Hata: Onaylanmamış veriler alınamadı: ', error);
          setLoading(false);
        }
      };
      fetchConfirmDataData();
    }, [])
  );
  

  const parseDate = (dateStr) => {
    const [day, month, yearAndTime] = dateStr.split('.');
    const [year, time] = yearAndTime.split(' ');
    const [hours, minutes] = time.split(':');
    return new Date(year, month - 1, day, hours, minutes);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Panel</Text>
      <TouchableOpacity
        style={styles.bannedButton}
        onPress={() => navigation.navigate('AdminBanned')}>
        <Text style={styles.bannedButtonText}>Banlanan Günlükler</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.bannedButton}
        onPress={() => navigation.navigate('AdminConfirmed')}>
        <Text style={styles.bannedButtonText}>Onaylanan Günlükler</Text>
      </TouchableOpacity>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          !item.banned && (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => navigation.navigate('AdminConfirm', { item })}
            >
              <Text>User ID: {item.userid}</Text>
              <Text>Anonymous ID: {item.userAnonymousId}</Text>
              <Text>City: {item.city}</Text>
              <Text>Date: {new Date(item.date).toLocaleString()}</Text>
              <Text>Confirmed: {item.confirmed ? 'Yes' : 'No'}</Text>
              <Text>Banned: {item.banned ? 'Yes' : 'No'}</Text>
            </TouchableOpacity>
          )
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  bannedButton: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#ff4d4d',
    borderRadius: 5,
    alignItems: 'center',
  },
  bannedButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
