import React, { useState, useEffect } from "react";
import { db, ref, set, onValue } from "./firebase";
import "./App.css";

const signals = [
  { text: "Repetir", emoji: "🔁" },
  { text: "Subir Intensidad", emoji: "🔊" },
  { text: "Bajar Intensidad", emoji: "🔉" },
  { text: "Silencio", emoji: "✋" },
  { text: "Continuar", emoji: "🟢" },
  { text: "Improvisar", emoji: "🎵" },
  { text: "Solo Bateria", emoji: "🥁" },
  { text: "Siguiente", emoji: "🎵" },
  { text: "Revisar notas", emoji: "🔴" },
  { text: "Abel deja afinar", emoji: "🗣️" }
];

function App() {
  const [currentSignal, setCurrentSignal] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [registeredName, setRegisteredName] = useState("");

  useEffect(() => {
    const signalRef = ref(db, "signal");
    onValue(signalRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCurrentSignal(data.message + (data.user ? ` (de: ${data.user})` : ""));
      }
    });
  }, []);

  const handleRegister = () => {
    if (currentUser.trim() !== "") {
      setRegisteredName(currentUser.trim());
    }
  };

  const sendSignal = (signal) => {
    if (!registeredName) return;
    set(ref(db, "signal"), {
      message: signal,
      user: registeredName
    });
  };

  const sendCustomMessage = () => {
    if (!registeredName || customMessage.trim() === "") return;
    set(ref(db, "signal"), {
      message: customMessage,
      user: registeredName
    });
    setCustomMessage("");
  };

  if (!registeredName) {
    return (
      <div className="App">
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
    </div>
  );
}

export default App;
