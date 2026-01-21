import { db } from './firebaseAdmin';

// Define User Interface matching our needs
export interface FirestoreUser {
    uid?: string; // Document ID
    email: string;
    password?: string; // Hashed 
    name: string;
    location?: {
        state: string;
        district: string;
    };
    crops?: string[];
    isOnboarded: boolean;
    isVerified?: boolean;
    verificationToken?: string;
    createdAt: string; // ISO string
    updatedAt: string;
    resetToken?: string;
    resetTokenExpiry?: string;
}

const COLLECTION = 'users';

export async function createUser(userData: FirestoreUser) {
    // Check if user exists first
    const existing = await getUserByEmail(userData.email);
    if (existing) {
        throw new Error('User already exists');
    }

    // Create new document reference
    const docRef = db.collection(COLLECTION).doc();
    const newUser = {
        ...userData,
        uid: docRef.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    await docRef.set(newUser);
    return newUser;
}

export async function getUserByEmail(email: string): Promise<FirestoreUser | null> {
    const snapshot = await db.collection(COLLECTION)
        .where('email', '==', email)
        .limit(1)
        .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { uid: doc.id, ...doc.data() } as FirestoreUser;
}

export async function getUserById(uid: string): Promise<FirestoreUser | null> {
    const doc = await db.collection(COLLECTION).doc(uid).get();
    if (!doc.exists) return null;
    return { uid: doc.id, ...doc.data() } as FirestoreUser;
}

export async function updateUser(uid: string, data: Partial<FirestoreUser>) {
    const docRef = db.collection(COLLECTION).doc(uid);
    const updateData = {
        ...data,
        updatedAt: new Date().toISOString()
    };
    await docRef.update(updateData);

    // Return updated user
    const updatedCallback = await docRef.get();
    return { uid: updatedCallback.id, ...updatedCallback.data() } as FirestoreUser;
}

export async function getUserByResetToken(token: string): Promise<FirestoreUser | null> {
    // Note: Firestore doesn't support multiple inequality filters easily on different fields, 
    // but here we filter by token (equality) and then checking expiry in code is safer/easier 
    // unless we create a composite index.
    // Let's filter by token and check expiry in logic.
    const snapshot = await db.collection(COLLECTION)
        .where('resetToken', '==', token)
        .limit(1)
        .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    const user = { uid: doc.id, ...doc.data() } as FirestoreUser;

    // Check expiry
    if (user.resetTokenExpiry && new Date(user.resetTokenExpiry) > new Date()) {
        return user;
    }

    return null;
}

export async function getUserByVerificationToken(token: string): Promise<FirestoreUser | null> {
    const snapshot = await db.collection(COLLECTION)
        .where('verificationToken', '==', token)
        .limit(1)
        .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { uid: doc.id, ...doc.data() } as FirestoreUser;
}
