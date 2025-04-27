import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Button, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={styles.title}>Welcome to Meditrack</Text>
      <Text style={styles.subtitle}>Your personal medication tracker</Text>
      
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Dashboard')}
          style={styles.button}
        >
          Go to Dashboard
        </Button>
        
        <Button
          mode="outlined"
          onPress={() => {}}
          style={styles.button}
        >
          View Schedule
        </Button>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('Map')}
          style={styles.button}
        >
          View Map
        </Button>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('Admin')}
          style={[styles.button, styles.adminButton]}
        >
          Admin Dashboard
        </Button>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={[styles.buttonText, { color: theme.colors.text }]}>Go to Dashboard</Text>
        </TouchableOpacity>
      </View>

      <FAB
        style={styles.settingsButton}
        icon="cog"
        onPress={() => navigation.navigate('Settings')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    width: '80%',
    marginTop: 20,
  },
  button: {
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  adminButton: {
    backgroundColor: '#ff4444',
  },
  settingsButton: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 