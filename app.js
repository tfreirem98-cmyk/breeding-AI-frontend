document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("analysisForm");
  const resultSection = document.getElementById("result");

  const verdictBadge = document.getElementById("verdictBadge");
  const riskScoreEl = document.getElementById("riskScore");
  const analysisTextEl = document.getElementById("analysisText");
  const recommendationTextEl = document.getElementById("recommendationText");

  if (!form || !resultSection) {
    console.error("Formulario o sección de resultados no encontrada");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Mostrar estado de carga
    resultSection.style.display = "block";
    verdictBadge.textContent = "ANALIZANDO...";
    verdictBadge.className = "badge moderate";
    riskScoreEl.textContent = "-";
    analysisTextEl.textContent = "Procesando datos del cruce...";
    recommendationTextEl.textContent = "";

    // Recoger datos del formulario
    const breed = document.getElementById("breed").value;
    const goal = document.getElementById("goal").value;
    const inbreeding = document.getElementById("consanguinity").value;

    const conditions = Array.from(
      document.querySelectorAll("input[name='conditions']:checked")
    ).map((c) => c.value);

    try {
      const response = await fetch(
        "https://breedingai-backend.onrender.com/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            breed,
            goal,
            inbreeding,
            conditions,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await response.json();

      // Ajustar badge según veredicto
      let badgeClass = "badge moderate";
      if (data.verdict === "APTO") badgeClass = "badge low";
      if (data.verdict === "NO RECOMENDADO") badgeClass = "badge high";

      verdictBadge.className = badgeClass;
      verdictBadge.textContent = data.verdict;

      riskScoreEl.textContent = data.riskScore;

      analysisTextEl.textContent = data.explanation;
      recommendationTextEl.textContent = data.recommendations;

    } catch (error) {
      console.error(error);

      verdictBadge.className = "badge high";
      verdictBadge.textContent = "ERROR";

      analysisTextEl.textContent =
        "No se pudo realizar el análisis en este momento.";
      recommendationTextEl.textContent =
        "Comprueba tu conexión o inténtalo más tarde.";
    }
  });
});






