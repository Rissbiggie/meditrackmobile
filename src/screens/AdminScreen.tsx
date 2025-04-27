import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, Card, TextInput, List, Divider, Chip, Menu } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'response_team' | 'victim';
  status: 'active' | 'inactive';
  lastLogin?: string;
}

interface SystemStats {
  totalAlerts: number;
  activeAlerts: number;
  totalUsers: number;
  activeUsers: number;
  totalResources: number;
  availableResources: number;
}

const AdminScreen = () => {
  const [newUser, setNewUser] = useState<{
    name: string;
    email: string;
    role: User['role'];
  }>({
    name: '',
    email: '',
    role: 'victim',
  });
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const queryClient = useQueryClient();

  const { data: users = [], isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      // In a real app, this would fetch from an API
      return [
        {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          status: 'active',
          lastLogin: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Response Team',
          email: 'team@example.com',
          role: 'response_team',
          status: 'active',
          lastLogin: new Date().toISOString(),
        },
      ];
    },
  });

  const { data: stats = {} as SystemStats, isLoading: isLoadingStats } = useQuery<SystemStats>({
    queryKey: ['stats'],
    queryFn: async () => {
      // In a real app, this would fetch from an API
      return {
        totalAlerts: 10,
        activeAlerts: 3,
        totalUsers: 50,
        activeUsers: 45,
        totalResources: 20,
        availableResources: 15,
      };
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (user: Omit<User, 'id' | 'status' | 'lastLogin'>) => {
      // In a real app, this would post to an API
      return {
        id: Date.now().toString(),
        status: 'active',
        lastLogin: new Date().toISOString(),
        ...user,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setNewUser({ name: '', email: '', role: 'victim' });
    },
  });

  const updateUserStatusMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: User['status'] }) => {
      // In a real app, this would update the API
      return { userId, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleCreateUser = () => {
    if (newUser.name && newUser.email) {
      createUserMutation.mutate(newUser);
    }
  };

  const handleUpdateStatus = (userId: string, status: User['status']) => {
    updateUserStatusMutation.mutate({ userId, status });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return '#F44336';
      case 'response_team':
        return '#2196F3';
      case 'victim':
        return '#4CAF50';
      default:
        return '#666666';
    }
  };

  if (isLoadingUsers || isLoadingStats) {
    return (
      <View style={styles.container}>
        <Text>Loading admin data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="System Statistics" />
        <Card.Content>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalAlerts}</Text>
              <Text style={styles.statLabel}>Total Alerts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.activeAlerts}</Text>
              <Text style={styles.statLabel}>Active Alerts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalUsers}</Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.activeUsers}</Text>
              <Text style={styles.statLabel}>Active Users</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalResources}</Text>
              <Text style={styles.statLabel}>Total Resources</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.availableResources}</Text>
              <Text style={styles.statLabel}>Available Resources</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Create New User" />
        <Card.Content>
          <TextInput
            label="Name"
            value={newUser.name}
            onChangeText={(text) => setNewUser({ ...newUser, name: text })}
            style={styles.input}
          />
          <TextInput
            label="Email"
            value={newUser.email}
            onChangeText={(text) => setNewUser({ ...newUser, email: text })}
            style={styles.input}
          />
          <Menu
            visible={showRoleMenu}
            onDismiss={() => setShowRoleMenu(false)}
            anchor={
              <Button
                onPress={() => setShowRoleMenu(true)}
                style={styles.roleButton}
              >
                Role: {newUser.role.toUpperCase()}
              </Button>
            }
          >
            <Menu.Item
              onPress={() => {
                setNewUser({ ...newUser, role: 'admin' });
                setShowRoleMenu(false);
              }}
              title="Admin"
            />
            <Menu.Item
              onPress={() => {
                setNewUser({ ...newUser, role: 'response_team' });
                setShowRoleMenu(false);
              }}
              title="Response Team"
            />
            <Menu.Item
              onPress={() => {
                setNewUser({ ...newUser, role: 'victim' });
                setShowRoleMenu(false);
              }}
              title="Victim"
            />
          </Menu>
          <Button
            mode="contained"
            onPress={handleCreateUser}
            disabled={!newUser.name || !newUser.email}
            style={styles.createButton}
          >
            Create User
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="User Management" />
        <Card.Content>
          {users.map((user) => (
            <View key={user.id} style={styles.userItem}>
              <View style={styles.userHeader}>
                <Text style={styles.userName}>{user.name}</Text>
                <Chip
                  style={[styles.roleChip, { backgroundColor: getRoleColor(user.role) }]}
                  textStyle={styles.roleText}
                >
                  {user.role.toUpperCase()}
                </Chip>
              </View>
              <Text style={styles.userInfo}>Email: {user.email}</Text>
              <Text style={styles.userInfo}>Status: {user.status.toUpperCase()}</Text>
              {user.lastLogin && (
                <Text style={styles.userInfo}>
                  Last Login: {new Date(user.lastLogin).toLocaleString()}
                </Text>
              )}
              <View style={styles.actionButtons}>
                <Button
                  mode="outlined"
                  onPress={() => handleUpdateStatus(user.id, 'active')}
                  style={styles.actionButton}
                >
                  Activate
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => handleUpdateStatus(user.id, 'inactive')}
                  style={styles.actionButton}
                >
                  Deactivate
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
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  input: {
    marginBottom: 8,
  },
  roleButton: {
    marginVertical: 8,
  },
  createButton: {
    marginTop: 8,
  },
  userItem: {
    marginBottom: 16,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userInfo: {
    marginBottom: 4,
    color: '#666',
  },
  roleChip: {
    marginLeft: 8,
  },
  roleText: {
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

export default AdminScreen; 