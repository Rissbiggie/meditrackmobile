import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, List, Switch, Button, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationServices, setLocationServices] = useState(true);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <List.Section>
        <List.Subheader>App Preferences</List.Subheader>
        <List.Item
          title="Notifications"
          description="Enable or disable app notifications"
          right={() => (
            <Switch
              value={notifications}
              onValueChange={setNotifications}
            />
          )}
        />
        <Divider />
        <List.Item
          title="Dark Mode"
          description="Switch between light and dark theme"
          right={() => (
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
            />
          )}
        />
        <Divider />
        <List.Item
          title="Location Services"
          description="Allow app to access your location"
          right={() => (
            <Switch
              value={locationServices}
              onValueChange={setLocationServices}
            />
          )}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>Account</List.Subheader>
        <List.Item
          title="Profile"
          description="View and edit your profile"
          onPress={() => {}}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
        <Divider />
        <List.Item
          title="Security"
          description="Manage your security settings"
          onPress={() => {}}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>About</List.Subheader>
        <List.Item
          title="Help & Support"
          description="Get help with the app"
          onPress={() => {}}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
        <Divider />
        <List.Item
          title="Privacy Policy"
          description="View our privacy policy"
          onPress={() => {}}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
        <Divider />
        <List.Item
          title="Terms of Service"
          description="View our terms of service"
          onPress={() => {}}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
      </List.Section>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => {}}
          style={styles.logoutButton}
        >
          Log Out
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    padding: 16,
    marginTop: 16,
  },
  logoutButton: {
    backgroundColor: '#ff4444',
  },
}); 