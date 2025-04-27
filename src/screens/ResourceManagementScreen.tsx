import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, Card, TextInput, List, Divider, Chip, Menu } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Resource {
  id: string;
  type: 'ambulance' | 'medical_team' | 'equipment' | 'medication';
  name: string;
  status: 'available' | 'assigned' | 'in_use' | 'maintenance';
  currentLocation: string;
  assignedTo?: string;
  lastMaintenance?: string;
}

interface Alert {
  id: string;
  title: string;
  priority: string;
  status: string;
  location: string;
}

const ResourceManagementScreen = () => {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showResourceMenu, setShowResourceMenu] = useState(false);
  const [showAlertMenu, setShowAlertMenu] = useState(false);

  const queryClient = useQueryClient();

  const { data: resources = [], isLoading: isLoadingResources } = useQuery<Resource[]>({
    queryKey: ['resources'],
    queryFn: async () => {
      // In a real app, this would fetch from an API
      return [
        {
          id: '1',
          type: 'ambulance',
          name: 'Ambulance #123',
          status: 'available',
          currentLocation: 'Main Hospital',
        },
        {
          id: '2',
          type: 'medical_team',
          name: 'Emergency Team A',
          status: 'available',
          currentLocation: 'Main Hospital',
        },
      ];
    },
  });

  const { data: alerts = [], isLoading: isLoadingAlerts } = useQuery<Alert[]>({
    queryKey: ['alerts'],
    queryFn: async () => {
      // In a real app, this would fetch from an API
      return [
        {
          id: '1',
          title: 'Medical Emergency',
          priority: 'high',
          status: 'pending',
          location: '123 Main St',
        },
      ];
    },
  });

  const assignResourceMutation = useMutation({
    mutationFn: async ({ resourceId, alertId }: { resourceId: string; alertId: string }) => {
      // In a real app, this would update the API
      return { resourceId, alertId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources', 'alerts'] });
    },
  });

  const updateResourceStatusMutation = useMutation({
    mutationFn: async ({ resourceId, status }: { resourceId: string; status: Resource['status'] }) => {
      // In a real app, this would update the API
      return { resourceId, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });

  const handleAssignResource = () => {
    if (selectedResource && selectedAlert) {
      assignResourceMutation.mutate({
        resourceId: selectedResource.id,
        alertId: selectedAlert.id,
      });
      setSelectedResource(null);
      setSelectedAlert(null);
    }
  };

  const handleUpdateStatus = (resourceId: string, status: Resource['status']) => {
    updateResourceStatusMutation.mutate({ resourceId, status });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return '#4CAF50';
      case 'assigned':
        return '#FFC107';
      case 'in_use':
        return '#F44336';
      case 'maintenance':
        return '#9E9E9E';
      default:
        return '#666666';
    }
  };

  if (isLoadingResources || isLoadingAlerts) {
    return (
      <View style={styles.container}>
        <Text>Loading resources...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Resource Assignment" />
        <Card.Content>
          <View style={styles.selectionContainer}>
            <Menu
              visible={showResourceMenu}
              onDismiss={() => setShowResourceMenu(false)}
              anchor={
                <Button
                  onPress={() => setShowResourceMenu(true)}
                  style={styles.menuButton}
                >
                  {selectedResource ? selectedResource.name : 'Select Resource'}
                </Button>
              }
            >
              {resources.map((resource) => (
                <Menu.Item
                  key={resource.id}
                  onPress={() => {
                    setSelectedResource(resource);
                    setShowResourceMenu(false);
                  }}
                  title={resource.name}
                />
              ))}
            </Menu>

            <Menu
              visible={showAlertMenu}
              onDismiss={() => setShowAlertMenu(false)}
              anchor={
                <Button
                  onPress={() => setShowAlertMenu(true)}
                  style={styles.menuButton}
                >
                  {selectedAlert ? selectedAlert.title : 'Select Alert'}
                </Button>
              }
            >
              {alerts.map((alert) => (
                <Menu.Item
                  key={alert.id}
                  onPress={() => {
                    setSelectedAlert(alert);
                    setShowAlertMenu(false);
                  }}
                  title={alert.title}
                />
              ))}
            </Menu>

            <Button
              mode="contained"
              onPress={handleAssignResource}
              disabled={!selectedResource || !selectedAlert}
              style={styles.assignButton}
            >
              Assign Resource
            </Button>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Available Resources" />
        <Card.Content>
          {resources.map((resource) => (
            <View key={resource.id} style={styles.resourceItem}>
              <View style={styles.resourceHeader}>
                <Text style={styles.resourceName}>{resource.name}</Text>
                <Chip
                  style={[styles.statusChip, { backgroundColor: getStatusColor(resource.status) }]}
                  textStyle={styles.statusText}
                >
                  {resource.status.toUpperCase()}
                </Chip>
              </View>
              <Text style={styles.resourceInfo}>Type: {resource.type.replace('_', ' ').toUpperCase()}</Text>
              <Text style={styles.resourceInfo}>Location: {resource.currentLocation}</Text>
              {resource.assignedTo && (
                <Text style={styles.resourceInfo}>Assigned to: {resource.assignedTo}</Text>
              )}
              {resource.lastMaintenance && (
                <Text style={styles.resourceInfo}>
                  Last Maintenance: {new Date(resource.lastMaintenance).toLocaleString()}
                </Text>
              )}
              <View style={styles.actionButtons}>
                <Button
                  mode="outlined"
                  onPress={() => handleUpdateStatus(resource.id, 'available')}
                  style={styles.actionButton}
                >
                  Mark Available
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => handleUpdateStatus(resource.id, 'maintenance')}
                  style={styles.actionButton}
                >
                  Send for Maintenance
                </Button>
              </View>
              <Divider style={styles.divider} />
            </View>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  selectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  menuButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  assignButton: {
    marginTop: 8,
  },
  resourceItem: {
    marginBottom: 16,
  },
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resourceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  resourceInfo: {
    marginBottom: 4,
    color: '#666',
  },
  statusChip: {
    marginLeft: 8,
  },
  statusText: {
    color: 'white',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  divider: {
    marginVertical: 8,
  },
});

export default ResourceManagementScreen; 