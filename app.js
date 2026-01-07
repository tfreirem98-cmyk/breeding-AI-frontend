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

    resultBox.innerHTML = `
      <h2>🧬 Informe clínico de viabilidad de cruce</h2>

      <p><strong>Veredicto clínico:</strong> ${data.veredicto_clinico ?? "No disponible"}</p>
      <p><strong>Índice de riesgo:</strong> ${data.indice_riesgo ?? "-"} / 10</p>

      <hr />

      <h3>📋 Resumen ejecutivo</h3>
      <p>${data.resumen_ejecutivo ?? "No disponible."}</p>

      <h3>🧠 Perfil genético de la raza</h3>
      <p>${data.perfil_genetico_raza ?? "No disponible."}</p>

      <h3>🔗 Impacto de la consanguinidad</h3>
      <p>${data.impacto_consanguinidad ?? "No disponible."}</p>

      <h3>⚠️ Evaluación de antecedentes</h3>
      <p>${data.evaluacion_antecedentes ?? "No disponible."}</p>

      <h3>🧪 Recomendación clínica final</h3>
      <p>${data.recomendacion_clinica_final ?? "No disponible."}</p>
    `;
  } catch (err) {
    console.error(err);
    resultBox.innerHTML =
      "<p style='color:red'>No se pudo generar el análisis. Inténtalo de nuevo.</p>";
  }
});
















