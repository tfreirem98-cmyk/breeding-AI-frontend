const form = document.getElementById("analysis-form");
const resultContainer = document.getElementById("analysis-result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  console.log("▶ Enviando análisis...");

  resultContainer.innerHTML = "<p>Generando análisis...</p>";

  const raza = document.getElementById("raza").value;
  const objetivo = document.getElementById("objetivo").value;
  const consanguinidad = document.getElementById("consanguinidad").value;

  const antecedentes = Array.from(
    document.querySelectorAll("input[name='antecedentes']:checked")
  ).map((el) => el.value);

  try {
    const response = await fetch(
      "https://breedingai-backend.onrender.com/analyze",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          raza,
          objetivo,
          consanguinidad,
          antecedentes,
        }),
      }
    );

    const data = await response.json();
    console.log("✔ Resultado recibido:", data);

    if (!data.ok) {
      throw new Error("Respuesta inválida del servidor");
    }

    const r = data.resultado;

    resultContainer.innerHTML = `
      <div class="resultado-card">
        <h3>${r.clasificacion}</h3>

        <div class="metricas">
          <div>
            <strong>Compatibilidad genética</strong>
            <span>${r.compatibilidad} / 10</span>
          </div>
          <div>
            <strong>Riesgo hereditario</strong>
            <span>${r.riesgo} / 10</span>
          </div>
          <div>
            <strong>Adecuación al objetivo</strong>
            <span>${r.adecuacion} / 10</span>
          </div>
        </div>

        <div class="recomendacion">
          <strong>Recomendación profesional</strong>
          <p>${r.recomendacion}</p>
        </div>
      </div>
    `;
  } catch (error) {
    console.error("❌ Error al generar análisis:", error);
    resultContainer.innerHTML =
      "<p style='color:red'>Error al generar el análisis. Inténtalo de nuevo.</p>";
  }
});




