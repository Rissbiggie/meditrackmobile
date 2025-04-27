import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, ProgressBar, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const theme = useTheme();

  // Mock data - replace with real data later
  const stats = {
    medications: 5,
    nextDose: '2 hours',
    adherence: 85,
    emergencies: 2,
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statNumber}>{stats.medications}</Text>
            <Text style={styles.statLabel}>Active Medications</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statNumber}>{stats.nextDose}</Text>
            <Text style={styles.statLabel}>Next Dose</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Adherence Progress */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Medication Adherence</Text>
          <View style={styles.progressContainer}>
            <ProgressBar
              progress={stats.adherence / 100}
              color={theme.colors.primary}
              style={styles.progressBar}
            />
            <Text style={styles.progressText}>{stats.adherence}%</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Map')}
              style={styles.actionButton}
            >
              Emergency Map
            </Button>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('FindServices')}
              style={styles.actionButton}
            >
              Find Services
            </Button>
            <Button
              mode="contained"
              onPress={() => {}}
              style={styles.actionButton}
            >
              Add Medication
            </Button>
            <Button
              mode="contained"
              onPress={() => {}}
              style={styles.actionButton}
            >
              View Schedule
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Recent Activity */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Recent Activity</Text>
          <View style={styles.activityContainer}>
            <Text style={styles.activityText}>• Took morning medication (8:00 AM)</Text>
            <Text style={styles.activityText}>• Added new medication (Yesterday)</Text>
            <Text style={styles.activityText}>• Updated schedule (2 days ago)</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Emergency Contacts */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Emergency Contacts</Text>
          <View style={styles.contactsContainer}>
            <Button
              mode="outlined"
              onPress={() => {}}
              style={styles.contactButton}
            >
              Call Emergency
            </Button>
            <Button
              mode="outlined"
              onPress={() => {}}
              style={styles.contactButton}
            >
              Contact Doctor
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statLabel: {
    textAlign: 'center',
    color: '#666',
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    margin: 4,
    minWidth: '30%',
  },
  activityContainer: {
    marginTop: 8,
  },
  activityText: {
    marginBottom: 8,
    color: '#666',
  },
  contactsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactButton: {
    flex: 1,
    marginHorizontal: 4,
  },
}); 