const API = "https://breedingai-backend.vercel.app";

document.getElementById("analysisForm").addEventListener("submit", async e => {
  e.preventDefault();

  const data = {
    breed: breed.value,
    goal: goal.value,
    inbreeding: inbreeding.value,
    issues: [...document.querySelectorAll("input[name=issues]:checked")].map(i => i.value)
  };

  result.innerHTML = "Generando análisis profesional...";

  try {
    const r = await fetch(`${API}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const res = await r.json();

    result.innerHTML = `
      <h3>${res.verdict}</h3>
      <p><strong>Compatibilidad genética:</strong> ${res.genetic}/10</p>
      <p><strong>Riesgo hereditario:</strong> ${res.risk}/10</p>
      <p><strong>Adecuación al objetivo:</strong> ${res.suitability}/10</p>
      <hr/>
      <p>${res.report}</p>
    `;
  } catch {
    result.innerHTML = "Error al generar el análisis.";
  }
});

/* ===== STRIPE ===== */
async function subscribe(priceId) {
  const r = await fetch(`${API}/create-checkout-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      priceId,
      successUrl: window.location.href,
      cancelUrl: window.location.href
    })
  });
  const { url } = await r.json();
  window.location.href = url;
}




