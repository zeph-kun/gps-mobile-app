import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

const API_BASE_URL = 'http://localhost:8080';

// Validation d'email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Messages d'erreur HTTP
function getErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return "Données invalides";
    case 401:
      return "Identifiants incorrects";
    case 403:
      return "Accès refusé";
    case 404:
      return "Service non trouvé";
    case 429:
      return "Trop de tentatives. Réessayez plus tard";
    case 500:
      return "Erreur serveur";
    default:
      return "Erreur de connexion";
  }
}

export async function authenticate(
  email: string, 
  password: string
): Promise<AuthResponse> {
  try {
    if (!email || !password) {
      return { 
        success: false, 
        message: "Email et mot de passe requis" 
      };
    }

    if (!isValidEmail(email)) {
      return { 
        success: false, 
        message: "Format d'email invalide" 
      };
    }

    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        password: password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Erreur ${response.status}: ${getErrorMessage(response.status)}`
      };
    }

    if (data.user) {
      await AsyncStorage.setItem('user_data', JSON.stringify(data.user));
      await AsyncStorage.setItem('is_authenticated', 'true');
    }

    return {
      success: true,
      message: "Connexion réussie",
      user: data.user
    };

  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        message: "Erreur de connexion. Vérifiez votre connexion internet."
      };
    }
    
    return {
      success: false,
      message: "Une erreur inattendue s'est produite. Veuillez réessayer."
    };
  }
}

export async function checkSession(): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        user: data.user
      };
    } else {
      await AsyncStorage.removeItem('user_data');
      await AsyncStorage.removeItem('is_authenticated');
      return {
        success: false,
        message: "Session expirée"
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Erreur de vérification de session"
    };
  }
}

export async function logout(): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    await AsyncStorage.removeItem('user_data');
    await AsyncStorage.removeItem('is_authenticated');

    return {
      success: true,
      message: "Déconnexion réussie"
    };
  } catch (error) {
    await AsyncStorage.removeItem('user_data');
    await AsyncStorage.removeItem('is_authenticated');
    
    return {
      success: false,
      message: "Erreur lors de la déconnexion"
    };
  }
}
