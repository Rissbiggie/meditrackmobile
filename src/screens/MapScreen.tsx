import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useQuery } from '@tanstack/react-query';
import { Card, Text, Chip } from 'react-native-paper';

interface AlertLocation {
  id: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  title: string;
  description: string;
  status: string;
  priority: string;
}

const MapScreen = () => {
  const [region, setRegion] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const { data: alerts = [], isLoading } = useQuery<AlertLocation[]>({
    queryKey: ['alerts'],
    queryFn: async () => {
      // In a real app, this would fetch from an API
      return [
        {
          id: '1',
          coordinates: {
            latitude: 37.7749,
            longitude: -122.4194,
          },
          title: 'Medical Emergency',
          description: 'Chest pain',
          status: 'pending',
          priority: 'high',
        },
      ];
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FFA500';
      case 'confirmed':
        return '#0000FF';
      case 'resolved':
        return '#008000';
      default:
        return '#666666';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return '#4CAF50';
      case 'medium':
        return '#FFC107';
      case 'high':
        return '#FF9800';
      case 'critical':
        return '#F44336';
      default:
        return '#666666';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {alerts.map((alert) => (
          <Marker
            key={alert.id}
            coordinate={alert.coordinates}
            title={alert.title}
            description={alert.description}
          >
            <View style={styles.markerContainer}>
              <View style={styles.markerContent}>
                <Chip
                  style={[styles.statusChip, { backgroundColor: getStatusColor(alert.status) }]}
                  textStyle={styles.chipText}
                >
                  {alert.status.toUpperCase()}
                </Chip>
                <Chip
                  style={[styles.priorityChip, { backgroundColor: getPriorityColor(alert.priority) }]}
                  textStyle={styles.chipText}
                >
                  {alert.priority.toUpperCase()}
                </Chip>
              </View>
            </View>
          </Marker>
        ))}
      </MapView>
      <Card style={styles.legend}>
        <Card.Content>
          <Text style={styles.legendTitle}>Status Legend</Text>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#FFA500' }]} />
            <Text>Pending</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#0000FF' }]} />
            <Text>Confirmed</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#008000' }]} />
            <Text>Resolved</Text>
          </View>
          <Text style={styles.legendTitle}>Priority Legend</Text>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
            <Text>Low</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#FFC107' }]} />
            <Text>Medium</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#FF9800' }]} />
            <Text>High</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
            <Text>Critical</Text>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerContent: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusChip: {
    marginRight: 4,
  },
  priorityChip: {
    marginLeft: 4,
  },
  chipText: {
    color: 'white',
    fontSize: 10,
  },
  legend: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
  },
  legendTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
});

export default MapScreen; 