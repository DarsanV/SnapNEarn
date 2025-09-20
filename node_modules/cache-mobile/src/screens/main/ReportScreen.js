import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
  Animated,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import locationService from '../../services/locationService';
import { addReport } from '../../store/slices/reportSlice';
import { setCurrentLocation, setAddress } from '../../store/slices/locationSlice';


export default function ReportScreen({ navigation }) {
  const dispatch = useDispatch();
  const { currentLocation, address } = useSelector((state) => state.location);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [locationData, setLocationData] = useState(null);
  const [nearbyPoliceStations, setNearbyPoliceStations] = useState([]);
  const [selectedPoliceStation, setSelectedPoliceStation] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [violationType, setViolationType] = useState('no_helmet');

  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [step]);

  const handleLocationPermission = async () => {
    setLoading(true);
    try {
      const location = await locationService.getCurrentLocation();
      if (location) {
        setLocationData(location);
        dispatch(setCurrentLocation(location));

        // Get address
        const addressData = await locationService.getAddressFromCoordinates(
          location.latitude,
          location.longitude
        );
        if (addressData) {
          dispatch(setAddress(addressData.formattedAddress));
        }

        // Find nearby police stations
        const stations = await locationService.findNearbyPoliceStations(
          location.latitude,
          location.longitude
        );
        setNearbyPoliceStations(stations);
        setSelectedPoliceStation(stations[0]); // Auto-select nearest station

        setStep(2);
      }
    } catch (error) {
      Alert.alert('Location Error', 'Unable to get your location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCameraPermission = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status === 'granted') {
        setStep(3);
      } else {
        Alert.alert(
          'Camera Permission Required',
          'CACHE needs camera access to capture violation photos.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => ImagePicker.requestCameraPermissionsAsync() }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Permission Error', 'Unable to request camera permission.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setCapturedImage(result.assets[0]);
        setStep(4);
      }
    } catch (error) {
      Alert.alert('Camera Error', 'Unable to capture photo. Please try again.');
    }
  };

  const handleSubmitReport = async () => {
    setLoading(true);
    try {
      const reportData = {
        id: Date.now().toString(),
        type: violationType,
        location: locationData,
        address: address,
        policeStation: selectedPoliceStation,
        image: capturedImage,
        status: 'pending',
        createdAt: new Date().toISOString(),
        reward: 0,
      };

      dispatch(addReport(reportData));

      Alert.alert(
        'Report Submitted Successfully! 🎉',
        `Your violation report has been sent to ${selectedPoliceStation?.name}. You'll be notified once it's verified.`,
        [
          {
            text: 'View My Reports',
            onPress: () => navigation.navigate('MyReports')
          },
          {
            text: 'Report Another',
            onPress: () => {
              setStep(1);
              setCapturedImage(null);
              setLocationData(null);
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Submission Error', 'Unable to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        {/* Enhanced Header - Black Theme */}
        <View style={styles.header}>
          <Animated.View
            style={[
              styles.headerContent,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <Text style={styles.title}>SnapNEarn</Text>
            <Text style={styles.subtitle}>Report • Verify • Earn</Text>

            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
              {[1, 2, 3, 4].map((stepNum) => (
                <View
                  key={stepNum}
                  style={[
                    styles.progressDot,
                    step >= stepNum && styles.progressDotActive
                  ]}
                />
              ))}
            </View>
          </Animated.View>
        </View>

        {step === 1 && (
          <Animated.View
            style={[
              styles.stepContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <LinearGradient
              colors={['#3b82f6', '#2563eb']}
              style={styles.stepGradient}
            >
              <Text style={styles.stepIcon}>📍</Text>
              <Text style={styles.stepTitle}>Step 1: Enable Location</Text>
              <Text style={styles.stepDescription}>
                We need to verify your location to ensure accurate reporting and find the nearest police station.
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={handleLocationPermission}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>📍 Enable GPS Location</Text>
                )}
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        )}

        {step === 2 && (
          <Animated.View
            style={[
              styles.stepContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.stepGradient}
            >
              <Text style={styles.stepIcon}>✅</Text>
              <Text style={styles.stepTitle}>Location Verified!</Text>
              <Text style={styles.stepDescription}>
                📍 {address || 'Location captured successfully'}
              </Text>
              {selectedPoliceStation && (
                <View style={styles.policeStationInfo}>
                  <Text style={styles.policeStationTitle}>🚔 Nearest Police Station:</Text>
                  <Text style={styles.policeStationName}>{selectedPoliceStation.name}</Text>
                  <Text style={styles.policeStationDistance}>
                    📏 {selectedPoliceStation.distance}m away
                  </Text>
                </View>
              )}
            </LinearGradient>

            <LinearGradient
              colors={['#f59e0b', '#d97706']}
              style={[styles.stepGradient, { marginTop: 20 }]}
            >
              <Text style={styles.stepIcon}>📷</Text>
              <Text style={styles.stepTitle}>Step 2: Camera Access</Text>
              <Text style={styles.stepDescription}>
                Allow camera access to capture violation photos with clear number plate visibility.
              </Text>
              <TouchableOpacity style={styles.button} onPress={handleCameraPermission}>
                <Text style={styles.buttonText}>📷 Enable Camera</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        )}

        {step === 3 && (
          <Animated.View
            style={[
              styles.stepContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <LinearGradient
              colors={['#8b5cf6', '#7c3aed']}
              style={styles.stepGradient}
            >
              <Text style={styles.stepIcon}>📸</Text>
              <Text style={styles.stepTitle}>Step 3: Capture Violation</Text>
              <Text style={styles.stepDescription}>
                Take a clear photo of the traffic violation. Ensure the number plate is clearly visible for verification.
              </Text>

              <View style={styles.violationTypeContainer}>
                <Text style={styles.violationTypeTitle}>Select Violation Type:</Text>
                <View style={styles.violationTypes}>
                  {[
                    { key: 'no_helmet', label: '🪖 No Helmet', color: '#ef4444' },
                    { key: 'signal_jump', label: '🚦 Signal Jump', color: '#f59e0b' },
                    { key: 'wrong_side', label: '↔️ Wrong Side', color: '#8b5cf6' },
                  ].map((type) => (
                    <TouchableOpacity
                      key={type.key}
                      style={[
                        styles.violationTypeButton,
                        violationType === type.key && { backgroundColor: type.color }
                      ]}
                      onPress={() => setViolationType(type.key)}
                    >
                      <Text style={[
                        styles.violationTypeText,
                        violationType === type.key && { color: '#fff' }
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
                <Text style={styles.buttonText}>📸 Capture Violation</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        )}

        {step === 4 && (
          <Animated.View
            style={[
              styles.stepContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.stepGradient}
            >
              <Text style={styles.stepIcon}>✅</Text>
              <Text style={styles.stepTitle}>Step 4: Review & Submit</Text>
              <Text style={styles.stepDescription}>
                Review your violation report before submission.
              </Text>

              {capturedImage && (
                <View style={styles.imagePreview}>
                  <Image source={{ uri: capturedImage.uri }} style={styles.previewImage} />
                  <Text style={styles.imageLabel}>📸 Captured Evidence</Text>
                </View>
              )}

              <View style={styles.reportSummary}>
                <Text style={styles.summaryTitle}>📋 Report Summary:</Text>
                <Text style={styles.summaryItem}>📍 Location: {address || 'GPS Location Verified'}</Text>
                <Text style={styles.summaryItem}>🚔 Police Station: {selectedPoliceStation?.name}</Text>
                <Text style={styles.summaryItem}>⚠️ Violation: {violationType.replace('_', ' ').toUpperCase()}</Text>
                <Text style={styles.summaryItem}>📸 Evidence: Photo Captured</Text>
                <Text style={styles.summaryItem}>💰 Potential Reward: ₹50-500 (10% of fine)</Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={handleSubmitReport}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>🚀 Submit Report</Text>
                )}
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Important Guidelines:</Text>
          <Text style={styles.infoText}>• Only report genuine violations</Text>
          <Text style={styles.infoText}>• Ensure your safety first</Text>
          <Text style={styles.infoText}>• Take clear, original photos</Text>
          <Text style={styles.infoText}>• Number plate must be visible</Text>
          <Text style={styles.infoText}>• Earn 10% of fine amount for verified reports</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: '#111111',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#333',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#00D4FF',
  },
  stepContainer: {
    margin: 20,
  },
  stepGradient: {
    padding: 25,
    borderRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  stepIcon: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 15,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 25,
    lineHeight: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  policeStationInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  policeStationTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
  policeStationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 3,
  },
  policeStationDistance: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  violationTypeContainer: {
    marginBottom: 20,
  },
  violationTypeTitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 10,
    textAlign: 'center',
  },
  violationTypes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  violationTypeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  violationTypeText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  imagePreview: {
    alignItems: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: 200,
    height: 150,
    borderRadius: 15,
    marginBottom: 10,
  },
  imageLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  reportSummary: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  summaryItem: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
    paddingLeft: 10,
  },
  infoContainer: {
    margin: 20,
    padding: 16,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#92400e',
    marginBottom: 4,
  },
});
