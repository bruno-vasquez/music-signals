import React, { useState, useEffect } from "react";
import { db, ref, set, onValue } from "./firebase";
import "./App.css";
import logo from "./logo.png"; // Asegúrate de tener la imagen en src/

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

  // Leer señal actual
  useEffect(() => {
    const signalRef = ref(db, "signal");
    onValue(signalRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCurrentSignal(data.message + (data.user ? ` (de: ${data.user})` : ""));
      }
    });
  }, []);

  // Registrar nombre
  const handleRegister = () => {
    if (currentUser.trim() !== "") {
      setRegisteredName(currentUser.trim());
    }
  };

  // Enviar señal predefinida
  const sendSignal = (signal) => {
    if (!registeredName) return;
    set(ref(db, "signal"), {
      message: signal,
      user: registeredName
    });
  };

  // Enviar mensaje personalizado
  const sendCustomMessage = () => {
    if (!registeredName || customMessage.trim() === "") return;
    set(ref(db, "signal"), {
      message: customMessage,
      user: registeredName
    });
    setCustomMessage("");
  };

  // Mostrar pantalla de registro
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
    </div>
  );
}

export default App;
