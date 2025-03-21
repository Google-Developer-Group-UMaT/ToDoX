import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup, 
  GithubAuthProvider, 
  User as FirebaseUser,
  getIdToken
} from 'firebase/auth';

import firebaseConfig from '@/config/firebase-config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

interface User {
  id: string;
  email: string;
  name?: string;
  photoURL?: string;
  provider?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  googleSignIn: () => Promise<void>;
  githubSignIn: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken(true); // Forces a refresh
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || undefined,
          photoURL: firebaseUser.photoURL || undefined,
          provider: firebaseUser.providerData[0]?.providerId
        });
  
        localStorage.setItem('user', JSON.stringify(firebaseUser.uid));
        localStorage.setItem('authToken', idToken);
      } else {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
      setIsLoading(false);
    });
  
    return () => unsubscribe();
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      setUser({
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name
      });
    } finally {
      setIsLoading(false);
    }
  };

  const googleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      setUser({
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || undefined,
        photoURL: firebaseUser.photoURL || undefined,
        provider: "google"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const githubSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const firebaseUser = result.user;
      setUser({
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || undefined,
        photoURL: firebaseUser.photoURL || undefined,
        provider: "github"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        googleSignIn,
        githubSignIn,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};