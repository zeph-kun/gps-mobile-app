import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import LogoutButton from '../../components/LogoutButton';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#F8F9FA',
          borderTopWidth: 1,
          borderTopColor: '#E5E5EA',
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
        },
        headerStyle: {
          backgroundColor: '#F8F9FA',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerTitle: 'Accueil',
        }}
      />
      
      <Tabs.Screen
        name="map"
        options={{
          title: 'Carte',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" size={size} color={color} />
          ),
          headerTitle: 'Carte',
        }}
      />
      
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Paramètres',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
          headerTitle: 'Paramètres',
        }}
      />
    </Tabs>
  );
}