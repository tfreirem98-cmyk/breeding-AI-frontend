document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("analysisForm");
  const result = document.getElementById("result");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const raza = document.getElementById("raza").value;
    const objetivo = document.getElementById("objetivo").value;
    const consanguinidad = document.getElementById("consanguinidad").value;

    const antecedentes = Array.from(
      document.querySelectorAll(".checkbox-group input:checked")
    ).map(cb => cb.value);

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

    if (data.error) {
      alert(data.error);
      return;
    }

    document.getElementById("classification").textContent = data.classification;
    document.getElementById("riskScore").textContent = data.scores.riesgoHereditario;
    document.getElementById("compatibilityScore").textContent = data.scores.compatibilidadGenetica;
    document.getElementById("suitabilityScore").textContent = data.scores.adecuacionObjetivo;

    document.getElementById("recommendation").textContent =
      data.professionalAssessment.recommendation;

    document.getElementById("warnings").textContent =
      data.professionalAssessment.warnings;

    result.classList.remove("hidden");
    result.scrollIntoView({ behavior: "smooth" });
  });
});



