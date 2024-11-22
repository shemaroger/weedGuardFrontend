import React from 'react';
import { Button } from 'react-native-paper';

interface ButtonProps {
  onPress: () => void;
  title: string;
}

const CustomButton: React.FC<ButtonProps> = ({ onPress, title }) => (
  <Button mode="contained" onPress={onPress}>
    {title}
  </Button>
);

export default CustomButton;
