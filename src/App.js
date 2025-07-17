import React, { useState, useEffect } from "react";
import {
  db,
  ref,
  set,
  onValue,
  remove,
  onDisconnect
} from "./firebase";
import "./App.css";
import logo from "./logo.png";

const signals = [
  { text: "Repetir", emoji: "🔁" },
  { text: "Subir Intensidad", emoji: "🔊" },
  { text: "Bajar Intensidad", emoji: "🔉" },
  { text: "Silencio", emoji: "✋" },
  { text: "Siguiente", emoji: "⏭️" },
  { text: "Continuar", emoji: "🟢" },
  { text: "Revisar notas", emoji: "🔴" },
  { text: "Solo Bateria", emoji: "🥁" },
  { text: "Solo Guitarra", emoji: "🎸" },
  { text: "Solo Violín", emoji: "🎻" }
];

function App() {
  const [currentSignal, setCurrentSignal] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [registeredName, setRegisteredName] = useState("");
  const [usersOnline, setUsersOnline] = useState([]);

  // Leer señal actual
  useEffect(() => {
    const signalRef = ref(db, "signal");
    onValue(signalRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCurrentSignal(data.message + (data.user ? ` (de: ${data.user})` : ""));
      } else {
        setCurrentSignal("Esperando señal...");
      }
    });
  }, []);

  // Leer usuarios conectados
  useEffect(() => {
    const usersRef = ref(db, "users_online");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const names = Object.keys(data);
        setUsersOnline(names);
      } else {
        setUsersOnline([]);
      }
    });
  }, []);

  // Registrar nombre
  const handleRegister = () => {
    if (currentUser.trim() !== "") {
      setRegisteredName(currentUser.trim());
    }
  };

  // Manejar presencia del usuario
  useEffect(() => {
    if (!registeredName) return;

    const userRef = ref(db, `users_online/${registeredName}`);
    const presenceRef = onDisconnect(userRef);

    // Registrar al conectarse
    set(userRef, {
      timestamp: Date.now()
    });

    // Eliminar automáticamente si cierra o recarga
    presenceRef.remove();

    // Detectar si pierde el foco (cambia de pestaña o minimiza)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        remove(userRef);
      } else {
        set(userRef, {
          timestamp: Date.now()
        });
        onDisconnect(userRef).remove();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [registeredName]);

  // Enviar señal predefinida
  const sendSignal = (signal) => {
    if (!registeredName) return;
    set(ref(db, "signal"), {
      message: signal,
      user: registeredName,
      timestamp: Date.now()
    });
  };

  // Enviar mensaje personalizado
  const sendCustomMessage = () => {
    if (!registeredName || customMessage.trim() === "") return;
    set(ref(db, "signal"), {
      message: customMessage,
      user: registeredName,
      timestamp: Date.now()
    });
    setCustomMessage("");
  };

  // Pantalla de registro
  if (!registeredName) {
    return (
      <div className="App">
        <img src={logo} alt="Logo Odres Nuevos" className="logo-img" />
        <h1>Regístrate</h1>
        <input
          type="text"
          value={currentUser}
          onChange={(e) => setCurrentUser(e.target.value)}
          placeholder="Escribe tu nombre..."
          className="custom-input"
        />
        <button onClick={handleRegister} className="send-button">
          Ingresar
        </button>
      </div>
    );
  }

  // Pantalla principal
  return (
    <div className="App">
      <img src={logo} alt="Logo Odres Nuevos" className="logo-img" />
      <h1>Enviar Señal (Hola, {registeredName}!)</h1>

      <div className="buttons-container">
        {signals.map((s, i) => (
          <button
            key={i}
            onClick={() => sendSignal(`${s.emoji} ${s.text}`)}
            className="signal-button"
          >
            {s.emoji} {s.text}
          </button>
        ))}
      </div>

      <h2>Mensaje personalizado:</h2>
      <input
        type="text"
        value={customMessage}
        onChange={(e) => setCustomMessage(e.target.value)}
        placeholder="Escribe tu mensaje..."
        className="custom-input"
      />
      <button onClick={sendCustomMessage} className="send-button">
        Enviar
      </button>

      <h2>Vista previa de la pantalla:</h2>
      <div className="preview-box">
        {currentSignal || "Esperando señal..."}
      </div>

      {usersOnline.length > 0 && (
        <div style={{ marginTop: "20px", color: "#6A2C1A" }}>
          <strong>Usuarios activos:</strong> {usersOnline.join(", ")}
        </div>
      )}
    </div>
  );
}

export default App;
