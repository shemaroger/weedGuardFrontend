import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerParamList } from '../types';
import { Menu, LogOut } from 'lucide-react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HeaderNavigationProp = DrawerNavigationProp<DrawerParamList>;

interface HeaderProps {
  title?: string;
  backgroundColor?: string;
  textColor?: string;
}

const Header: React.FC<HeaderProps> = ({
  title = 'WEED GUARD',
  backgroundColor = '#0EA340FF',
  textColor = 'black'
}) => {
  const navigation = useNavigation<HeaderNavigationProp>();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('@user_token');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Logout Error', 'An error occurred while logging out. Please try again.');
    }
  };

  return (
    <>
      <StatusBar 
        backgroundColor={backgroundColor} 
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} 
      />
      <View style={[styles.header, { backgroundColor }]}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.toggleDrawer()}
        >
          <Menu color={textColor} size={24} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut color={textColor} size={24} />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    height: Platform.OS === 'ios' ? 88 : 56,
    paddingTop: Platform.OS === 'ios' ? 40 : 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  menuButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    textAlign: 'center',
  },
  logoutButton: {
    padding: 8,
  },
});

export default Header;
