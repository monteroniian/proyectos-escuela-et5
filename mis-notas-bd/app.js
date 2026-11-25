import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged, updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore, collection, addDoc, updateDoc, deleteDoc, doc,
  onSnapshot, serverTimestamp
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
let notesCache = new Map();

function isProfesorUser(user) {
  return Boolean(user && user.email && /^profesor@/i.test(user.email.trim()));
}

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

// --- NOTAS DE ESTUDIANTES (COLECCIÓN COMPARTIDA) ---

window.saveNote = async () => {
  const user = auth.currentUser;
  const errorEl = document.getElementById("note-error");
  errorEl.textContent = "";

  if (!isProfesorUser(user)) {
    errorEl.textContent = "Solo una cuenta con correo profesor@... puede modificar notas.";
    return;
  }

  const editingId = document.getElementById("editing-note-id").value.trim();
  const estudiante = document.getElementById("note-student").value.trim();
  const materia = document.getElementById("note-title").value.trim();
  const gradeRaw = document.getElementById("note-grade").value.trim();
  const observacion = document.getElementById("note-body").value.trim();

  if (!estudiante || !materia) {
    errorEl.textContent = "Completá el nombre del estudiante y la materia.";
    return;
  }

  const payload = {
    estudiante,
    materia,
    calificacion: gradeRaw !== "" ? Number(gradeRaw) : null,
    observacion,
    updatedAt: serverTimestamp(),
    updatedBy: user.email
  };

  try {
    if (editingId) {
      await updateDoc(doc(db, "notas_estudiantes", editingId), payload);
    } else {
      await addDoc(collection(db, "notas_estudiantes"), {
        ...payload,
        createdAt: serverTimestamp()
      });
    }
    window.cancelEdit();
  } catch (e) {
    errorEl.textContent = `No se pudo guardar: ${e.message}`;
  }
};

window.startEditNote = (id) => {
  const data = notesCache.get(id);
  if (!data) return;

  document.getElementById("editing-note-id").value = id;
  document.getElementById("note-student").value = data.estudiante || data.alumno || data.nombre || "";
  document.getElementById("note-title").value = data.materia || data.title || "";
  const grade = data.calificacion ?? data.nota ?? "";
  document.getElementById("note-grade").value = grade !== null ? grade : "";
  document.getElementById("note-body").value = data.observacion || data.contenido || data.body || "";

  document.getElementById("form-heading").textContent = "Modificar nota de estudiante";
  document.getElementById("btn-save-note").textContent = "Guardar cambios";
  document.getElementById("btn-cancel-edit").classList.remove("hidden");
  document.getElementById("note-error").textContent = "";
  document.getElementById("note-student").focus();
};

window.cancelEdit = () => {
  document.getElementById("editing-note-id").value = "";
  document.getElementById("note-student").value = "";
  document.getElementById("note-title").value = "";
  document.getElementById("note-grade").value = "";
  document.getElementById("note-body").value = "";
  document.getElementById("form-heading").textContent = "Agregar nota de estudiante";
  document.getElementById("btn-save-note").textContent = "Guardar nota";
  document.getElementById("btn-cancel-edit").classList.add("hidden");
  document.getElementById("note-error").textContent = "";
};

window.deleteNote = async (id) => {
  const user = auth.currentUser;
  if (!isProfesorUser(user)) return;
  try {
    await deleteDoc(doc(db, "notas_estudiantes", id));
    if (document.getElementById("editing-note-id").value === id) {
      window.cancelEdit();
    }
  } catch (e) {
    document.getElementById("note-error").textContent = `No se pudo eliminar: ${e.message}`;
  }
};

function loadNotes(canEdit) {
  if (unsubscribeNotes) {
    unsubscribeNotes();
    unsubscribeNotes = null;
  }

  const colRef = collection(db, "notas_estudiantes");

  unsubscribeNotes = onSnapshot(colRef, (snapshot) => {
    const list = document.getElementById("notes-list");
    notesCache.clear();

    if (snapshot.empty) {
      list.innerHTML = canEdit
        ? '<p class="empty-msg">No hay notas registradas aún. Agregá la primera arriba.</p>'
        : '<p class="empty-msg">Todavía no hay notas de estudiantes cargadas en la base de datos.</p>';
      return;
    }

    const docs = snapshot.docs.map(d => ({ id: d.id, data: d.data() }));
    docs.sort((a, b) => {
      const ta = a.data.updatedAt?.seconds || a.data.createdAt?.seconds || 0;
      const tb = b.data.updatedAt?.seconds || b.data.createdAt?.seconds || 0;
      return tb - ta;
    });

    list.innerHTML = docs.map(({ id, data }) => {
      notesCache.set(id, data);
      const student = data.estudiante || data.alumno || data.nombre || "Estudiante";
      const subject = data.materia || data.title || "General";
      const obs = data.observacion || data.contenido || data.body || "";
      const gradeVal = data.calificacion ?? data.nota;
      const gradeHtml = gradeVal !== null && gradeVal !== undefined && gradeVal !== ""
        ? `<span class="grade-badge">Nota: ${escapeHtml(String(gradeVal))}</span>`
        : "";
      const ts = data.updatedAt || data.createdAt;
      const date = ts?.seconds ? new Date(ts.seconds * 1000).toLocaleDateString("es") : "";

      const actionsHtml = canEdit
        ? `<div class="note-actions">
             <button class="secondary small" onclick="startEditNote('${id}')">Editar</button>
             <button class="danger" onclick="deleteNote('${id}')">Eliminar</button>
           </div>`
        : "";

      return `
        <div class="note-card">
          <div class="note-content">
            <div class="note-header-row">
              <h3>${escapeHtml(student)}</h3>
              <span class="subject-badge">${escapeHtml(subject)}</span>
              ${gradeHtml}
            </div>
            ${obs ? `<p>${escapeHtml(obs)}</p>` : ""}
            ${date ? `<span class="note-date">Actualizado: ${date}</span>` : ""}
          </div>
          ${actionsHtml}
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
    const isProf = isProfesorUser(user);
    document.getElementById("auth-section").classList.add("hidden");
    document.getElementById("app-section").classList.remove("hidden");
    document.getElementById("user-name").textContent = user.displayName || (isProf ? "Profesor" : "Estudiante");
    document.getElementById("user-email").textContent = user.email;

    const badge = document.getElementById("user-role-badge");
    badge.textContent = isProf ? "Profesor (Edición)" : "Estudiante (Solo lectura)";
    badge.className = isProf ? "role-badge professor" : "role-badge student";

    document.getElementById("professor-panel").classList.toggle("hidden", !isProf);
    if (!isProf) window.cancelEdit();

    loadNotes(isProf);
  } else {
    document.getElementById("auth-section").classList.remove("hidden");
    document.getElementById("app-section").classList.add("hidden");
    document.getElementById("notes-list").innerHTML = "";
    notesCache.clear();
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
