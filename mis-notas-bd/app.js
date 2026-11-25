import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged, updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore, collection, addDoc, deleteDoc, doc,
  onSnapshot, query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA3MyO1zA9zvKgdPeeCT0r8Qp4vBRUYwK8",
  authDomain: "notas-6b740.firebaseapp.com",
  projectId: "notas-6b740",
  storageBucket: "notas-6b740.firebasestorage.app",
  messagingSenderId: "629921971228",
  appId: "1:629921971228:web:53ff81627307ff5e18b3d9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let unsubscribeNotes = null;

// --- AUTH ---

window.register = async () => {
  const name = document.getElementById("auth-name").value.trim();
  const email = document.getElementById("auth-email").value.trim();
  const password = document.getElementById("auth-password").value;
  const errorEl = document.getElementById("auth-error");
  errorEl.textContent = "";

  if (!name) return (errorEl.textContent = "Ingresa tu nombre.");

  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName: name });
  } catch (e) {
    errorEl.textContent = translateError(e.code);
  }
};

window.login = async () => {
  const email = document.getElementById("auth-email").value.trim();
  const password = document.getElementById("auth-password").value;
  const errorEl = document.getElementById("auth-error");
  errorEl.textContent = "";

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    errorEl.textContent = translateError(e.code);
  }
};

window.logout = () => signOut(auth);

// --- NOTAS ---

window.addNote = async () => {
  const title = document.getElementById("note-title").value.trim();
  const body = document.getElementById("note-body").value.trim();
  if (!title && !body) return;

  const user = auth.currentUser;
  await addDoc(collection(db, "users", user.uid, "notes"), {
    title,
    body,
    createdAt: serverTimestamp()
  });

  document.getElementById("note-title").value = "";
  document.getElementById("note-body").value = "";
};

window.deleteNote = async (id) => {
  const user = auth.currentUser;
  await deleteDoc(doc(db, "users", user.uid, "notes", id));
};

function loadNotes(uid) {
  const q = query(collection(db, "users", uid, "notes"), orderBy("createdAt", "desc"));
  unsubscribeNotes = onSnapshot(q, (snapshot) => {
    const list = document.getElementById("notes-list");
    if (snapshot.empty) {
      list.innerHTML = '<p class="empty-msg">No tienes notas aún. ¡Agrega una!</p>';
      return;
    }
    list.innerHTML = snapshot.docs.map(d => {
      const { title, body, createdAt } = d.data();
      const date = createdAt ? new Date(createdAt.seconds * 1000).toLocaleDateString("es") : "";
      return `
        <div class="note-card">
          <div class="note-content">
            <h3>${escapeHtml(title)}</h3>
            <p>${escapeHtml(body)}</p>
            <span class="note-date">${date}</span>
          </div>
          <button class="danger" onclick="deleteNote('${d.id}')">Eliminar</button>
        </div>`;
    }).join("");
  });
}

// --- ESTADO DE SESIÓN ---

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("auth-section").classList.add("hidden");
    document.getElementById("app-section").classList.remove("hidden");
    document.getElementById("user-name").textContent = user.displayName || "Usuario";
    document.getElementById("user-email").textContent = user.email;
    loadNotes(user.uid);
  } else {
    document.getElementById("auth-section").classList.remove("hidden");
    document.getElementById("app-section").classList.add("hidden");
    document.getElementById("notes-list").innerHTML = "";
    if (unsubscribeNotes) { unsubscribeNotes(); unsubscribeNotes = null; }
  }
});

// --- HELPERS ---

function escapeHtml(str = "") {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function translateError(code) {
  const map = {
    "auth/email-already-in-use": "Este correo ya está registrado.",
    "auth/invalid-email": "Correo inválido.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/user-not-found": "Usuario no encontrado.",
    "auth/wrong-password": "Contraseña incorrecta.",
    "auth/invalid-credential": "Correo o contraseña incorrectos.",
  };
  return map[code] || `Error: ${code}`;
}
