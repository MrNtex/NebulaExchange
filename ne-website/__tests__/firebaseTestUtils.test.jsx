import { auth, db } from './firebaseTestUtils';
import { signup } from '../actions/auth';

describe('Firebase Auth and Firestore Emulators', () => {
  beforeAll(async () => {
    await auth.useEmulator('http://localhost:9099');
    await db.useEmulator('localhost', 8080);
  });

  afterEach(async () => {
    // Clear Auth and Firestore data after each test
    await auth.signOut();
    // TODO: Clear Firestore data 
  });

  it('should create a user and add user data to Firestore', async () => {
    const formData = new FormData();
    formData.append('name', 'Test User');
    formData.append('email', 'testuser@example.com');
    formData.append('password', 'Password123');

    // Run the signup function
    const result = await signup({}, formData, auth, db);

    // Check if the user was created in Firebase Auth
    const user = auth.currentUser;
    expect(user).toBeDefined();
    

    // Check if user data is in Firestore
    const userDoc = await db.collection('users').doc(user?.uid).get();
    expect(userDoc.exists).toBe(true);
    expect(userDoc.data()?.name).toBe('Test User');
  });

  it('should return an error for invalid email format', async () => {
    const formData = new FormData();
    formData.append('name', 'Test User');
    formData.append('email', 'invalid-email');
    formData.append('password', 'Password123');

    const result = await signup({}, formData);

    // Check that validation failed due to invalid email format
    expect(result.errors?.email).toContain('Please enter a valid email.');
  });
});
