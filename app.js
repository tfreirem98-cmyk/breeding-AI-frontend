document.addEventListener("DOMContentLoaded", () => {
  // 1. Localizar el formulario REAL
  const form = document.querySelector("form");
  if (!form) {
    console.error("Formulario no encontrado");
    return;
  }

  // 2. Localizar el botón REAL por texto
  const analyzeBtn = Array.from(document.querySelectorAll("button"))
    .find(btn => btn.textContent.toLowerCase().includes("generar"));

  if (!analyzeBtn) {
    console.error("Botón de análisis no encontrado");
    return;
  }

  // 3. Localizar contenedor de resultados REAL
  const resultBox = document.querySelector("#resultado, .resultado, .result-box, div");

  if (!resultBox) {
    console.error("Contenedor de resultados no encontrado");
    return;
  }

  analyzeBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    resultBox.innerHTML = "<p>Analizando cruce...</p>";

    const raza = document.querySelector("select").value;
    const selects = document.querySelectorAll("select");
    const objetivo = selects[1]?.value || "";
    const consanguinidad = selects[2]?.value || "";

    const antecedentes = Array.from(
      document.querySelectorAll("input[type='checkbox']:checked")
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

      resultBox.innerHTML = `
        <h3>Resultado del análisis</h3>
        <p><strong>Veredicto:</strong> ${data.verdict}</p>
        <p><strong>Puntuación:</strong> ${data.score}</p>
        <p>${data.explanation}</p>
        <p><strong>Recomendación:</strong> ${data.recommendation}</p>
        ${
          data.freeLeft !== undefined
            ? `<p><em>Usos gratuitos restantes: ${data.freeLeft}</em></p>`
            : ""
        }
      `;
    } catch (err) {
      console.error(err);
      resultBox.innerHTML =
        "<p style='color:red'>Error de conexión con el servidor</p>";
    }
  });
});











