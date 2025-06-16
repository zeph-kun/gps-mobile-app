import React, { createContext, useContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkSession, logout as logoutService } from '../services/auth';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  isLoading: boolean;
  isSignout: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

interface AuthContextType extends AuthState {
  signIn: (user: User) => void;
  signOut: () => void;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function authReducer(prevState: AuthState, action: any): AuthState {
  switch (action.type) {
    case 'RESTORE_SESSION':
      return {
        ...prevState,
        isAuthenticated: action.isAuthenticated,
        user: action.user,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...prevState,
        isSignout: false,
        isAuthenticated: true,
        user: action.user,
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        isSignout: true,
        isAuthenticated: false,
        user: null,
      };
    case 'SESSION_EXPIRED':
      return {
        ...prevState,
        isAuthenticated: false,
        user: null,
      };
    default:
      return prevState;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    isLoading: true,
    isSignout: false,
    isAuthenticated: false,
    user: null,
  });

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const isAuth = await AsyncStorage.getItem('is_authenticated');
        const userDataString = await AsyncStorage.getItem('user_data');
        
        if (isAuth === 'true' && userDataString) {
          const sessionCheck = await checkSession();
          
          if (sessionCheck.success && sessionCheck.user) {
            dispatch({ 
              type: 'RESTORE_SESSION', 
              isAuthenticated: true, 
              user: sessionCheck.user 
            });
          } else {
            dispatch({ 
              type: 'RESTORE_SESSION', 
              isAuthenticated: false, 
              user: null 
            });
          }
        } else {
          dispatch({ 
            type: 'RESTORE_SESSION', 
            isAuthenticated: false, 
            user: null 
          });
        }
      } catch (e) {
        console.error('Erreur lors de la restauration de session:', e);
        dispatch({ 
          type: 'RESTORE_SESSION', 
          isAuthenticated: false, 
          user: null 
        });
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    ...state,
    signIn: async (user: User) => {
      await AsyncStorage.setItem('user_data', JSON.stringify(user));
      await AsyncStorage.setItem('is_authenticated', 'true');
      dispatch({ type: 'SIGN_IN', user });
    },
    signOut: async () => {
      await logoutService();
      dispatch({ type: 'SIGN_OUT' });
    },
    refreshSession: async () => {
      const sessionCheck = await checkSession();
      if (!sessionCheck.success) {
        dispatch({ type: 'SESSION_EXPIRED' });
      }
    },
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
