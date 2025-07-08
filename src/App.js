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
  { text: "Abel deja afinar", emoji: "🗣️" },
  { text: "Solo Bateria", emoji: "🥁" },
  { text: "Siguiente", emoji: "🎵" },
  { text: "Revisar notas", emoji: "🔴" }
];

function App() {
  const [currentSignal, setCurrentSignal] = useState("");

  useEffect(() => {
    const signalRef = ref(db, "signal");
    onValue(signalRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCurrentSignal(data);
      }
    });
  }, []);

  const sendSignal = (signal) => {
    set(ref(db, "signal"), signal);
  };

  return (
    <div className="App">
      <h1>Enviar Señal</h1>
      {signals.map((s, i) => (
        <button
          key={i}
          onClick={() => sendSignal(`${s.emoji} ${s.text}`)}
          style={{ fontSize: "18px", margin: "5px" }}
        >
          {s.emoji} {s.text}
        </button>
      ))}

      <h2>Vista previa de la pantalla:</h2>
      <div
        style={{
          border: "2px solid black",
          padding: "20px",
          fontSize: "32px",
          marginTop: "20px"
        }}
      >
        {currentSignal || "Esperando señal..."}
      </div>
    </div>
  );
}

export default App;
