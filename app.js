document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://breedingai-backend.onrender.com";
  const MAX_FREE_USES = 5;

  // Botón "Generar análisis" (por texto)
  const generateBtn = Array.from(document.querySelectorAll("button"))
    .find(btn => btn.textContent.includes("Generar análisis"));

  // Contenedor de resultados (primer bloque grande bajo el botón)
  const resultContainer = document.querySelector("section:last-of-type, .result, .analysis, div[class*='result']");

  if (!generateBtn || !resultContainer) {
    console.error("Botón o contenedor de resultados no encontrado");
    return;
  }

  function getFreeUses() {
    return Number(localStorage.getItem("freeUses")) || 0;
  }

  function incrementFreeUses() {
    const uses = getFreeUses() + 1;
    localStorage.setItem("freeUses", uses);
    return uses;
  }

  function remainingUses() {
    return Math.max(0, MAX_FREE_USES - getFreeUses());
  }

  generateBtn.addEventListener("click", async () => {
    if (remainingUses() <= 0) {
      resultContainer.innerHTML += `
        <div class="pro-block">
          <h3>Has alcanzado el límite gratuito</h3>
          <button id="goPro">Pasar a PRO · 5€/mes</button>
        </div>
      `;
      document.getElementById("goPro")?.addEventListener("click", goPro);
      return;
    }

    const breed = document.querySelector("select").value;
    const selects = document.querySelectorAll("select");
    const objective = selects[1]?.value;
    const consanguinity = selects[2]?.value;

    const antecedentes = Array.from(
      document.querySelectorAll("input[type='checkbox']:checked")
    ).map(el => el.nextSibling.textContent.trim());

    resultContainer.innerHTML = "<p>Generando análisis con IA experta…</p>";

    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          breed,
          objective,
          consanguinity,
          antecedentes
        })
      });

      if (!res.ok) throw new Error("Backend error");

      const data = await res.json();

      resultContainer.innerHTML = `
        <h2>Resultado del análisis</h2>
        <div class="ai-analysis">
          ${data.analysis.replace(/\n/g, "<br>")}
        </div>
        <p><strong>Usos gratuitos restantes:</strong> ${remainingUses() - 1}</p>
      `;

      incrementFreeUses();

      if (remainingUses() <= 0) {
        resultContainer.innerHTML += `
          <div class="pro-block">
            <h3>Accede a análisis profesionales completos</h3>
            <button id="goPro">Pasar a PRO · 5€/mes</button>
          </div>
        `;
        document.getElementById("goPro")?.addEventListener("click", goPro);
      }

    } catch (err) {
      console.error(err);
      resultContainer.innerHTML = "<p>Error de conexión con el servidor</p>";
    }
  });

  async function goPro() {
    try {
      const res = await fetch(`${API_URL}/create-checkout-session`, {
        method: "POST"
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      console.error("Stripe error", e);
    }
  }
});










