// Importa os módulos necessários do Firebase SDK via CDN oficial
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    updateDoc, 
    deleteDoc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// COLOQUE AS SUAS CREDENCIAIS DO FIREBASE AQUI:
const firebaseConfig = {
    apiKey: "AIzaSyDVtostrWXcmjLq_wQ-j9MjJ2dlrhPcw2M",
    authDomain: "gym-tracker-e00bc.firebaseapp.com",
    projectId: "gym-tracker-e00bc",
    storageBucket: "gym-tracker-e00bc.firebasestorage.app",
    messagingSenderId: "406666551868",
    appId: "1:406666551868:web:edb53f96cc974e93591939"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore (Banco de Dados)
const db = getFirestore(app);

// Exporta o banco e as funções utilitárias que usaremos nos outros arquivos
export { 
    db, 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    updateDoc, 
    deleteDoc,
    query,
    orderBy 
};