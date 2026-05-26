import {
  collection, doc, addDoc, setDoc, updateDoc, getDoc, getDocs,
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
    limit(50)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// Real-time: pending trips — driver sees new requests
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

// Real-time: specific trip — passenger tracks
export function listenTrip(tripId, callback) {
  return onSnapshot(doc(db, 'trips', tripId), snap => {
    if (snap.exists()) callback({ id: snap.id, ...snap.data() })
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// DRIVER LOCATION (real-time)
// ═══════════════════════════════════════════════════════════════════════════

export async function updateDriverLocation(driverId, lat, lng) {
  // setDoc with merge:true creates or updates atomically
  await setDoc(
    doc(db, 'driverLocations', driverId),
    { driverId, lat, lng, updatedAt: serverTimestamp() },
    { merge: true }
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
  const ref = await addDoc(collection(db, 'schoolRegistrations'), {
    passengerId,
    ...childData,
    createdAt: serverTimestamp(),
  })
  return ref.id
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
    getDocs(collection(db, 'users')),
    getDocs(collection(db, 'trips')),
  ])
  const users     = usersSnap.docs.map(d => d.data())
  const trips     = tripsSnap.docs.map(d => d.data())
  const passengers = users.filter(u => u.role === 'passenger').length
  const drivers    = users.filter(u => u.role === 'driver').length
  const completed  = trips.filter(t => t.status === 'completed')
  const revenue    = completed.reduce((sum, t) => sum + (Number(t.priceNum) || 0), 0)

  return { passengers, drivers, trips: trips.length, revenue, schools: 48 }
}

export async function getAdminRecentTrips(count = 10) {
  const q = query(
    collection(db, 'trips'),
    orderBy('createdAt', 'desc'),
    limit(count)
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// Real-time: all trips — admin monitors
export function listenAllTrips(callback) {
  const q = query(
    collection(db, 'trips'),
    orderBy('createdAt', 'desc'),
    limit(20)
  )
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  })
}

// ═══════════════════════════════════════════════════════════════════════════
// USER PROFILE
// ═══════════════════════════════════════════════════════════════════════════

export async function updateUserProfile(uid, data) {
  await updateDoc(doc(db, 'users', uid), { ...data, updatedAt: serverTimestamp() })
}

export async function incrementUserTrips(uid) {
  await updateDoc(doc(db, 'users', uid), { trips: increment(1) })
}
