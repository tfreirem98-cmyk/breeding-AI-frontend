document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("analysisForm");
  const analyzeBtn = document.getElementById("analyzeBtn");
  const resultBox = document.getElementById("analysisResult");

  if (!form || !analyzeBtn || !resultBox) {
    console.error("Formulario, botón o contenedor de resultados no encontrado");
    return;
  }

  analyzeBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    resultBox.innerHTML = "<p>Analizando cruce...</p>";

    const raza = document.getElementById("breed").value;
    const objetivo = document.getElementById("goal").value;
    const consanguinidad = document.getElementById("inbreeding").value;

    const antecedentes = Array.from(
      document.querySelectorAll("input[name='antecedentes']:checked")
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

    } catch (error) {
      console.error(error);
      resultBox.innerHTML =
        "<p style='color:red'>Error de conexión con el servidor</p>";
    }
  });
});










