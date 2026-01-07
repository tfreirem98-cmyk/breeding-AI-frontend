document.addEventListener("DOMContentLoaded", () => {
  const analyzeBtn = document.getElementById("analyze");
  const resultBox = document.getElementById("result");
  const proBox = document.getElementById("proBox");
  const proBtn = document.getElementById("pro");

  const API_ANALYZE = "https://breedingai-backend.onrender.com/analyze";
  const API_STRIPE = "https://breedingai-backend.onrender.com/create-checkout-session";

  const MAX_FREE = 3;

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

    if (!raza) {
      resultBox.innerHTML = "<p class='error'>Selecciona una raza para continuar.</p>";
      return;
    }

    resultBox.innerHTML = "<p class='loading'>Generando informe profesional…</p>";

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

      if (!res.ok) throw new Error("Backend error");

      const data = await res.json();

      resultBox.innerHTML = `
        <div class="report">

          <div class="report-header">
            <h3>Informe de evaluación genética</h3>
            <span class="badge ${data.verdict.replace(" ", "-").toLowerCase()}">
              ${data.verdict}
            </span>
          </div>

          <div class="report-meta">
            <div><strong>Raza:</strong> ${raza}</div>
            <div><strong>Objetivo:</strong> ${objetivo}</div>
            <div><strong>Consanguinidad:</strong> ${consanguinidad}</div>
            <div><strong>Puntuación:</strong> ${data.score}</div>
          </div>

          <div class="report-section">
            <h4>Análisis profesional</h4>
            <p>${data.explanation.replace(/\n/g, "<br><br>")}</p>
          </div>

          <div class="report-recommendation">
            <h4>Recomendación experta</h4>
            <p>${data.recommendation}</p>
          </div>

          <div class="report-footer">
            Análisis gratuitos restantes: ${remainingUses() - 1}
          </div>

        </div>
      `;

      incrementUses();

      if (remainingUses() <= 0) {
        proBox.style.display = "block";
      }

    } catch (err) {
      console.error(err);
      resultBox.innerHTML =
        "<p class='error'>No se pudo generar el análisis. Inténtalo de nuevo.</p>";
    }
  });

  proBtn.addEventListener("click", async () => {
    try {
      const res = await fetch(API_STRIPE, { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error("Error Stripe", err);
    }
  });
});












