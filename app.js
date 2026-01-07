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
        <h2>Resultado del análisis</h2>

        <p><strong>Veredicto:</strong> ${verdict}</p>
        <p><strong>Puntuación:</strong> ${score}</p>

        <h4>Factores considerados</h4>
        <ul>
          ${factors.map(f => `<li>${f}</li>`).join("") || "<li>No especificados</li>"}
        </ul>

        <h4>Alertas relevantes</h4>
        <ul>
          ${alerts.map(a => `<li>${a}</li>`).join("") || "<li>Ninguna</li>"}
        </ul>

        <p><strong>Recomendación:</strong> ${recommendation}</p>
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















