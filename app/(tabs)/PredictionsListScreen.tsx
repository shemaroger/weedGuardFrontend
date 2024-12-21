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
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Prediction {
  id: string;
  site_name: string;
  location: string;
  result: string;
  timestamp: string; // Changed 'created_at' to 'timestamp' based on the backend response
}

const PredictionsListScreen: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Fetch predictions from the API
  const fetchPredictions = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('accessToken');
      console.log('Token retrieved from AsyncStorage:', token); // Log the retrieved token

      if (!token) {
        Alert.alert('Error', 'Authentication token not found. Please log in again.');
        console.log('No token found, please log in again.'); // Log when token is not found
        return;
      }

      // Check if the token is empty (though technically AsyncStorage.getItem returns null if not found)
      if (token.trim() === '') {
        Alert.alert('Error', 'Authentication token is empty. Please log in again.');
        console.log('Token is empty, please log in again.'); // Log if token is empty
        return;
      }

      // Send API request with the token
      const response = await apiClient.get('predictions/', {
        headers: { Authorization: `Bearer ${token}` }, // Adjusted API path
      });

      console.log('API response:', response); // Log the response from the API

      if (response.status === 200) {
        setPredictions(response.data.predictions); // Assuming response contains predictions key
      } else {
        Alert.alert('Error', 'Failed to fetch predictions');
        console.log('Failed to fetch predictions, status:', response.status); // Log failure status
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
      Alert.alert('Error', 'Unable to fetch predictions. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Ensure we fetch the predictions only when the token is available
    const checkTokenAndFetch = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      console.log('Checking token in useEffect:', token);
      if (token) {
        fetchPredictions();
      } else {
        console.log('Token not found in useEffect');
      }
    };
    
    checkTokenAndFetch();
  }, []); // Empty dependency array ensures this runs only once on component mount

  // Handle pull-to-refresh
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
          ).toLocaleString()}`, // Adjusted to use 'timestamp'
          [{ text: 'Close' }]
        );
      }}
    >
      <Text style={styles.predictionSiteName}>{item.site_name}</Text>
      <Text style={styles.predictionResult}>Result: {item.result}</Text>
      <Text style={styles.predictionDate}>
        Date: {new Date(item.timestamp).toLocaleDateString()} {/* Adjusted to use 'timestamp' */}
      </Text>
    </TouchableOpacity>
  );

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
