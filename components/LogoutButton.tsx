import React, { useState } from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';

interface LogoutButtonProps {
  style?: any;
  textStyle?: any;
  showConfirmation?: boolean;
}

export default function LogoutButton({ 
  style, 
  textStyle, 
  showConfirmation = true 
}: LogoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const { signOut } = useAuth();

  const handleLogout = async () => {
    if (showConfirmation) {
      Alert.alert(
        'Déconnexion',
        'Êtes-vous sûr de vouloir vous déconnecter ?',
        [
          {
            text: 'Annuler',
            style: 'cancel',
          },
          {
            text: 'Déconnexion',
            style: 'destructive',
            onPress: performLogout,
          },
        ]
      );
    } else {
      await performLogout();
    }
  };

  const performLogout = async () => {
    setLoading(true);
    try {
      await signOut();
      router.replace('/sign-in');
    } catch (error) {
      Alert.alert('Erreur', 'Erreur lors de la déconnexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleLogout}
      disabled={loading}
      style={[styles.button, style, loading && styles.buttonDisabled]}
    >
      {loading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>
          Se déconnecter
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
