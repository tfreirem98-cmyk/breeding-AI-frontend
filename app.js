document.addEventListener("DOMContentLoaded", () => {
  const analyzeBtn = document.getElementById("analyze");
  const resultBox = document.getElementById("result");
  const proBox = document.getElementById("proBox");
  const proBtn = document.getElementById("pro");

  if (!analyzeBtn || !resultBox) {
    console.error("Elementos principales no encontrados");
    return;
  }

  analyzeBtn.addEventListener("click", async () => {
    resultBox.innerHTML = "Generando informe clínico…";
    if (proBox) proBox.style.display = "none";

    const raza = document.getElementById("raza").value;
    const objetivo = document.getElementById("objetivo").value;
    const consanguinidad = document.getElementById("consanguinidad").value;

    const antecedentes = Array.from(
      document.querySelectorAll(".checkbox-group input:checked")
    ).map(cb => cb.value);

    if (!raza) {
      resultBox.innerHTML =
        "<p style='color:red'>Selecciona una raza para continuar.</p>";
      return;
    }

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
        throw new Error("Error del backend");
      }

      const data = await response.json();

      const verdict = data.verdict ?? "No disponible";
      const score = data.score ?? "-";
      const analysisText =
        data.analysisText ?? "Análisis clínico no disponible.";
      const recommendation =
        data.recommendation ?? "Sin recomendación específica.";

      resultBox.innerHTML = `
        <h2>🔬 Informe clínico de viabilidad de cruce</h2>

        <p><strong>Veredicto clínico:</strong> ${verdict}</p>
        <p><strong>Índice de riesgo:</strong> ${score} / 10</p>

        <hr/>

        <div style="line-height:1.7; margin-top:20px;">
          ${analysisText.replace(/\n/g, "<br><br>")}
        </div>

        <hr/>

        <p style="margin-top:20px;">
          <strong>Recomendación final:</strong><br/>
          ${recommendation}
        </p>
      `;

    } catch (error) {
      console.error(error);
      resultBox.innerHTML =
        "<p style='color:red'>No se pudo generar el análisis. Inténtalo de nuevo.</p>";
    }
  });

  if (proBtn) {
    proBtn.addEventListener("click", () => {
      window.location.href =
        "https://breedingai-backend.onrender.com/create-checkout-session";
    });
  }
});















