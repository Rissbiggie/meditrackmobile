import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Button, Card, TextInput, List, Divider } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  lastTaken: string;
  nextDose: string;
}

const MedicationScreen = () => {
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
  });

  const queryClient = useQueryClient();

  const { data: medications = [], isLoading } = useQuery<Medication[]>({
    queryKey: ['medications'],
    queryFn: async () => {
      // In a real app, this would fetch from an API
      return [
        {
          id: '1',
          name: 'Aspirin',
          dosage: '100mg',
          frequency: 'Once daily',
          lastTaken: '2024-03-20 08:00',
          nextDose: '2024-03-21 08:00',
        },
      ];
    },
  });

  const addMedicationMutation = useMutation({
    mutationFn: async (medication: Omit<Medication, 'id' | 'lastTaken' | 'nextDose'>) => {
      // In a real app, this would post to an API
      return {
        id: Date.now().toString(),
        ...medication,
        lastTaken: new Date().toISOString(),
        nextDose: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      setNewMedication({ name: '', dosage: '', frequency: '' });
    },
  });

  const markAsTakenMutation = useMutation({
    mutationFn: async (medicationId: string) => {
      // In a real app, this would update the API
      return medicationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
    },
  });

  const handleAddMedication = () => {
    if (newMedication.name && newMedication.dosage && newMedication.frequency) {
      addMedicationMutation.mutate(newMedication);
    }
  };

  const handleMarkAsTaken = (medicationId: string) => {
    markAsTakenMutation.mutate(medicationId);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading medications...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Add New Medication" />
        <Card.Content>
          <TextInput
            label="Medication Name"
            value={newMedication.name}
            onChangeText={(text) => setNewMedication({ ...newMedication, name: text })}
            style={styles.input}
          />
          <TextInput
            label="Dosage"
            value={newMedication.dosage}
            onChangeText={(text) => setNewMedication({ ...newMedication, dosage: text })}
            style={styles.input}
          />
          <TextInput
            label="Frequency"
            value={newMedication.frequency}
            onChangeText={(text) => setNewMedication({ ...newMedication, frequency: text })}
            style={styles.input}
          />
          <Button mode="contained" onPress={handleAddMedication} style={styles.button}>
            Add Medication
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title title="Current Medications" />
        <Card.Content>
          {medications.map((medication) => (
            <View key={medication.id}>
              <List.Item
                title={medication.name}
                description={`${medication.dosage} - ${medication.frequency}`}
                right={() => (
                  <Button
                    mode="contained"
                    onPress={() => handleMarkAsTaken(medication.id)}
                    style={styles.takenButton}
                  >
                    Mark as Taken
                  </Button>
                )}
              />
              <Text style={styles.doseInfo}>
                Last taken: {new Date(medication.lastTaken).toLocaleString()}
              </Text>
              <Text style={styles.doseInfo}>
                Next dose: {new Date(medication.nextDose).toLocaleString()}
              </Text>
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
  takenButton: {
    marginLeft: 8,
  },
  doseInfo: {
    fontSize: 12,
    color: '#666',
    marginLeft: 16,
    marginBottom: 4,
  },
  divider: {
    marginVertical: 8,
  },
});

export default MedicationScreen; 