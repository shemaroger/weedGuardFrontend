import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  text: {
    color: Colors.text,
  },
});

export default globalStyles;
