import React, { useState, useEffect } from "react";
import { db, ref, onValue, set } from "./firebase";
import logo from "./logo.png";
import "./Display.css";

function Display() {
  const [currentSignal, setCurrentSignal] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [timeSince, setTimeSince] = useState(0);
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    const signalRef = ref(db, "signal");

    const unsubscribeSignal = onValue(signalRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCurrentSignal(data.message);
        setCurrentUser(data.user || "");
        setTimeSince(0);
      } else {
        setCurrentSignal("");
        setCurrentUser("");
        setTimeSince(0);
      }
    });

    const usersRef = ref(db, "activeUsers");
    const unsubscribeUsers = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      setActiveUsers(data ? Object.keys(data) : []);
    });

    const timer = setInterval(() => {
      setTimeSince((prev) => {
        const next = prev + 1;
        if (next >= 180) {
          set(ref(db, "signal"), null); // Borrar después de 3 minutos
        }
        return next;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      unsubscribeSignal();
      unsubscribeUsers();
    };
  }, []);

  return (
    <div className="display-container">
      <img src={logo} alt="Logo" className="display-logo" />
      <div className="display-message">{currentSignal || "Esperando señal..."}</div>
      {currentUser && <div className="display-user">Enviado por: {currentUser}</div>}
      {currentSignal && <div className="display-time">Hace {timeSince} seg.</div>}
      <div className="display-users-list">
        {activeUsers.length > 0
          ? `Usuarios activos: ${activeUsers.join(", ")}`
          : "Ninguno conectado"}
      </div>
    </div>
  );
}

export default Display;
