document.addEventListener("DOMContentLoaded", () => {
  const analyzeBtn = document.getElementById("analyzeBtn");
  const proBtn = document.getElementById("proBtn");
  const resultBox = document.getElementById("result");

  // =========================
  // ANALYSIS BUTTON
  // =========================
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
      const res = await fetch("https://TU-BACKEND-RENDER.onrender.com/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raza,
          objetivo,
          consanguinidad,
          antecedentes
        })
      });

      if (!res.ok) throw new Error("Analyze failed");

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
        "El análisis no está disponible en este momento. Inténtalo de nuevo.";
    }
  });

  // =========================
  // PRO BUTTON (STRIPE)
  // =========================
  proBtn.addEventListener("click", async () => {
    try {
      const res = await fetch(
        "https://TU-BACKEND-RENDER.onrender.com/create-checkout-session",
        {
          method: "POST"
        }
      );

      if (!res.ok) throw new Error("Stripe session error");

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("No se pudo iniciar el pago.");
      }
    } catch (err) {
      alert("Error al conectar con el sistema de pago.");
    }
  });
});







