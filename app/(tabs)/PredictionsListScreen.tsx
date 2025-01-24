import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import apiClient from '../services/api';
import { useToken } from '../hooks/TokenStorageHook';

interface Prediction {
  id: string;
  site_name: string;
  location: string;
  result: string;
  timestamp: string;
}

const PredictionsListScreen: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { token, storeToken, isLoading: tokenLoading } = useToken();

  // Fetch predictions from the API
  const fetchPredictions = async () => {
    if (!token) {
      Alert.alert('Error', 'Authentication token not found. Please log in again.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.get('predictions-list/', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setPredictions(response.data.predictions);
      } else {
        Alert.alert('Error', 'Failed to fetch predictions');
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
      Alert.alert('Error', 'Unable to fetch predictions. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh predictions every 30 seconds
  useEffect(() => {
    if (!tokenLoading && token) {
      fetchPredictions(); // Initial fetch

      // Set up auto-refresh interval
      const interval = setInterval(fetchPredictions, 30000); // 30 seconds

      // Clean up interval on component unmount
      return () => clearInterval(interval);
    }
  }, [token, tokenLoading]);

  // Manual refresh handler
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPredictions();
    setRefreshing(false);
  };

  // Render each prediction item
  const renderPredictionItem = ({ item }: { item: Prediction }) => (
    <TouchableOpacity
      style={styles.predictionCard}
      onPress={() => {
        Alert.alert(
          'Prediction Details',
          `Site Name: ${item.site_name}\nLocation: ${item.location}\nResult: ${item.result}\nDate: ${new Date(
            item.timestamp
          ).toLocaleString()}`,
          [{ text: 'Close' }]
        );
      }}
    >
      <Text style={styles.predictionSiteName}>{item.site_name}</Text>
      <Text style={styles.predictionResult}>Result: {item.result}</Text>
      <Text style={styles.predictionDate}>
        Date: {new Date(item.timestamp).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  // Show loading spinner if token is still loading
  if (tokenLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#328A43FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#328A43FF" />
      ) : (
        <FlatList
          data={predictions}
          keyExtractor={(item) => item.id}
          renderItem={renderPredictionItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyListText}>No predictions available.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    padding: 10,
  },
  predictionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  predictionSiteName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  predictionResult: {
    fontSize: 16,
    color: '#388E3C',
    marginTop: 5,
  },
  predictionDate: {
    fontSize: 14,
    color: '#757575',
    marginTop: 5,
  },
  emptyListText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#9E9E9E',
    marginTop: 20,
  },
});

export default PredictionsListScreen;