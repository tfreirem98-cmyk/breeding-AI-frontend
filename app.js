document.addEventListener("DOMContentLoaded", () => {
  const analyzeBtn = document.getElementById("analyzeBtn");
  const proBtn = document.getElementById("proBtn");
  const resultBox = document.getElementById("result");

  /* ===============================
     ANALYZE
  ================================ */
  analyzeBtn.addEventListener("click", async () => {
    resultBox.innerHTML = "Analizando...";

    const raza = document.getElementById("raza").value;
    const objetivo = document.getElementById("objetivo").value;
    const consanguinidad = document.getElementById("consanguinidad").value;

    const antecedentes = [];
    document
      .querySelectorAll("input[name='antecedentes']:checked")
      .forEach((el) => antecedentes.push(el.value));

    try {
      const res = await fetch(
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

      if (!res.ok) throw new Error();

      const data = await res.json();

      resultBox.innerHTML = `
        <h3>Resultado del análisis</h3>
        <p><strong>Veredicto:</strong> ${data.verdict}</p>
        <p><strong>Puntuación:</strong> ${data.score}</p>
        <p>${data.explanation}</p>
        <p><strong>Recomendación:</strong> ${data.recommendation}</p>
      `;
    } catch {
      resultBox.innerHTML =
        "El análisis no está disponible en este momento.";
    }
  });

  /* ===============================
     STRIPE PRO
  ================================ */
  proBtn.addEventListener("click", async () => {
    try {
      const res = await fetch(
        "https://breedingai-backend.onrender.com/create-checkout-session",
        { method: "POST" }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      window.location.href = data.url;
    } catch {
      alert("No se pudo iniciar el pago.");
    }
  });
});







