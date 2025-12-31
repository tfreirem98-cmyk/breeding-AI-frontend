document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("analysis-form");
  const resultCard = document.getElementById("result");

  const verdictEl = document.getElementById("verdict");
  const scoreEl = document.getElementById("score");
  const summaryEl = document.getElementById("summary");
  const recommendationEl = document.getElementById("recommendation");

  if (!form) {
    console.error("Formulario no encontrado");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // ==== INPUTS ====
    const breed = document.getElementById("breed").value;
    const goal = document.getElementById("goal").value;
    const inbreeding = document.getElementById("inbreeding").value;

    const conditions = Array.from(
      document.querySelectorAll("fieldset input[type='checkbox']:checked")
    ).map((el) => el.value);

    if (!breed) {
      alert("Selecciona una raza");
      return;
    }

    // ==== UI: estado de carga ====
    resultCard.classList.remove("hidden");
    verdictEl.textContent = "Analizando…";
    scoreEl.textContent = "—";
    summaryEl.textContent =
      "Procesando información genética y criterios de cría.";
    recommendationEl.textContent = "";

    // ==== BACKEND ====
    try {
      const response = await fetch(
        "https://breedingai-backend.onrender.com/analyze",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            breed,
            goal,
            consanguinity: inbreeding,
            antecedentes: conditions,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error en el backend");
      }

      const data = await response.json();

      // ==== VEREDICTO ====
      verdictEl.textContent = data.verdict;
      scoreEl.textContent = `${data.score} / 10`;

      // ==== TEXTO PREMIUM (VALOR REAL) ====
      summaryEl.textContent = generarResumenProfesional({
        breed,
        goal,
        inbreeding,
        conditions,
        verdict: data.verdict,
      });

      recommendationEl.textContent = generarRecomendacion({
        verdict: data.verdict,
        goal,
        inbreeding,
        conditions,
      });
    } catch (error) {
      console.error(error);
      verdictEl.textContent = "Error";
      scoreEl.textContent = "—";
      summaryEl.textContent =
        "No se ha podido completar el análisis en este momento.";
      recommendationEl.textContent =
        "Inténtalo de nuevo más tarde o revisa tu conexión.";
    }
  });
});

/* =================================================
   GENERADORES DE TEXTO (DIFERENCIAL DEL PRODUCTO)
================================================= */

function generarResumenProfesional({
  breed,
  goal,
  inbreeding,
  conditions,
  verdict,
}) {
  let texto = `El cruce analizado para la raza ${breed} ha sido evaluado teniendo en cuenta el objetivo de cría (${goal}), el nivel estimado de consanguinidad (${inbreeding}) y los antecedentes clínicos disponibles. `;

  if (conditions.length > 0) {
    texto += `Se han identificado antecedentes relevantes (${conditions.join(
      ", "
    )}), lo que incrementa el nivel de atención requerido. `;
  } else {
    texto +=
      "No se han declarado antecedentes clínicos relevantes en los progenitores. ";
  }

  if (verdict === "RIESGO BAJO") {
    texto +=
      "Desde un punto de vista profesional, el cruce es compatible y no presenta señales de riesgo significativo en las condiciones actuales.";
  }

  if (verdict === "RIESGO MODERADO") {
    texto +=
      "El análisis indica un riesgo moderado. El cruce no es descartable, pero requiere planificación, control genético y seguimiento sanitario.";
  }

  if (verdict === "RIESGO ALTO") {
    texto +=
      "El nivel de riesgo detectado es elevado. Este cruce no se considera recomendable sin pruebas genéticas exhaustivas y asesoramiento especializado.";
  }

  return texto;
}

function generarRecomendacion({
  verdict,
  goal,
  inbreeding,
  conditions,
}) {
  if (verdict === "RIESGO BAJO") {
    return "Mantener controles sanitarios regulares y evitar aumentar la consanguinidad en futuras generaciones.";
  }

  if (verdict === "RIESGO MODERADO") {
    return "Se recomienda realizar pruebas genéticas específicas, limitar la consanguinidad y seleccionar cuidadosamente los ejemplares reproductores.";
  }

  return "Este cruce debería reevaluarse con test genéticos completos, reducción de consanguinidad y asesoramiento veterinario especializado antes de considerar su ejecución.";
}





