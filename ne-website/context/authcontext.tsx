"use client"

import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, User } from 'firebase/auth'
import { collection, deleteDoc, doc, getDoc, getDocs, increment, setDoc, updateDoc } from 'firebase/firestore'
import React, {useContext, useState, useEffect, use} from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/firebase'

export interface UserCoin {
  id: string;
  amount: number;
  price: number;
  boughtAt?: Date;
  boughtPrice?: number;
}

export interface UserPortfolio {
  coins: UserCoin[];
}

export interface UserDataDB
{
  email: string;
  name: string;

  uid: string;
  coins: UserCoin[];
  favorites: string[];
}

export interface UserData {
  email: string;
  name: string;

  uid: string;
  coins: UserCoin[];
  favoritesSet: Set<string>;
}
function convertUserDataDBToUserData(userDataDB: UserDataDB): UserData {
  return {
    ...userDataDB,
    favoritesSet: new Set(userDataDB.favorites),
  };
}
function convertUserDataToUserDataDB(userData: UserData): UserDataDB {
  const { favoritesSet, ...rest } = userData; // Exclude favoritesSet
  return {
    ...rest,
    favorites: Array.from(favoritesSet),
  };
}

interface AuthContextType {
  user: User | null;
  userDataObj: UserData | null;
  setUserDataObj: (data: UserData) => void;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  loading: boolean;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  userDataObj: null,
  setUserDataObj: () => {},
  login: async () => {},
  logout: async () => {},
  loading: false,
};

const AuthContext = React.createContext(defaultAuthContext)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider(props: { children: any }) {

  const [user, setUser] = useState<User | null>(null)
  const [userDataObj, setUserDataObj] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  const router = useRouter()

  function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  function logout() {
    setUserDataObj(null)
    setUser(null)

    return auth.signOut()
  }


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setLoading(true);
        setUser(user);
        if (!user) {
          console.log('User is not logged in');
          return;
        }
  
        // if user is logged in, get user data from Firestore
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        let firebaseData = {};
        if (docSnap.exists()) {
          const data = docSnap.data();
  
          // Assign the converted dates back to the firebaseData object
          firebaseData = {
            ...data,
          };
        }

        const userData = convertUserDataDBToUserData(firebaseData as UserDataDB);

        setUserDataObj(userData);
      } catch (err: any) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!user || !userDataObj) {
          return
        }
        const docRef = doc(db, 'users', user.uid);
      const userDataDB: UserDataDB = convertUserDataToUserDataDB(userDataObj);
      console.log(userDataDB)
      await setDoc(docRef, userDataDB);
      }
      catch (err: any) {
        console.error(err.message)
      }
    }
    fetchUserData()
  }, [userDataObj])

  const value: AuthContextType = {
    user,
    userDataObj,
    setUserDataObj,
    login,
    logout,
    loading
  }
  return (
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  )
}