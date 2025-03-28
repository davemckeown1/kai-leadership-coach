import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  getDocs,
  Timestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export interface CoachingSession {
  id: string;
  userId: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  context?: {
    role?: string;
    topic?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export class FirebaseService {
  private static instance: FirebaseService;
  private currentUser: User | null = null;
  private unsubscribeAuth: (() => void) | null = null;

  private constructor() {
    this.unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
    });
  }

  static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  async signInWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  }

  async signOut(): Promise<void> {
    await signOut(auth);
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  async createCoachingSession(session: Omit<CoachingSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!this.currentUser) {
      throw new Error('User must be authenticated to create a coaching session');
    }

    const docRef = await addDoc(collection(db, 'coaching_sessions'), {
      ...session,
      userId: this.currentUser.uid,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return docRef.id;
  }

  async getCoachingSessions(limitCount: number = 10): Promise<CoachingSession[]> {
    if (!this.currentUser) {
      throw new Error('User must be authenticated to fetch coaching sessions');
    }

    const q = query(
      collection(db, 'coaching_sessions'),
      where('userId', '==', this.currentUser.uid),
      orderBy('createdAt', 'desc'),
      firestoreLimit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as CoachingSession[];
  }

  async updateCoachingSession(
    sessionId: string,
    updates: Partial<CoachingSession>
  ): Promise<void> {
    if (!this.currentUser) {
      throw new Error('User must be authenticated to update a coaching session');
    }

    const sessionRef = collection(db, 'coaching_sessions');
    await addDoc(sessionRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }
} 