import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, Title, Paragraph, List, FAB } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function ResponseTeamScreen() {
  const navigation = useNavigation();
  const [teams, setTeams] = useState([
    { id: 1, name: 'Emergency Response Team 1', members: 5, status: 'Active' },
    { id: 2, name: 'Medical Support Team', members: 3, status: 'On Call' },
    { id: 3, name: 'First Aid Team', members: 4, status: 'Available' },
  ]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Response Teams</Text>
        
        {teams.map((team) => (
          <Card key={team.id} style={styles.card}>
            <Card.Content>
              <Title>{team.name}</Title>
              <Paragraph>Members: {team.members}</Paragraph>
              <Paragraph>Status: {team.status}</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => {}}>View Details</Button>
              <Button onPress={() => {}}>Edit Team</Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {}}
        label="Add Team"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
    textAlign: 'center',
  },
  card: {
    margin: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
}); 