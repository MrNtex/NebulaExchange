"use client"

import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, User } from 'firebase/auth'
import { collection, deleteDoc, doc, getDoc, getDocs, increment, setDoc, updateDoc } from 'firebase/firestore'
import React, {useContext, useState, useEffect, use} from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/firebase'

interface UserData {
  email: string;
  name: string;

  uid: string;
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
        setUserDataObj(firebaseData as UserData);
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
        if (!user) {
          return
        }
        const docRef = doc(db, 'users', user.uid)
        setDoc(docRef, userDataObj)
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