document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("analysis-form");
  const resultBox = document.getElementById("analysis-result");

  if (!form || !resultBox) {
    console.error("Formulario o contenedor de resultados no encontrado");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    resultBox.textContent = "Analizando cruce...";
    resultBox.style.display = "block";

    const breed = document.getElementById("breed").value;
    const goal = document.getElementById("goal").value;
    const inbreeding = document.getElementById("inbreeding").value;

    const conditions = [];
    document
      .querySelectorAll("input[name='conditions']:checked")
      .forEach((c) => conditions.push(c.value));

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
        throw new Error("Respuesta inválida del servidor");
      }

      const data = await response.json();

      resultBox.innerHTML = `
        <h3>Resultado del análisis</h3>
        <p><strong>Veredicto:</strong> ${data.verdict}</p>
        <p><strong>Puntuación de riesgo:</strong> ${data.riskScore}</p>
        <p>${data.explanation}</p>
        <p><strong>Recomendación:</strong> ${data.recommendations}</p>
      `;
    } catch (error) {
      console.error(error);
      resultBox.textContent =
        "El análisis no está disponible en este momento. Inténtalo de nuevo.";
    }
  });
});






