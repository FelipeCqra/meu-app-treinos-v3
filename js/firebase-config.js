// 1. Todas as importações no topo
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 2. Credenciais
const firebaseConfig = {
  apiKey: "AIzaSyDVtostrWXcmjLq_wQ-j9MjJ2dlrhPcw2M",
  authDomain: "gym-tracker-e00bc.firebaseapp.com",
  projectId: "gym-tracker-e00bc",
  storageBucket: "gym-tracker-e00bc.firebasestorage.app",
  messagingSenderId: "406666551868",
  appId: "1:406666551868:web:edb53f96cc974e93591939",
};

// 3. Inicializações (Nesta ordem exata)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 4. Exportações
export {
  db,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  auth,
};
