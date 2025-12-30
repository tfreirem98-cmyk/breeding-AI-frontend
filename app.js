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

    // Estado inicial
    resultSection.style.display = "block";
    verdictBadge.textContent = "ANALIZANDO...";
    verdictBadge.className = "badge moderate";
    riskScoreEl.textContent = "-";
    analysisTextEl.textContent = "Procesando información genética y criterios de cría...";
    recommendationTextEl.textContent = "";

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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            breed,
            goal,
            inbreeding,
            conditions,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error en backend");
      }

      const data = await response.json();

      // Badge visual
      let badgeClass = "badge moderate";
      if (data.verdict === "APTO") badgeClass = "badge low";
      if (data.verdict === "NO RECOMENDADO") badgeClass = "badge high";

      verdictBadge.className = badgeClass;
      verdictBadge.textContent = data.verdict;
      riskScoreEl.textContent = data.riskScore;

      // TEXTO PROFESIONAL (AQUÍ ESTÁ EL VALOR)
      analysisTextEl.textContent = generarInformeProfesional({
        breed,
        goal,
        inbreeding,
        conditions,
        verdict: data.verdict,
        riskScore: data.riskScore,
      });

      recommendationTextEl.textContent =
        generarRecomendacionProfesional({
          goal,
          inbreeding,
          conditions,
          verdict: data.verdict,
        });

    } catch (error) {
      console.error(error);
      verdictBadge.className = "badge high";
      verdictBadge.textContent = "ERROR";
      analysisTextEl.textContent =
        "No se ha podido completar el análisis en este momento.";
      recommendationTextEl.textContent =
        "Inténtalo de nuevo más tarde o revisa la conexión.";
    }
  });
});

/* ===========================
   GENERADORES DE TEXTO
=========================== */

function generarInformeProfesional({
  breed,
  goal,
  inbreeding,
  conditions,
  verdict,
  riskScore,
}) {
  let texto = `El cruce analizado para la raza ${breed} ha sido evaluado teniendo en cuenta el objetivo de cría (${goal}), el nivel de consanguinidad (${inbreeding}) y los antecedentes clínicos conocidos. `;

  if (conditions.length > 0) {
    texto += `Se han identificado antecedentes relevantes (${conditions.join(
      ", "
    )}), lo que incrementa el nivel de atención requerido en este cruce. `;
  }

  if (verdict === "APTO") {
    texto +=
      "El análisis indica que el cruce es compatible desde un punto de vista genético y funcional, siempre que se mantengan controles básicos de selección.";
  }

  if (verdict === "RIESGO MODERADO") {
    texto +=
      "El resultado muestra un riesgo moderado, lo que sugiere que el cruce no es descartable, pero sí requiere una planificación cuidadosa y medidas preventivas.";
  }

  if (verdict === "NO RECOMENDADO") {
    texto +=
      "El nivel de riesgo detectado es elevado. Desde un punto de vista profesional, este cruce no es recomendable sin pruebas genéticas exhaustivas y asesoramiento especializado.";
  }

  texto += ` La puntuación global de riesgo obtenida es ${riskScore} sobre 10.`;

  return texto;
}

function generarRecomendacionProfesional({
  goal,
  inbreeding,
  conditions,
  verdict,
}) {
  if (verdict === "APTO") {
    return "Mantener controles sanitarios regulares y evitar aumentar el grado de consanguinidad en futuras generaciones.";
  }

  if (verdict === "RIESGO MODERADO") {
    return "Se recomienda realizar pruebas genéticas específicas, limitar la consanguinidad y seleccionar cuidadosamente los ejemplares reproductores.";
  }

  return "Este cruce debería reevaluarse con test genéticos completos, reducción de consanguinidad y asesoramiento veterinario especializado antes de considerar su ejecución.";
}








