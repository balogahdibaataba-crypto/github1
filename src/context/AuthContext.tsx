import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User,
  onAuthStateChanged, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as fbSignOut, 
  updateProfile 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';
import { notifyUserRegistered } from '../services/analyticsService';

export interface UserWorkspaceDocument {
  id: string;
  title: string;
  type: 'CV' | 'LETTRE_MOTIVATION' | 'RELEVE_NOTES' | 'DIPLOME_ATTESTATION' | 'PLAN_CARRIERE' | 'PROJET_PRO' | 'NOTE_DE_TRAVAIL';
  content: string;
  notes?: string;
  status: 'BROUILLON' | 'EN_COURS' | 'VALIDE' | 'ARCHIVE';
  updatedAt: string;
  tags?: string[];
}

export interface UserPersonalProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  professionOrStudentStatus?: string;
  targetCareer?: string;
  educationLevel?: string;
  city?: string;
  country?: string;
  bio?: string;
  preferredLanguage?: string;
  avatarUrl?: string;
  careerGoals?: string[];
  skillsList?: string[];
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserPersonalProfile | null;
  documents: UserWorkspaceDocument[];
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfileData: (data: Partial<UserPersonalProfile>) => Promise<void>;
  saveDocument: (docData: Omit<UserWorkspaceDocument, 'id' | 'updatedAt'>, docId?: string) => Promise<string>;
  deleteDocument: (docId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserPersonalProfile | null>(null);
  const [documents, setDocuments] = useState<UserWorkspaceDocument[]>([]);
  const [loading, setLoading] = useState(true);

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch or create profile
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            setUserProfile(snap.data() as UserPersonalProfile);
          } else {
            const initialProfile: UserPersonalProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'Utilisateur OrientaAfrik',
              phone: user.phoneNumber || '',
              professionOrStudentStatus: 'Étudiant / Chercheur d\'emploi',
              targetCareer: '',
              educationLevel: 'BAC / Licence',
              city: 'Lomé',
              country: 'Togo',
              bio: 'Espace de travail personnel pour orienter mes études et mes projets de carrière.',
              careerGoals: ['Obtenir un diplôme certifié', 'Développer des compétences clés'],
              skillsList: ['Bureautique', 'Travail d\'équipe'],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            await setDoc(userDocRef, initialProfile);
            setUserProfile(initialProfile);
            notifyUserRegistered({
              uid: user.uid,
              country: initialProfile.country,
              professionOrStudentStatus: initialProfile.professionOrStudentStatus,
            }).catch(() => {});
          }
        } catch (err) {
          console.warn('Firestore profile load notice:', err);
        }
      } else {
        setUserProfile(null);
        setDocuments([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen to user's documents in real-time
  useEffect(() => {
    if (!currentUser) {
      setDocuments([]);
      return;
    }

    try {
      const docsRef = collection(db, 'users', currentUser.uid, 'documents');
      const q = query(docsRef);
      const unsub = onSnapshot(q, (snapshot) => {
        const docsList: UserWorkspaceDocument[] = [];
        snapshot.forEach((d) => {
          docsList.push({ id: d.id, ...d.data() } as UserWorkspaceDocument);
        });
        setDocuments(docsList);
      }, (err) => {
        console.warn('Documents snapshot notice:', err);
      });

      return () => unsub();
    } catch (err) {
      console.warn('Error setting up documents listener:', err);
    }
  }, [currentUser]);

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      await updateProfile(cred.user, { displayName: name });
      const initialProfile: UserPersonalProfile = {
        uid: cred.user.uid,
        email: email,
        displayName: name,
        professionOrStudentStatus: 'Étudiant / Professionnel',
        city: 'Lomé',
        country: 'Togo',
        bio: 'Espace personnel de travail OrientaAfrik.',
        careerGoals: [],
        skillsList: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', cred.user.uid), initialProfile);
      setUserProfile(initialProfile);
      notifyUserRegistered({
        uid: cred.user.uid,
        country: initialProfile.country,
        professionOrStudentStatus: initialProfile.professionOrStudentStatus,
      }).catch(() => {});
    }
  };

  const logout = async () => {
    await fbSignOut(auth);
  };

  const updateUserProfileData = async (data: Partial<UserPersonalProfile>) => {
    if (!currentUser) return;
    const userDocRef = doc(db, 'users', currentUser.uid);
    const updated = {
      ...userProfile,
      ...data,
      updatedAt: new Date().toISOString()
    } as UserPersonalProfile;
    await setDoc(userDocRef, updated, { merge: true });
    setUserProfile(updated);
  };

  const saveDocument = async (docData: Omit<UserWorkspaceDocument, 'id' | 'updatedAt'>, docId?: string) => {
    if (!currentUser) throw new Error('Veuillez vous connecter');
    const docsRef = collection(db, 'users', currentUser.uid, 'documents');
    const payload = {
      ...docData,
      updatedAt: new Date().toISOString()
    };
    if (docId) {
      const targetDoc = doc(db, 'users', currentUser.uid, 'documents', docId);
      await updateDoc(targetDoc, payload);
      return docId;
    } else {
      const newRef = await addDoc(docsRef, payload);
      return newRef.id;
    }
  };

  const deleteDocument = async (docId: string) => {
    if (!currentUser) return;
    const targetDoc = doc(db, 'users', currentUser.uid, 'documents', docId);
    await deleteDoc(targetDoc);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        documents,
        loading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
        updateUserProfileData,
        saveDocument,
        deleteDocument
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
