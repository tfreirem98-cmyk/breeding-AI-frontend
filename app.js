document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");
  const resultContainer = document.getElementById("result");
  const proButton = document.getElementById("proButton");

  if (!generateBtn || !resultContainer) {
    console.error("Botón o contenedor de resultados no encontrado");
    return;
  }

  const API_URL = "https://breedingai-backend.onrender.com";
  const MAX_FREE_USES = 5;

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
      if (proButton) proButton.style.display = "block";
      return;
    }

    const breed = document.getElementById("breed").value;
    const objective = document.getElementById("objective").value;
    const consanguinity = document.getElementById("consanguinity").value;

    const antecedentes = Array.from(
      document.querySelectorAll("input[name='antecedentes']:checked")
    ).map((el) => el.value);

    resultContainer.innerHTML = "<p>Generando análisis con IA...</p>";

    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          breed,
          objective,
          consanguinity,
          antecedentes,
        }),
      });

      if (!res.ok) throw new Error("Error backend");

      const data = await res.json();

      if (!data.analysis) throw new Error("IA sin respuesta");

      resultContainer.innerHTML = `
        <h3>Resultado del análisis</h3>
        <div class="ai-analysis">
          ${data.analysis.replace(/\n/g, "<br>")}
        </div>
        <p><strong>Usos gratuitos restantes:</strong> ${
          remainingUses() - 1
        }</p>
      `;

      incrementFreeUses();

      if (remainingUses() <= 0 && proButton) {
        proButton.style.display = "block";
      }
    } catch (err) {
      console.error(err);
      resultContainer.innerHTML =
        "<p>Error de conexión con el servidor</p>";
    }
  });

  if (proButton) {
    proButton.addEventListener("click", async () => {
      try {
        const res = await fetch(`${API_URL}/create-checkout-session`, {
          method: "POST",
        });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
      } catch (err) {
        console.error("Error Stripe", err);
      }
    });
  }
});









