import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomButton from '../components/Button';
import axios from 'axios';

interface PredictionResponse {
  result: string; // Replace with the correct structure if different
}

const PredictionScreen: React.FC = () => {
  const [prediction, setPrediction] = useState<string | null>(null);

  const handlePrediction = async () => {
    const formData = new FormData();
    // Add the image to the formData object here.

    try {
      const response = await axios.post<PredictionResponse>('https://yourapi.com/predict', formData);
      setPrediction(response.data.result);
    } catch (error) {
      console.error('Prediction failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Make Prediction</Text>
      {/* Add image upload functionality here */}
      <CustomButton title="Submit Image" onPress={handlePrediction} />
      {prediction && <Text>Prediction Result: {prediction}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default PredictionScreen;
