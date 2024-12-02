import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import apiClient from '../services/api';

const PredictionsListScreen = ({ navigation }) => {
  const [predictions, setPredictions] = useState([]);

  const fetchPredictions = async () => {
    try {
      const response = await apiClient.get('predictions/');
      setPredictions(response.data.predictions);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  const navigateToDetails = (id) => {
    navigation.navigate('PredictionDetails', { id });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigateToDetails(item.id)} style={styles.item}>
      <Text style={styles.title}>{item.site_name}</Text>
      <Text>{item.timestamp}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={predictions}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  title: { fontWeight: 'bold', fontSize: 16 },
});

export default PredictionsListScreen;
