document.addEventListener("DOMContentLoaded", () => {
  const analyzeBtn = document.getElementById("analyze");
  const resultBox = document.getElementById("result");
  const proBox = document.getElementById("proBox");

  if (!analyzeBtn || !resultBox) {
    console.error("Botón o contenedor de resultados no encontrado");
    return;
  }

  analyzeBtn.addEventListener("click", async () => {
    resultBox.innerHTML = "Analizando…";
    proBox.style.display = "none";

    const raza = document.getElementById("raza").value;
    const objetivo = document.getElementById("objetivo").value;
    const consanguinidad = document.getElementById("consanguinidad").value;

    const antecedentes = Array.from(
      document.querySelectorAll(".checkbox-group input:checked")
    ).map(cb => cb.value);

    try {
      const response = await fetch(
        "https://breedingai-backend.onrender.com/analyze",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            raza,
            objetivo,
            consanguinidad,
            antecedentes
          })
        }
      );

      if (!response.ok) {
        throw new Error("Backend error");
      }

      const data = await response.json();

      // 🔑 MAPEO CORRECTO DE CLAVES (ESTA ERA LA CLAVE)
      const verdict = data.verdict ?? "No disponible";
      const score = data.score ?? "-";
      const factors = data.factors ?? [];
      const alerts = data.alerts ?? [];
      const recommendation = data.recommendation ?? "No disponible";

resultBox.innerHTML = `
  <h2>🔬 Informe clínico de viabilidad de cruce</h2>

  <section>
    <h3>1️⃣ Resumen ejecutivo</h3>
    <p>
      El cruce evaluado presenta un <strong>${verdict}</strong>,
      con un índice de riesgo estimado de <strong>${score}/10</strong>.
      ${recommendation}
    </p>
  </section>

  <section>
    <h3>2️⃣ Índice de riesgo global</h3>
    <p>
      Clasificación clínica: <strong>${verdict}</strong><br/>
      Escala de riesgo utilizada: 0 (mínimo) – 10 (crítico).
    </p>
  </section>

  <section>
    <h3>3️⃣ Factores genéticos y técnicos evaluados</h3>
    <ul>
      ${factors.map(f => `<li>${f}</li>`).join("")}
    </ul>
  </section>

  <section>
    <h3>4️⃣ Alertas clínicas relevantes</h3>
    <ul>
      ${alerts.length
        ? alerts.map(a => `<li>${a}</li>`).join("")
        : "<li>No se han detectado alertas clínicas relevantes.</li>"
      }
    </ul>
  </section>

  <section>
    <h3>5️⃣ Recomendación profesional final</h3>
    <p><strong>${recommendation}</strong></p>
  </section>

  <section style="margin-top:20px; font-size:14px; color:#475569;">
    Este informe es orientativo y está diseñado para apoyar decisiones
    responsables de cría desde un punto de vista técnico, genético y ético.
  </section>
`;


      // Mostrar CTA PRO si backend lo decide más adelante
      if (data.limitReached) {
        proBox.style.display = "block";
      }

    } catch (err) {
      console.error(err);
      resultBox.innerHTML =
        "<p style='color:red'>No se pudo generar el análisis. Inténtalo de nuevo.</p>";
    }
  });

  const proBtn = document.getElementById("pro");
  if (proBtn) {
    proBtn.addEventListener("click", () => {
      window.location.href =
        "https://breedingai-backend.onrender.com/create-checkout-session";
    });
  }
});
















