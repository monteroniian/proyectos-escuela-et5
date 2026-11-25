import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged, updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore, collection, addDoc, deleteDoc, doc, setDoc,
  onSnapshot, query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA3MyO1zA9zvKgdPeeCT0r8Qp4vBRUYwK8",
  authDomain: "notas-6b740.firebaseapp.com",
  databaseURL: "https://notas-6b740-default-rtdb.firebaseio.com",
  projectId: "notas-6b740",
  storageBucket: "notas-6b740.firebasestorage.app",
  messagingSenderId: "629921971228",
  appId: "1:629921971228:web:53ff81627307ff5e18b3d9",
  measurementId: "G-X218WLYS98"
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

  if (!name) return (errorEl.textContent = "Ingresá tu nombre.");

  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName: name });
    document.getElementById("user-name").textContent = name;

    // Registrar documento del estudiante en la colección "notas_estudiantes" de Firestore
    await setDoc(doc(db, "notas_estudiantes", user.uid), {
      nombre: name,
      email: user.email,
      seccion: "Notas de Estudiantes",
      registradoEn: serverTimestamp()
    }, { merge: true });
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

// --- NOTAS DE ESTUDIANTES ---

window.addNote = async () => {
  const title = document.getElementById("note-title").value.trim();
  const gradeRaw = document.getElementById("note-grade").value.trim();
  const body = document.getElementById("note-body").value.trim();
  const errorEl = document.getElementById("note-error");
  errorEl.textContent = "";

  if (!title && !body) {
    errorEl.textContent = "Completá la materia/título o el contenido de la nota.";
    return;
  }

  const user = auth.currentUser;
  if (!user) return;

  try {
    await setDoc(doc(db, "notas_estudiantes", user.uid), {
      nombre: user.displayName || "Estudiante",
      email: user.email,
      seccion: "Notas de Estudiantes"
    }, { merge: true });

    await addDoc(collection(db, "notas_estudiantes", user.uid, "notas"), {
      estudiante: user.displayName || "Estudiante",
      materia: title || "Sin materia",
      calificacion: gradeRaw !== "" ? Number(gradeRaw) : null,
      contenido: body,
      createdAt: serverTimestamp()
    });

    document.getElementById("note-title").value = "";
    document.getElementById("note-grade").value = "";
    document.getElementById("note-body").value = "";
  } catch (e) {
    errorEl.textContent = `No se pudo guardar la nota: ${e.message}`;
  }
};

window.deleteNote = async (id) => {
  const user = auth.currentUser;
  if (!user) return;
  await deleteDoc(doc(db, "notas_estudiantes", user.uid, "notas", id));
};

function loadNotes(uid) {
  if (unsubscribeNotes) {
    unsubscribeNotes();
    unsubscribeNotes = null;
  }

  const q = query(
    collection(db, "notas_estudiantes", uid, "notas"),
    orderBy("createdAt", "desc")
  );

  unsubscribeNotes = onSnapshot(q, (snapshot) => {
    const list = document.getElementById("notes-list");
    if (snapshot.empty) {
      list.innerHTML = '<p class="empty-msg">No hay notas de estudiantes registradas aún. ¡Agregá la primera!</p>';
      return;
    }
    list.innerHTML = snapshot.docs.map(d => {
      const data = d.data();
      const title = data.materia || data.title || "Sin título";
      const body = data.contenido || data.body || "";
      const grade = data.calificacion !== null && data.calificacion !== undefined
        ? `<span class="grade-badge">Nota: ${escapeHtml(String(data.calificacion))}</span>`
        : "";
      const date = data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString("es") : "Recién";
      return `
        <div class="note-card">
          <div class="note-content">
            <div class="note-header-row">
              <h3>${escapeHtml(title)}</h3>
              ${grade}
            </div>
            <p>${escapeHtml(body)}</p>
            <span class="note-date">${date}</span>
          </div>
          <button class="danger" onclick="deleteNote('${d.id}')">Eliminar</button>
        </div>`;
    }).join("");
  }, (err) => {
    const list = document.getElementById("notes-list");
    list.innerHTML = `<p class="error">Error cargando notas de Firebase: ${escapeHtml(err.message)}</p>`;
  });
}

// --- ESTADO DE SESIÓN ---

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("auth-section").classList.add("hidden");
    document.getElementById("app-section").classList.remove("hidden");
    document.getElementById("user-name").textContent = user.displayName || "Estudiante";
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
