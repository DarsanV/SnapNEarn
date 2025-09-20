import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';



export default function HomeScreen({ navigation }) {
  const { user } = useSelector((state) => state.auth);
  const { reports } = useSelector((state) => state.reports);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const stats = [
    { icon: 'document-text', value: reports.length.toString(), label: 'Reports', color: '#00E5FF' },
    { icon: 'checkmark-circle', value: '0', label: 'Verified', color: '#00BFA5' },
    { icon: 'cash', value: '₹0', label: 'Earned', color: '#7C4DFF' },
    { icon: 'trending-up', value: '0%', label: 'Success', color: '#FF6B6B' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>SnapNEarn</Text>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <LinearGradient
              colors={['#00E5FF', '#7C4DFF']}
              style={styles.profileGradient}
            >
              <Text style={styles.profileInitial}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.userName}>Agent {user?.name || 'Unknown'}</Text>
            <Text style={styles.tagline}>Report • Verify • Earn</Text>
          </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Ionicons name={stat.icon} size={24} color={stat.color} />
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Main Action Button */}
        <View style={styles.mainActionContainer}>
          <TouchableOpacity
            style={styles.mainActionButton}
            onPress={() => navigation.navigate('Report')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#00E5FF', '#7C4DFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.mainActionGradient}
            >
              <Ionicons name="scan-outline" size={32} color="#0B0E1A" />
              <Text style={styles.mainActionText}>Report Violation</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('MyReports')}
          >
            <Ionicons name="document-text-outline" size={24} color="#00E5FF" />
            <Text style={styles.quickActionText}>My Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-outline" size={24} color="#7C4DFF" />
            <Text style={styles.quickActionText}>Profile</Text>
          </TouchableOpacity>
        </View>

        {/* How It Works Section */}
        <View style={styles.howItWorksSection}>
          <Text style={styles.sectionTitle}>How SnapNEarn Works</Text>
          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Spot a Violation</Text>
              <Text style={styles.stepDescription}>See someone riding without a helmet or breaking traffic rules</Text>
            </View>
          </View>
          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Capture & Report</Text>
              <Text style={styles.stepDescription}>Take a clear photo with visible number plate and submit report</Text>
            </View>
          </View>
          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Earn Rewards</Text>
              <Text style={styles.stepDescription}>Get 10% of the fine amount when your report is verified</Text>
            </View>
          </View>
        </View>

        {/* Safety Tips Section */}
        <View style={styles.safetySection}>
          <Text style={styles.sectionTitle}>Safety First</Text>
          <View style={styles.tipCard}>
            <Ionicons name="shield-checkmark" size={24} color="#00BFA5" />
            <Text style={styles.tipText}>Always prioritize your safety while reporting</Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="camera" size={24} color="#00E5FF" />
            <Text style={styles.tipText}>Take photos from a safe distance</Text>
          </View>
          <View style={styles.tipCard}>
            <Ionicons name="eye" size={24} color="#7C4DFF" />
            <Text style={styles.tipText}>Ensure number plate is clearly visible</Text>
          </View>
        </View>
      </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0E1A',
    minHeight: '100vh',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(26, 31, 46, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 229, 255, 0.2)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00E5FF',
    letterSpacing: 1,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  profileGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B0E1A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00E5FF',
    marginBottom: 8,
  },
  userName: {
    fontSize: 18,
    color: '#E8F4FD',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: '#6B7B8C',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(26, 31, 46, 0.6)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.1)',
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    fontWeight: '500',
  },
  mainActionContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  mainActionButton: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  mainActionGradient: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  mainActionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0B0E1A',
    marginLeft: 12,
    letterSpacing: 0.5,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(26, 31, 46, 0.7)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
    marginHorizontal: 8,
  },
  quickActionText: {
    color: '#E8F4FD',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  howItWorksSection: {
    marginBottom: 40,
  },
  safetySection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00E5FF',
    marginBottom: 24,
    textAlign: 'center',
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(26, 31, 46, 0.6)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.1)',
  },
  stepNumber: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#00E5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0B0E1A',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E8F4FD',
    marginBottom: 6,
  },
  stepDescription: {
    fontSize: 15,
    color: '#6B7B8C',
    lineHeight: 22,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 31, 46, 0.6)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.1)',
  },
  tipText: {
    fontSize: 15,
    color: '#E8F4FD',
    marginLeft: 16,
    flex: 1,
    lineHeight: 22,
  },
});
