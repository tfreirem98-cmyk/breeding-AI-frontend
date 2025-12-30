document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("analysisForm");
  const resultSection = document.getElementById("result");

  if (!form) {
    console.error("❌ No se encontró el formulario analysisForm");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    console.log("▶️ Enviando análisis...");

    const raza = document.getElementById("raza")?.value;
    const objetivo = document.getElementById("objetivo")?.value;
    const consanguinidad = document.getElementById("consanguinidad")?.value;

    const antecedentes = Array.from(
      document.querySelectorAll(".checkbox-group input:checked")
    ).map(cb => cb.value);

    if (!raza || !objetivo || !consanguinidad) {
      alert("Por favor, completa todos los campos obligatorios.");
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
        throw new Error("Error en la respuesta del servidor");
      }

      const data = await response.json();
      console.log("✅ Resultado recibido:", data);

      document.getElementById("classification").textContent =
        data.classification;

      document.getElementById("riskScore").textContent =
        data.scores.riesgoHereditario;

      document.getElementById("compatibilityScore").textContent =
        data.scores.compatibilidadGenetica;

      document.getElementById("suitabilityScore").textContent =
        data.scores.adecuacionObjetivo;

      document.getElementById("recommendation").textContent =
        data.professionalAssessment.recommendation;

      document.getElementById("warnings").textContent =
        data.professionalAssessment.warnings;

      resultSection.classList.remove("hidden");
      resultSection.scrollIntoView({ behavior: "smooth" });

    } catch (error) {
      console.error("❌ Error al generar análisis:", error);
      alert("Ocurrió un error al generar el análisis. Inténtalo de nuevo.");
    }
  });
});



