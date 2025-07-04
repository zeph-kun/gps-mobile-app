import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { router } from 'expo-router';

const SettingsScreen = () => {
    const [isEnabled, setIsEnabled] = React.useState(false);
    const [loading, setLoading] = useState(false);
    const { signOut } = useAuth();

    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    const handleLogout = () => {
        Alert.alert(
            'Déconnexion',
            'Êtes-vous sûr de vouloir vous déconnecter ?',
            [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Déconnexion', style: 'destructive', onPress: performLogout }
            ]
        );
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
        <View style={styles.container}>
            <Text style={styles.title}>Paramètres</Text>
            <View style={styles.settingRow}>
                <Text>Activer les notifications</Text>
                <Switch
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                />
            </View>

            {/* Bouton déconnexion */}
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.logoutText}>Déconnexion</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        marginBottom: 24,
        fontWeight: 'bold',
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 12,
    },
    logoutButton: {
        marginTop: 40,
        backgroundColor: '#ff4444',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    logoutText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default SettingsScreen;
