const analyzeBtn = document.getElementById("analyze");
const resultBox = document.getElementById("result");
const proBox = document.getElementById("proBox");

analyzeBtn.addEventListener("click", async () => {
  resultBox.innerHTML = "Generando informe clínico…";
  proBox.style.display = "none";

  const raza = document.getElementById("raza").value;
  const objetivo = document.getElementById("objetivo").value;
  const consanguinidad = document.getElementById("consanguinidad").value;

  const antecedentes = Array.from(
    document.querySelectorAll(".checkbox-group input:checked")
  ).map(el => el.value);

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

    const rawData = await response.json();

    // 🔑 CLAVE: normalizamos la respuesta
    const data = rawData.analysis ? rawData.analysis : rawData;

result.innerHTML = `
  <div class="clinic-header">
    <span>🧬</span>
    <h2>Informe clínico de viabilidad de cruce</h2>
  </div>

  <div class="verdict-box">
    <div class="verdict">
      Veredicto clínico: ${data.verdict}
    </div>
    <div class="score">
      Índice de riesgo: ${data.score} / 10
    </div>
  </div>

  <div class="executive-summary">
    <h3>📋 Resumen ejecutivo</h3>
    <p>${data.summary}</p>
  </div>

  <div class="report-grid">
    <div class="report-card">
      <h4>🧠 Perfil genético de la raza</h4>
      <p>${data.breedProfile}</p>
    </div>

    <div class="report-card">
      <h4>🧬 Impacto de la consanguinidad</h4>
      <p>${data.consanguinityImpact}</p>
    </div>

    <div class="report-card">
      <h4>⚠️ Evaluación de antecedentes</h4>
      <p>${data.backgroundRisks}</p>
    </div>

    <div class="report-card">
      <h4>📊 Evaluación global</h4>
      <p>${data.globalAssessment}</p>
    </div>
  </div>

  <div class="final-recommendation">
    <h3>✅ Recomendación clínica final</h3>
    <p>${data.recommendation}</p>
  </div>
`;

  } catch (err) {
    console.error(err);
    resultBox.innerHTML =
      "<p style='color:red'>No se pudo generar el análisis. Inténtalo de nuevo.</p>";
  }
});

















