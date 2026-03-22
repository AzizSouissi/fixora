import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

const theme = {
  bg: '#F5EFE4',
  card: '#FFFDF8',
  text: '#20252B',
  muted: '#5D6470',
  brand: '#C26527',
  border: '#D7D0C5',
};

export default function App() {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <Text style={styles.eyebrow}>FIELD SERVICE APP</Text>
        <Text style={styles.title}>Fixora Mobile</Text>
        <Text style={styles.subtitle}>
          Technician workflow for jobs, checklists, notes, and customer-ready completion updates.
        </Text>

        <View style={styles.grid}>
          <View style={styles.tile}>
            <Text style={styles.tileTitle}>Today</Text>
            <Text style={styles.tileBody}>4 assigned jobs</Text>
          </View>
          <View style={styles.tile}>
            <Text style={styles.tileTitle}>Checklist</Text>
            <Text style={styles.tileBody}>2 pending items</Text>
          </View>
          <View style={styles.tile}>
            <Text style={styles.tileTitle}>Travel</Text>
            <Text style={styles.tileBody}>27 min next stop</Text>
          </View>
        </View>
      </View>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 22,
    gap: 10,
  },
  eyebrow: {
    color: theme.brand,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
  title: {
    color: theme.text,
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 4,
    color: theme.muted,
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 360,
  },
  grid: {
    marginTop: 14,
    gap: 10,
  },
  tile: {
    backgroundColor: theme.card,
    borderColor: theme.border,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  tileTitle: {
    color: theme.brand,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  tileBody: {
    marginTop: 4,
    color: theme.text,
    fontSize: 15,
    fontWeight: '600',
  },
});
