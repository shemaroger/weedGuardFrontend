import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header: React.FC = () => (
  <View style={styles.header}>
    <Text style={styles.headerText}>Prediction App</Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#6200ea',
    padding: 15,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default Header;
