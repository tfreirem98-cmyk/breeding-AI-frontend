import React, { useState } from "react";

const API_URL = "https://breedingai-backend.onrender.com";

function App() {
  const [raza, setRaza] = useState("Border Collie");
  const [objetivo, setObjetivo] = useState("Salud");
  const [consanguinidad, setConsanguinidad] = useState("Baja");
  const [antecedentes, setAntecedentes] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");

  const toggleAntecedente = (value) => {
    setAntecedentes((prev) =>
      prev.includes(value)
        ? prev.filter((a) => a !== value)
        : [...prev, value]
    );
  };

  const analizar = async () => {
    setError("");
    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raza,
          objetivo,
          consanguinidad,
          antecedentes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al analizar");
        return;
      }

      setResultado(data);
    } catch (err) {
      setError("No se pudo conectar con el servidor");
    }
  };

  const irAPro = async () => {
    const res = await fetch(`${API_URL}/create-checkout-session`);
    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <div className="app-container">
      <h1>Análisis profesional de cruce</h1>
      <p className="subtitle">
        3 análisis gratuitos · Informes profesionales con IA en PRO
      </p>

      <div className="card">
        <label>Raza</label>
        <select value={raza} onChange={(e) => setRaza(e.target.value)}>
          <option>Border Collie</option>
          <option>Golden Retriever</option>
          <option>Labrador Retriever</option>
          <option>Pastor Alemán</option>
          <option>Bulldog Inglés</option>
        </select>

        <label>Objetivo de cría</label>
        <select value={objetivo} onChange={(e) => setObjetivo(e.target.value)}>
          <option>Salud</option>
          <option>Trabajo</option>
          <option>Belleza</option>
        </select>

        <label>Consanguinidad</label>
        <select
          value={consanguinidad}
          onChange={(e) => setConsanguinidad(e.target.value)}
        >
          <option>Baja</option>
          <option>Media</option>
          <option>Alta</option>
        </select>

        <label>Antecedentes conocidos</label>
        <div className="checkbox-group">
          {["Displasia", "Oculares", "Respiratorios", "Neurológicos"].map(
            (a) => (
              <label key={a}>
                <input
                  type="checkbox"
                  checked={antecedentes.includes(a)}
                  onChange={() => toggleAntecedente(a)}
                />
                {a}
              </label>
            )
          )}
        </div>

        <button className="primary-btn" onClick={analizar}>
          Generar análisis
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {resultado && (
        <div className="result-card">
          <h2>Resultado del análisis</h2>

          <div className={`badge ${resultado.riesgo.toLowerCase()}`}>
            Riesgo {resultado.riesgo}
          </div>

          <p>
            <strong>Puntuación:</strong> {resultado.score}/10
          </p>

          <p className="section-title">Resumen profesional</p>
          <p>{resultado.resumen}</p>

          <p className="section-title">Diagnóstico técnico</p>
          <p>{resultado.diagnostico}</p>

          {resultado.riesgos.length > 0 && (
            <>
              <p className="section-title">Riesgos identificados</p>
              <ul>
                {resultado.riesgos.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </>
          )}

          <p className="section-title">Recomendación</p>
          <p>{resultado.recomendacion}</p>

          <p className="nota">{resultado.notaProfesional}</p>

          {resultado.usosRestantes === 0 && (
            <div className="pro-box">
              <h3>Has alcanzado el límite gratuito</h3>
              <p>
                Desbloquea análisis ilimitados, informes avanzados, historial y
                soporte profesional.
              </p>
              <button className="pro-btn" onClick={irAPro}>
                Pasar a PRO · 5€/mes
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;







