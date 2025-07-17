import React, { useState, useEffect } from "react";
import { db, ref, onValue, set } from "./firebase";
import "./Display.css";
import logo from "./logo.png";

function Display() {
  const [currentSignal, setCurrentSignal] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [timestamp, setTimestamp] = useState(null);
  const [elapsedTime, setElapsedTime] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);

  // Escucha cambios de señal
  useEffect(() => {
    const signalRef = ref(db, "signal");
    onValue(signalRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCurrentSignal(data.message);
        setCurrentUser(data.user || "");
        setTimestamp(data.timestamp || null);
        if (data.user) {
          const now = Date.now();
          set(ref(db, `activeUsers/${data.user}`), now);
        }
      }
    });
  }, []);

  // Calcula tiempo transcurrido
  useEffect(() => {
    const interval = setInterval(() => {
      if (timestamp) {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        setElapsedTime(`Hace ${seconds} seg.`);
      } else {
        setElapsedTime("");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timestamp]);

  // Escucha usuarios activos
  useEffect(() => {
    const usersRef = ref(db, "activeUsers");
    const interval = setInterval(() => {
      onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        const now = Date.now();
        const active = [];
        if (data) {
          Object.entries(data).forEach(([user, lastTime]) => {
            if (now - lastTime < 5 * 60 * 1000) {
              active.push(user);
            }
          });
        }
        setActiveUsers(active);
      });
    }, 5000); // actualiza cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="display-container">
      <img src={logo} alt="Logo Odres Nuevos" className="display-logo" />
      <div className="display-message">
        {currentSignal || "Esperando señal..."}
      </div>
      {currentUser && (
        <div className="display-user">Enviado por: {currentUser}</div>
      )}
      {elapsedTime && <div className="display-time">{elapsedTime}</div>}
      {activeUsers.length > 0 && (
        <div className="display-users-list">
          Usuarios activos: {activeUsers.join(", ")}
        </div>
      )}
    </div>
  );
}

export default Display;
