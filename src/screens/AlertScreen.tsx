import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, PermissionsAndroid, Platform } from 'react-native';
import { Text, Button, Card, TextInput, List, Divider, Chip, Menu } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Geolocation from '@react-native-community/geolocation';
import io from 'socket.io-client';
import NotificationService from '../services/NotificationService';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

interface EmergencyAlert {
  id: string;
  victimId: string;
  victimName: string;
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  timestamp: string;
  status: 'pending' | 'confirmed' | 'resolved';
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  responseTeamId?: string;
  responseTeamName?: string;
  responseTime?: string;
  emergencyContacts?: EmergencyContact[];
}

const AlertScreen = () => {
  const [newAlert, setNewAlert] = useState({
    location: '',
    description: '',
    priority: 'medium' as const,
  });
  const [socket, setSocket] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'timestamp' | 'priority'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const queryClient = useQueryClient();

  // Simulated user roles - in a real app, this would come from authentication
  const isResponseTeam = false;
  const userId = 'user123';
  const userName = 'John Doe';

  // Initialize WebSocket connection
  useEffect(() => {
    const newSocket = io('http://your-server-url'); // Replace with your server URL
    setSocket(newSocket);

    newSocket.on('alertUpdate', (updatedAlert: EmergencyAlert) => {
      queryClient.setQueryData(['alerts'], (oldData: EmergencyAlert[] | undefined) => {
        if (!oldData) return [updatedAlert];
        return oldData.map(alert => 
          alert.id === updatedAlert.id ? updatedAlert : alert
        );
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Request location permission and get current location
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'MediTrack needs access to your location for emergency alerts.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getCurrentLocation();
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        getCurrentLocation();
      }
    };

    requestLocationPermission();
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.log(error);
        Alert.alert('Error', 'Could not get your location');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  const { data: alerts = [], isLoading } = useQuery<EmergencyAlert[]>({
    queryKey: ['alerts'],
    queryFn: async () => {
      // In a real app, this would fetch from an API
      return [
        {
          id: '1',
          victimId: 'user123',
          victimName: 'John Doe',
          location: '123 Main St',
          coordinates: {
            latitude: 37.7749,
            longitude: -122.4194,
          },
          timestamp: new Date().toISOString(),
          status: 'pending',
          description: 'Medical emergency - chest pain',
          priority: 'high',
          emergencyContacts: [
            {
              id: '1',
              name: 'Jane Doe',
              phone: '+1234567890',
              relationship: 'Spouse',
            },
          ],
        },
      ];
    },
  });

  const sendAlertMutation = useMutation({
    mutationFn: async (alert: Omit<EmergencyAlert, 'id' | 'victimId' | 'victimName' | 'timestamp' | 'status' | 'coordinates'>) => {
      // In a real app, this would post to an API
      return {
        id: Date.now().toString(),
        victimId: userId,
        victimName: userName,
        timestamp: new Date().toISOString(),
        status: 'pending',
        coordinates: currentLocation || { latitude: 0, longitude: 0 },
        ...alert,
      };
    },
    onSuccess: (newAlert) => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      setNewAlert({ location: '', description: '', priority: 'medium' });
      socket?.emit('newAlert', newAlert);
      Alert.alert('Success', 'Emergency alert sent successfully!');
    },
  });

  const confirmAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      // In a real app, this would update the API
      return alertId;
    },
    onSuccess: (alertId) => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      socket?.emit('alertUpdate', { id: alertId, status: 'confirmed' });
      Alert.alert('Success', 'Alert confirmed and response team dispatched!');
    },
  });

  const resolveAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      // In a real app, this would update the API
      return alertId;
    },
    onSuccess: (alertId) => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      socket?.emit('alertUpdate', { id: alertId, status: 'resolved' });
      Alert.alert('Success', 'Alert marked as resolved!');
    },
  });

  const handleSendAlert = () => {
    if (newAlert.location && newAlert.description) {
      sendAlertMutation.mutate(newAlert);
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  const handleConfirmAlert = (alertId: string) => {
    confirmAlertMutation.mutate(alertId);
  };

  const handleResolveAlert = (alertId: string) => {
    resolveAlertMutation.mutate(alertId);
  };

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

  const filteredAndSortedAlerts = React.useMemo(() => {
    let filtered = alerts;

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(alert => alert.status === filterStatus);
    }

    // Apply priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(alert => alert.priority === filterPriority);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'timestamp') {
        return sortOrder === 'asc'
          ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } else {
        const priorityOrder = { low: 0, medium: 1, high: 2, critical: 3 };
        return sortOrder === 'asc'
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      }
    });

    return filtered;
  }, [alerts, filterStatus, filterPriority, sortBy, sortOrder]);

  // Handle alert updates with notifications
  useEffect(() => {
    const handleAlertUpdate = (updatedAlert: EmergencyAlert) => {
      if (updatedAlert.status === 'confirmed') {
        NotificationService.showLocalNotification(
          'Alert Confirmed',
          'A response team is on the way to your location.'
        );
      } else if (updatedAlert.status === 'resolved') {
        NotificationService.showLocalNotification(
          'Alert Resolved',
          'The emergency has been resolved.'
        );
      }
    };

    socket?.on('alertUpdate', handleAlertUpdate);
    return () => {
      socket?.off('alertUpdate', handleAlertUpdate);
    };
  }, [socket]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading alerts...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {!isResponseTeam && (
        <Card style={styles.card}>
          <Card.Title title="Send Emergency Alert" />
          <Card.Content>
            <TextInput
              label="Location"
              value={newAlert.location}
              onChangeText={(text) => setNewAlert({ ...newAlert, location: text })}
              style={styles.input}
            />
            <TextInput
              label="Description"
              value={newAlert.description}
              onChangeText={(text) => setNewAlert({ ...newAlert, description: text })}
              style={styles.input}
              multiline
              numberOfLines={3}
            />
            <Menu
              visible={showPriorityMenu}
              onDismiss={() => setShowPriorityMenu(false)}
              anchor={
                <Button
                  onPress={() => setShowPriorityMenu(true)}
                  style={styles.priorityButton}
                >
                  Priority: {newAlert.priority.toUpperCase()}
                </Button>
              }
            >
              <Menu.Item
                onPress={() => {
                  setNewAlert({ ...newAlert, priority: 'low' });
                  setShowPriorityMenu(false);
                }}
                title="Low"
              />
              <Menu.Item
                onPress={() => {
                  setNewAlert({ ...newAlert, priority: 'medium' });
                  setShowPriorityMenu(false);
                }}
                title="Medium"
              />
              <Menu.Item
                onPress={() => {
                  setNewAlert({ ...newAlert, priority: 'high' });
                  setShowPriorityMenu(false);
                }}
                title="High"
              />
              <Menu.Item
                onPress={() => {
                  setNewAlert({ ...newAlert, priority: 'critical' });
                  setShowPriorityMenu(false);
                }}
                title="Critical"
              />
            </Menu>
            <Button mode="contained" onPress={handleSendAlert} style={styles.button}>
              Send Alert
            </Button>
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Title title={isResponseTeam ? "Emergency Alerts" : "My Alerts"} />
        <Card.Content>
          <View style={styles.filterContainer}>
            <Text style={styles.filterTitle}>Filters</Text>
            <View style={styles.filterRow}>
              <Chip
                selected={filterStatus === 'all'}
                onPress={() => setFilterStatus('all')}
                style={styles.filterChip}
              >
                All Status
              </Chip>
              <Chip
                selected={filterStatus === 'pending'}
                onPress={() => setFilterStatus('pending')}
                style={styles.filterChip}
              >
                Pending
              </Chip>
              <Chip
                selected={filterStatus === 'confirmed'}
                onPress={() => setFilterStatus('confirmed')}
                style={styles.filterChip}
              >
                Confirmed
              </Chip>
              <Chip
                selected={filterStatus === 'resolved'}
                onPress={() => setFilterStatus('resolved')}
                style={styles.filterChip}
              >
                Resolved
              </Chip>
            </View>
            <View style={styles.filterRow}>
              <Chip
                selected={filterPriority === 'all'}
                onPress={() => setFilterPriority('all')}
                style={styles.filterChip}
              >
                All Priority
              </Chip>
              <Chip
                selected={filterPriority === 'low'}
                onPress={() => setFilterPriority('low')}
                style={styles.filterChip}
              >
                Low
              </Chip>
              <Chip
                selected={filterPriority === 'medium'}
                onPress={() => setFilterPriority('medium')}
                style={styles.filterChip}
              >
                Medium
              </Chip>
              <Chip
                selected={filterPriority === 'high'}
                onPress={() => setFilterPriority('high')}
                style={styles.filterChip}
              >
                High
              </Chip>
              <Chip
                selected={filterPriority === 'critical'}
                onPress={() => setFilterPriority('critical')}
                style={styles.filterChip}
              >
                Critical
              </Chip>
            </View>
            <View style={styles.sortContainer}>
              <Text style={styles.sortTitle}>Sort By:</Text>
              <Chip
                selected={sortBy === 'timestamp'}
                onPress={() => setSortBy('timestamp')}
                style={styles.sortChip}
              >
                Time
              </Chip>
              <Chip
                selected={sortBy === 'priority'}
                onPress={() => setSortBy('priority')}
                style={styles.sortChip}
              >
                Priority
              </Chip>
              <Chip
                selected={sortOrder === 'asc'}
                onPress={() => setSortOrder('asc')}
                style={styles.sortChip}
              >
                Asc
              </Chip>
              <Chip
                selected={sortOrder === 'desc'}
                onPress={() => setSortOrder('desc')}
                style={styles.sortChip}
              >
                Desc
              </Chip>
            </View>
          </View>

          {filteredAndSortedAlerts.map((alert) => (
            <View key={alert.id} style={styles.alertItem}>
              <View style={styles.alertHeader}>
                <Text style={styles.alertTitle}>Emergency Alert</Text>
                <View style={styles.chipContainer}>
                  <Chip
                    style={[styles.statusChip, { backgroundColor: getStatusColor(alert.status) }]}
                    textStyle={styles.statusText}
                  >
                    {alert.status.toUpperCase()}
                  </Chip>
                  <Chip
                    style={[styles.priorityChip, { backgroundColor: getPriorityColor(alert.priority) }]}
                    textStyle={styles.priorityText}
                  >
                    {alert.priority.toUpperCase()}
                  </Chip>
                </View>
              </View>
              <Text style={styles.alertText}>Location: {alert.location}</Text>
              <Text style={styles.alertText}>Description: {alert.description}</Text>
              <Text style={styles.alertText}>
                Time: {new Date(alert.timestamp).toLocaleString()}
              </Text>
              {alert.emergencyContacts && alert.emergencyContacts.length > 0 && (
                <View style={styles.contactsContainer}>
                  <Text style={styles.contactsTitle}>Emergency Contacts:</Text>
                  {alert.emergencyContacts.map((contact) => (
                    <View key={contact.id} style={styles.contactItem}>
                      <Text style={styles.contactText}>{contact.name}</Text>
                      <Text style={styles.contactText}>{contact.phone}</Text>
                      <Text style={styles.contactText}>{contact.relationship}</Text>
                    </View>
                  ))}
                </View>
              )}
              {alert.responseTeamName && (
                <Text style={styles.alertText}>
                  Response Team: {alert.responseTeamName}
                </Text>
              )}
              {alert.responseTime && (
                <Text style={styles.alertText}>
                  Response Time: {new Date(alert.responseTime).toLocaleString()}
                </Text>
              )}
              
              {isResponseTeam && alert.status === 'pending' && (
                <Button
                  mode="contained"
                  onPress={() => handleConfirmAlert(alert.id)}
                  style={styles.actionButton}
                >
                  Confirm Alert
                </Button>
              )}
              
              {isResponseTeam && alert.status === 'confirmed' && (
                <Button
                  mode="contained"
                  onPress={() => handleResolveAlert(alert.id)}
                  style={styles.actionButton}
                >
                  Mark as Resolved
                </Button>
              )}
              
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
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
  },
  priorityButton: {
    marginVertical: 8,
  },
  alertItem: {
    marginBottom: 16,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  alertText: {
    marginBottom: 4,
  },
  chipContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusChip: {
    marginLeft: 8,
  },
  priorityChip: {
    marginLeft: 8,
  },
  statusText: {
    color: 'white',
  },
  priorityText: {
    color: 'white',
  },
  actionButton: {
    marginTop: 8,
  },
  divider: {
    marginVertical: 8,
  },
  contactsContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  contactsTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contactItem: {
    marginLeft: 16,
    marginBottom: 4,
  },
  contactText: {
    fontSize: 12,
    color: '#666',
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  sortTitle: {
    marginRight: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sortChip: {
    marginRight: 8,
    marginBottom: 8,
  },
});

export default AlertScreen; 