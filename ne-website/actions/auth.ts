import { auth, db } from '@/firebase';
import { SignupFormSchema, FormState } from '@/lib/definitions';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export async function signup(state: FormState, formData: FormData) {
  // Validate form fields
  console.log('formData', formData);

  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    // Create a new user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      validatedFields.data.email,
      validatedFields.data.password
    );

    // Get user UID and create a new document in Firestore
    const user = userCredential.user;
    const docRef = doc(db, 'users', user.uid);
    await setDoc(docRef, {
      name: validatedFields.data.name,
      email: validatedFields.data.email,
      uid: user.uid,
    });

    // Return user information if successful
    return {
      user,
    };
  } catch (error) {
    return {
      message: 'An error occurred while creating your account.',
      error, // optional: include error details
    };
  }
}
