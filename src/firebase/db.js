import {
  collection, doc, addDoc, updateDoc, getDoc, getDocs,
  query, where, orderBy, limit, onSnapshot,
  serverTimestamp, deleteDoc, increment,
} from 'firebase/firestore'
import { db } from './config'

// ═══════════════════════════════════════════════════════════════════════════
// TRIPS
// ═══════════════════════════════════════════════════════════════════════════

export async function createTrip(data) {
  const ref = await addDoc(collection(db, 'trips'), {
    ...data,
    status:    'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateTrip(tripId, data) {
  await updateDoc(doc(db, 'trips', tripId), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function getPassengerTrips(passengerId) {
  const q = query(
    collection(db, 'trips'),
    where('passengerId', '==', passengerId),
    orderBy('createdAt', 'desc'),
    limit(20)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getDriverTrips(driverId) {
  const q = query(
    collection(db, 'trips'),
    where('driverId', '==', driverId),
    orderBy('createdAt', 'desc'),
    limit(20)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// Real-time listener for pending trips (driver sees new requests)
export function listenPendingTrips(callback) {
  const q = query(
    collection(db, 'trips'),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  )
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  })
}

// Real-time listener for a specific trip (passenger tracks)
export function listenTrip(tripId, callback) {
  return onSnapshot(doc(db, 'trips', tripId), snap => {
    if (snap.exists()) callback({ id: snap.id, ...snap.data() })
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// DRIVER LOCATION (real-time)
// ═══════════════════════════════════════════════════════════════════════════

export async function updateDriverLocation(driverId, lat, lng) {
  await updateDoc(doc(db, 'driverLocations', driverId), {
    lat, lng,
    updatedAt: serverTimestamp(),
  }).catch(() =>
    // Create if doesn't exist
    addDoc(collection(db, 'driverLocations'), { driverId, lat, lng, updatedAt: serverTimestamp() })
  )
}

export function listenDriverLocation(driverId, callback) {
  return onSnapshot(doc(db, 'driverLocations', driverId), snap => {
    if (snap.exists()) callback(snap.data())
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// SCHOOL REGISTRATIONS
// ═══════════════════════════════════════════════════════════════════════════

export async function addSchoolRegistration(passengerId, childData) {
  return addDoc(collection(db, 'schoolRegistrations'), {
    passengerId,
    ...childData,
    createdAt: serverTimestamp(),
  })
}

export async function getSchoolRegistrations(passengerId) {
  const q = query(
    collection(db, 'schoolRegistrations'),
    where('passengerId', '==', passengerId)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function deleteSchoolRegistration(id) {
  await deleteDoc(doc(db, 'schoolRegistrations', id))
}

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN STATS
// ═══════════════════════════════════════════════════════════════════════════

export async function getAdminStats() {
  const [usersSnap, tripsSnap] = await Promise.all([
    getDocs(query(collection(db, 'users'), where('role', '==', 'passenger'))),
    getDocs(collection(db, 'trips')),
  ])
  const trips     = tripsSnap.docs.map(d => d.data())
  const completed = trips.filter(t => t.status === 'completed')
  const revenue   = completed.reduce((sum, t) => sum + (t.price || 0), 0)

  return {
    passengers: usersSnap.size,
    trips:      trips.length,
    revenue,
    schools:    48, // static for now
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// USER PROFILE
// ═══════════════════════════════════════════════════════════════════════════

export async function updateUserProfile(uid, data) {
  await updateDoc(doc(db, 'users', uid), data)
}

export async function incrementUserTrips(uid) {
  await updateDoc(doc(db, 'users', uid), { trips: increment(1) })
}
