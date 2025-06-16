import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { router } from 'expo-router';

interface LoginButtonProps {
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  title?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loadingColor?: string;
  redirectToLogin?: boolean; // Nouvelle prop
}

export default function LoginButton({
  onPress,
  loading = false,
  disabled = false,
  title = 'Se connecter',
  style,
  textStyle,
  loadingColor = 'white',
  redirectToLogin = false
}: LoginButtonProps) {
  const isDisabled = loading || disabled;

  const handlePress = () => {
    if (redirectToLogin) {
      router.push('/sign-in');
    } else if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isDisabled}
      style={[
        styles.button,
        isDisabled && styles.buttonDisabled,
        style
      ]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator 
          color={loadingColor} 
          size="small" 
          style={styles.loader}
        />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#C7C7CC',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginVertical: 2,
  },
});
