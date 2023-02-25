import { initializeApp } from 'firebase/app'
import { getAuth } from "firebase/auth"

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWU0RsDo2zEPsNWC6EoegPsenG6YZgUY4",
  authDomain: "safy-auto-d1d9c.firebaseapp.com",
  projectId: "safy-auto-d1d9c",
  storageBucket: "safy-auto-d1d9c.appspot.com",
  messagingSenderId: "160282856552",
  appId: "1:160282856552:web:18712b4961337a0da13fdd",
  measurementId: "G-WQB3F576WT"
}

const app = initializeApp(firebaseConfig)
export const firebaseAuth = getAuth(app)
