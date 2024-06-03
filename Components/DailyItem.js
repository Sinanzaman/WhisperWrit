import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const DailyItem = ({ daily }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={{fontSize: 16, textAlign: 'center', marginBottom: 10}}>{daily.daily}</Text>
      <View style={styles.metadataContainer}>
        <Text style={styles.label}>Kullanıcı Anonim ID:</Text>
        <Text style={styles.value}>{daily.userAnonymousId}</Text>
        <Text style={styles.label}>Şehir:</Text>
        <Text style={styles.value}>{daily.city}</Text>
        <Text style={styles.label}>Tarih:</Text>
        <Text style={styles.value}>{daily.date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  metadataContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    paddingTop: 10,
    borderTopColor: '#ccc',
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 13,
    marginBottom: 5,
  },
});

export default DailyItem;
