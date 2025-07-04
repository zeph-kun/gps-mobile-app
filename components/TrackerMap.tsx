// components/TrackerMap.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert, TextInput, Keyboard } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function TrackerMap({ trackers = [] }) {
  const [region, setRegion] = useState(null);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'La localisation est requise pour afficher la carte.');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    })();
  }, []);

  const handleSearch = async () => {
    if (!search) return;
    setSearching(true);
    try {
      const geocode = await Location.geocodeAsync(search);
      if (geocode.length > 0) {
        const { latitude, longitude } = geocode[0];
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        Keyboard.dismiss();
      } else {
        Alert.alert('Adresse non trouvée', 'Veuillez saisir une adresse valide.');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de géocoder cette adresse.');
    }
    setSearching(false);
  };

  if (!region) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Où voulez-vous aller ?"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          editable={!searching}
          returnKeyType="search"
        />
      </View>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        onRegionChangeComplete={setRegion}
      >
        {trackers.map((tracker, idx) => (
          <Marker
            key={idx}
            coordinate={{
              latitude: tracker.latitude,
              longitude: tracker.longitude,
            }}
            title={tracker.name || `Traceur ${idx + 1}`}
            description={tracker.description}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchContainer: {
    position: 'absolute',
    top: 40,
    left: 15,
    right: 15,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    height: 40,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#f6f6f6',
    borderRadius: 6,
  },
});
