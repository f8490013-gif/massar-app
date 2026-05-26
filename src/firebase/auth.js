import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { auth, db, IS_FIREBASE_CONFIGURED } from './config'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'

// ── Register ───────────────────────────────────────────────────────────────
export async function registerUser({ email, password, name, role, city }) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(cred.user, { displayName: name })

  // Create user document in Firestore
  await setDoc(doc(db, 'users', cred.user.uid), {
    uid:       cred.user.uid,
    name,
    email,
    role,
    city:      city || 'الرياض',
    rating:    5.0,
    trips:     0,
    balance:   0,
    createdAt: serverTimestamp(),
  })

  return cred.user
}

// ── Login ──────────────────────────────────────────────────────────────────
export async function loginUser(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return cred.user
}

// ── Google Sign-In ─────────────────────────────────────────────────────────
export async function loginWithGoogle(role = 'passenger') {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })
  const cred = await signInWithPopup(auth, provider)

  // Create user doc if first login
  const ref  = doc(db, 'users', cred.user.uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      uid:       cred.user.uid,
      name:      cred.user.displayName || 'مستخدم جديد',
      email:     cred.user.email,
      role,
      rating:    5.0,
      trips:     0,
      balance:   0,
      createdAt: serverTimestamp(),
    })
  }

  return cred.user
}

// ── Logout ─────────────────────────────────────────────────────────────────
export async function logoutUser() {
  await signOut(auth)
}

// ── Fetch user profile from Firestore ─────────────────────────────────────
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? { uid, ...snap.data() } : null
}

// ── Password reset ─────────────────────────────────────────────────────────
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email)
}
