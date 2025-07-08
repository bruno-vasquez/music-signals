import React, { useState, useEffect } from "react";
import { db, ref, onValue } from "./firebase";

function Display() {
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

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "10vw",
        textAlign: "center"
      }}
    >
      {currentSignal || "Esperando señal..."}
    </div>
  );
}

export default Display;
