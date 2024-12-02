import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import apiClient from '../services/api';

interface Prediction {
  id: number; // Or `string` based on your API
  site_name: string;
  timestamp: string;
}

interface PredictionsListScreenProps {
  navigation: NavigationProp<any>;
}

const PredictionsListScreen: React.FC<PredictionsListScreenProps> = ({ navigation }) => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  const fetchPredictions = async () => {
    try {
      const response = await apiClient.get<{ predictions: Prediction[] }>('predictions/');
      setPredictions(response.data.predictions);
    } catch (error) {
      console.error('Failed to fetch predictions:', error);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  const navigateToDetails = (id: number) => {
    navigation.navigate('PredictionDetails', { id });
  };

  const renderItem = ({ item }: { item: Prediction }) => (
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
