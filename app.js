const API_URL = "https://breedingai-backend.onrender.com";

// Elementos principales
const analyzeBtn = document.getElementById("analyze");
const resultBox = document.getElementById("result");
const proBox = document.getElementById("proBox");
const proBtn = document.getElementById("pro");

// Elementos del resultado estructurado
const verdictBadge = document.getElementById("verdictBadge");
const scoreBadge = document.getElementById("scoreBadge");
const summaryText = document.getElementById("summaryText");
const factorsList = document.getElementById("factorsList");
const alertsList = document.getElementById("alertsList");

// =======================
// ANALYZE (FREE)
// =======================
analyzeBtn.addEventListener("click", async () => {
  // Reset visual
  proBox.style.display = "none";
  verdictBadge.textContent = "";
  scoreBadge.textContent = "";
  summaryText.textContent = "";
  factorsList.innerHTML = "";
  alertsList.innerHTML = "";

  resultBox.style.display = "block";
  summaryText.textContent = "Analizando cruce...";

  // Obtener valores
  const raza = document.getElementById("raza").value;
  const objetivo = document.getElementById("objetivo").value;
  const consanguinidad = document.getElementById("consanguinidad").value;
  const antecedentes = [...document.querySelectorAll("input:checked")].map(
    el => el.value
  );

  try {
    const res = await fetch(`${API_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        raza,
        objetivo,
        consanguinidad,
        antecedentes
      })
    });

    const data = await res.json();

    // =======================
    // LÍMITE FREE ALCANZADO
    // =======================
    if (res.status === 403) {
      summaryText.textContent = data.message;
      proBox.style.display = "block";
      return;
    }

    const resultado = data.resultado;

    // =======================
    // RENDER RESULTADO
    // =======================
    verdictBadge.textContent = resultado.verdict;
    scoreBadge.textContent = `Puntuación: ${resultado.score}/10`;
    summaryText.textContent = resultado.summary;

    // Factores
    resultado.factors.forEach(factor => {
      const li = document.createElement("li");
      li.textContent = factor;
      factorsList.appendChild(li);
    });

    // Alertas
    if (resultado.alerts.length === 0) {
      const li = document.createElement("li");
      li.textContent = "No se han detectado alertas críticas.";
      alertsList.appendChild(li);
    } else {
      resultado.alerts.forEach(alert => {
        const li = document.createElement("li");
        li.textContent = alert;
        alertsList.appendChild(li);
      });
    }

  } catch (error) {
    summaryText.textContent =
      "Ha ocurrido un error al generar el análisis. Inténtalo de nuevo.";
    console.error(error);
  }
});

// =======================
// STRIPE PRO
// =======================
proBtn.addEventListener("click", async () => {
  try {
    const res = await fetch(
      `${API_URL}/create-checkout-session`,
      { method: "POST" }
    );
    const data = await res.json();
    window.location.href = data.url;
  } catch (error) {
    alert("No se pudo iniciar el pago. Inténtalo más tarde.");
    console.error(error);
  }
});






