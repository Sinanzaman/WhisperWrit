import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { db } from '../firebase';

export default function AdminConfirm({ route, navigation }) {
  const { item } = route.params;
  const date = new Date(item.date); // Convert the string back to a Date object

  const handleConfirm = async () => {
    try {
      await db.collection('ConfirmData').doc(item.id).update({
        confirmed: true,
        banned: false,
      });
      navigation.goBack(); // Go back to the previous screen
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const handleBan = async () => {
    try {
      await db.collection('ConfirmData').doc(item.id).update({
        confirmed: false,
        banned: true,
      });
      navigation.goBack(); // Go back to the previous screen
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>User ID:</Text>
      <Text style={styles.value}>{item.userid}</Text>

      <Text style={styles.label}>Anonymous ID:</Text>
      <Text style={styles.value}>{item.userAnonymousId}</Text>

      <Text style={styles.label}>City:</Text>
      <Text style={styles.value}>{item.city}</Text>

      <Text style={styles.label}>Date:</Text>
      <Text style={styles.value}>{date.toLocaleString()}</Text>

      <Text style={styles.label}>Confirmed:</Text>
      <Text style={styles.value}>{item.confirmed ? 'Yes' : 'No'}</Text>

      <Text style={styles.label}>Banned:</Text>
      <Text style={styles.value}>{item.banned ? 'Yes' : 'No'}</Text>

      <Text style={styles.label}>Daily:</Text>
      <Text style={styles.daily}>{item.daily}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Onayla</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.banButton} onPress={handleBan}>
          <Text style={styles.buttonText}>Banla</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  daily: {
    marginTop: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  banButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 5,
    flex: 1,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
