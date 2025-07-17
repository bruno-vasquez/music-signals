import React, { useEffect, useState } from "react";
import { db, ref, set, onValue, onDisconnect } from "./firebase";
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
  const [currentUser, setCurrentUser] = useState("");
  const [registeredName, setRegisteredName] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [currentSignal, setCurrentSignal] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);

useEffect(() => {
  let userRef;

  if (registeredName) {
    userRef = ref(db, `activeUsers/${registeredName}`);
    set(userRef, Date.now());
    onDisconnect(userRef).remove();
  }

  const handleVisibilityChange = () => {
    if (document.hidden && userRef) {
      set(ref(db, `activeUsers/${registeredName}`), null); // Elimina si minimiza
    } else if (!document.hidden && userRef) {
      set(userRef, Date.now()); // Vuelve a aparecer si regresa
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}, [registeredName]);

  useEffect(() => {
    const signalRef = ref(db, "signal");
    onValue(signalRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCurrentSignal(data.message + (data.user ? ` (de: ${data.user})` : ""));
      }
    });

    const activeRef = ref(db, "activeUsers");
    onValue(activeRef, (snapshot) => {
      const users = snapshot.val();
      if (users) {
        const userList = Object.keys(users);
        setActiveUsers(userList);
      } else {
        setActiveUsers([]);
      }
    });
  }, []);

  const handleRegister = () => {
    if (currentUser.trim() !== "") {
      const name = currentUser.trim();
      setRegisteredName(name);

      const userRef = ref(db, `activeUsers/${name}`);
      set(userRef, Date.now());

      onDisconnect(userRef).remove();
    }
  };

  const sendSignal = (signal) => {
    if (!registeredName) return;
    set(ref(db, "signal"), {
      message: signal,
      user: registeredName,
      timestamp: Date.now()
    });
  };

  const sendCustomMessage = () => {
    if (!registeredName || customMessage.trim() === "") return;
    set(ref(db, "signal"), {
      message: customMessage,
      user: registeredName,
      timestamp: Date.now()
    });
    setCustomMessage("");
  };

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

      <h2>Usuarios conectados:</h2>
      <div style={{ marginTop: "10px", color: "#6A2C1A" }}>
        {activeUsers.length > 0 ? activeUsers.join(", ") : "Ninguno conectado"}
      </div>
    </div>
  );
}

export default App;
