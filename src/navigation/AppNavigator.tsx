import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MapScreen from '../screens/MapScreen';
import AdminScreen from '../screens/AdminScreen';
import ResponseTeamScreen from '../screens/ResponseTeamScreen';
import SettingsScreen from '../screens/SettingsScreen';
import DashboardScreen from '../screens/DashboardScreen';
import FindServicesScreen from '../screens/FindServicesScreen';
import MedicationScreen from '../screens/MedicationScreen';
import EmergencyScreen from '../screens/EmergencyScreen';
import AlertScreen from '../screens/AlertScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Medication"
        component={MedicationScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="pill" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Emergency"
        component={EmergencyScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="alert" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Alerts"
        component={AlertScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="MainTabs" 
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Dashboard" 
            component={DashboardScreen}
            options={{ headerShown: true, title: 'Dashboard' }}
          />
          <Stack.Screen 
            name="Map" 
            component={MapScreen}
            options={{ headerShown: true, title: 'Map' }}
          />
          <Stack.Screen 
            name="Admin" 
            component={AdminScreen}
            options={{ headerShown: true, title: 'Admin Dashboard' }}
          />
          <Stack.Screen 
            name="ResponseTeam" 
            component={ResponseTeamScreen}
            options={{ headerShown: true, title: 'Response Teams' }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{ headerShown: true, title: 'Settings' }}
          />
          <Stack.Screen 
            name="FindServices" 
            component={FindServicesScreen}
            options={{ headerShown: true, title: 'Find Services' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
};

export default AppNavigator; 