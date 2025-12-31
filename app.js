document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("analysisForm");
  const resultBox = document.getElementById("result");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const breed = document.getElementById("breed").value;
    const goal = document.getElementById("goal").value;
    const consanguinity = document.getElementById("consanguinity").value;

    const antecedentes = Array.from(
      document.querySelectorAll("input[name='antecedentes']:checked")
    ).map((el) => el.value);

    resultBox.innerHTML = "Analizando…";

    try {
      const res = await fetch(
        "https://breedingai-backend.onrender.com/analyze",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            breed,
            goal,
            consanguinity,
            antecedentes,
          }),
        }
      );

      if (!res.ok) throw new Error("Backend error");

      const data = await res.json();

      resultBox.innerHTML = `
        <h3>Resultado del análisis</h3>
        <p><strong>Veredicto:</strong> ${data.verdict}</p>
        <p><strong>Puntuación:</strong> ${data.score}</p>
        <p>${data.explanation}</p>
        <p><strong>Recomendación:</strong> ${data.recommendation}</p>
      `;
    } catch (err) {
      resultBox.innerHTML =
        "El análisis no está disponible en este momento.";
    }
  });
});





