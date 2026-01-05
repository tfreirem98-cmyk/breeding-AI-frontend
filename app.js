document.addEventListener("DOMContentLoaded", () => {
  const analyzeBtn = document.getElementById("analyze");
  const resultBox = document.getElementById("result");
  const proBox = document.getElementById("proBox");
  const proBtn = document.getElementById("pro");

  if (!analyzeBtn || !resultBox || !proBox) {
    console.error("Elementos clave no encontrados en el DOM");
    return;
  }

  const API_ANALYZE = "https://breedingai-backend.onrender.com/analyze";
  const API_STRIPE = "https://breedingai-backend.onrender.com/create-checkout-session";

  const MAX_FREE = 5;

  function getUses() {
    return Number(localStorage.getItem("breedingai_uses")) || 0;
  }

  function incrementUses() {
    const u = getUses() + 1;
    localStorage.setItem("breedingai_uses", u);
    return u;
  }

  function remainingUses() {
    return Math.max(0, MAX_FREE - getUses());
  }

  function collectAntecedentes() {
    return Array.from(
      document.querySelectorAll(".checkbox-group input[type='checkbox']:checked")
    ).map(cb => cb.value);
  }

  analyzeBtn.addEventListener("click", async () => {
    if (remainingUses() <= 0) {
      proBox.style.display = "block";
      return;
    }

    const raza = document.getElementById("raza").value;
    const objetivo = document.getElementById("objetivo").value;
    const consanguinidad = document.getElementById("consanguinidad").value;
    const antecedentes = collectAntecedentes();

    resultBox.innerHTML = "<p>Generando análisis profesional…</p>";

    try {
      const res = await fetch(API_ANALYZE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raza,
          objetivo,
          consanguinidad,
          antecedentes
        })
      });

      if (!res.ok) {
        throw new Error("Error backend");
      }

      const data = await res.json();

      resultBox.innerHTML = `
        <h3>Resultado del análisis</h3>
        <p><strong>Veredicto:</strong> ${data.verdict}</p>
        <p><strong>Puntuación:</strong> ${data.score}</p>
        <p>${data.explanation}</p>
        <p><strong>Recomendación:</strong> ${data.recommendation}</p>
        <p><em>Análisis gratuitos restantes: ${remainingUses() - 1}</em></p>
      `;

      incrementUses();

      if (remainingUses() <= 0) {
        proBox.style.display = "block";
      }

    } catch (err) {
      console.error(err);
      resultBox.innerHTML =
        "<p style='color:red'>No se pudo generar el análisis. Inténtalo de nuevo.</p>";
    }
  });

  if (proBtn) {
    proBtn.addEventListener("click", async () => {
      try {
        const res = await fetch(API_STRIPE, { method: "POST" });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
      } catch (err) {
        console.error("Error Stripe", err);
      }
    });
  }
});









