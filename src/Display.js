import React, { useState, useEffect } from "react";
import { db, ref, onValue } from "./firebase";
import "./App.css";

function Display() {
  const [currentSignal, setCurrentSignal] = useState("");
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    const signalRef = ref(db, "signal");
    onValue(signalRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCurrentSignal(data.message);
        setCurrentUser(data.user || "");
      }
    });
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "5vw",
        textAlign: "center"
      }}
    >
      <div>{currentSignal || "Esperando señal..."}</div>
      {currentUser && (
        <div style={{ fontSize: "2vw", marginTop: "20px" }}>Enviado por: {currentUser}</div>
      )}
    </div>
  );
}

export default Display;
