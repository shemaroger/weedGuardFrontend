import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import apiClient from '../services/api';

interface PredictionDetails {
  site_name: string;
  location: string;
  result: string;
  timestamp: string;
}

type PredictionDetailsRouteProp = RouteProp<{ PredictionDetails: { id: string } }, 'PredictionDetails'>;

const PredictionDetailsScreen: React.FC<{ route: PredictionDetailsRouteProp }> = ({ route }) => {
  const { id } = route.params;
  const [details, setDetails] = useState<PredictionDetails | null>(null);

  const fetchDetails = async () => {
    try {
      const response = await apiClient.get<PredictionDetails>(`predictions/${id}/`);
      setDetails(response.data);
    } catch (error) {
      console.error('Failed to fetch prediction details:', error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  if (!details) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Site Name:</Text>
      <Text>{details.site_name}</Text>

      <Text style={styles.label}>Location:</Text>
      <Text>{details.location}</Text>

      <Text style={styles.label}>Result:</Text>
      <Text>{details.result}</Text>

      <Text style={styles.label}>Timestamp:</Text>
      <Text>{details.timestamp}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontWeight: 'bold', marginTop: 20 },
});

export default PredictionDetailsScreen;
