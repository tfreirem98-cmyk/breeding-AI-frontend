const analyzeBtn = document.getElementById("analyze");
const resultBox = document.getElementById("result");

analyzeBtn.addEventListener("click", async () => {
  const raza = document.getElementById("raza").value;
  const objetivo = document.getElementById("objetivo").value;
  const consanguinidad = document.getElementById("consanguinidad").value;

  const antecedentes = Array.from(
    document.querySelectorAll(".checkbox-group input:checked")
  ).map(cb => cb.value);

  if (!raza || !objetivo || !consanguinidad) {
    alert("Por favor, completa todos los campos del formulario.");
    return;
  }

  resultBox.classList.remove("hidden");
  resultBox.innerHTML = "<p>Generando informe clínico...</p>";

  try {
    const response = await fetch("https://breedingai-backend.onrender.com/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        raza,
        objetivo,
        consanguinidad,
        antecedentes
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Error en el análisis");
    }

    resultBox.innerHTML = `
      <div class="report-card">
        <h2>🧬 Informe clínico de viabilidad de cruce</h2>

        <div class="report-summary">
          <strong>Veredicto clínico:</strong> ${data.verdict}<br>
          <strong>Índice de riesgo:</strong> ${data.score} / 10
        </div>

        <div class="report-section">
          <h3>📋 Resumen ejecutivo</h3>
          <p>${data.summary}</p>
        </div>

        <div class="report-section">
          <h3>🧠 Evaluación clínica detallada</h3>
          <p>${data.analysis}</p>
        </div>

        <div class="report-section">
          <h3>✅ Recomendación clínica final</h3>
          <p>${data.recommendation}</p>
        </div>
      </div>
    `;

  } catch (error) {
    resultBox.innerHTML = `
      <p class="error">
        No se pudo generar el análisis. Inténtalo de nuevo.
      </p>
    `;
  }
});












