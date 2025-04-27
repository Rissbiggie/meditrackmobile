import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Searchbar, Card, Button, List, Chip, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type FindServicesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'FindServices'>;

export default function FindServicesScreen() {
  const navigation = useNavigation<FindServicesScreenNavigationProp>();
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'hospitals', label: 'Hospitals' },
    { id: 'pharmacies', label: 'Pharmacies' },
    { id: 'clinics', label: 'Clinics' },
    { id: 'doctors', label: 'Doctors' },
    { id: 'emergency', label: 'Emergency' },
  ];

  // Mock data - replace with real data later
  const services = [
    {
      id: '1',
      name: 'City General Hospital',
      type: 'hospitals',
      distance: '2.5 km',
      rating: 4.5,
      open: true,
    },
    {
      id: '2',
      name: '24/7 Pharmacy',
      type: 'pharmacies',
      distance: '1.2 km',
      rating: 4.2,
      open: true,
    },
    {
      id: '3',
      name: 'Family Health Clinic',
      type: 'clinics',
      distance: '3.1 km',
      rating: 4.7,
      open: false,
    },
  ];

  const filteredServices = services.filter(service => 
    (selectedCategory === 'all' || service.type === selectedCategory) &&
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search for services..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map(category => (
          <Chip
            key={category.id}
            selected={selectedCategory === category.id}
            onPress={() => setSelectedCategory(category.id)}
            style={styles.categoryChip}
          >
            {category.label}
          </Chip>
        ))}
      </ScrollView>

      <ScrollView style={styles.servicesContainer}>
        {filteredServices.map(service => (
          <Card key={service.id} style={styles.serviceCard}>
            <Card.Content>
              <View style={styles.serviceHeader}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Chip
                  icon={service.open ? "check-circle" : "close-circle"}
                  style={[
                    styles.statusChip,
                    { backgroundColor: service.open ? theme.colors.primary : theme.colors.error }
                  ]}
                >
                  {service.open ? 'Open' : 'Closed'}
                </Chip>
              </View>
              <View style={styles.serviceDetails}>
                <Text style={styles.detailText}>Distance: {service.distance}</Text>
                <Text style={styles.detailText}>Rating: {service.rating} ★</Text>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button 
                mode="contained" 
                onPress={() => navigation.navigate('Map', { serviceId: service.id })}
              >
                View on Map
              </Button>
              <Button 
                mode="outlined" 
                onPress={() => {/* Add call functionality */}}
              >
                Call
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    margin: 16,
    elevation: 2,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryChip: {
    marginRight: 8,
  },
  servicesContainer: {
    flex: 1,
    padding: 16,
  },
  serviceCard: {
    marginBottom: 16,
    elevation: 2,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  statusChip: {
    marginLeft: 8,
  },
  serviceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  detailText: {
    color: '#666',
  },
}); 