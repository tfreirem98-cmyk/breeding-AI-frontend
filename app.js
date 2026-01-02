document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("analysisForm");
  const resultContainer = document.getElementById("analysisResult");
  const freeCounter = document.getElementById("freeUses");
  const proBlock = document.getElementById("proBlock");
  const proButton = document.getElementById("goProBtn");

  if (!form || !resultContainer) {
    console.error("Formulario o contenedor de resultados no encontrado");
    return;
  }

  // ===== CONFIG =====
  const API_URL = "https://breedingai-backend.onrender.com";
  const MAX_FREE_USES = 5;

  // ===== FREE USES =====
  function getFreeUses() {
    return Number(localStorage.getItem("freeUses")) || 0;
  }

  function incrementFreeUses() {
    const uses = getFreeUses() + 1;
    localStorage.setItem("freeUses", uses);
    return uses;
  }

  function updateFreeUI() {
    const remaining = MAX_FREE_USES - getFreeUses();
    if (freeCounter) {
      freeCounter.textContent = remaining > 0 ? remaining : 0;
    }

    if (remaining <= 0 && proBlock) {
      proBlock.style.display = "block";
    }
  }

  updateFreeUI();

  // ===== FORM SUBMIT =====
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (getFreeUses() >= MAX_FREE_USES) {
      if (proBlock) proBlock.style.display = "block";
      return;
    }

    const formData = new FormData(form);

    const payload = {
      breed: formData.get("breed"),
      objective: formData.get("objective"),
      consanguinity: formData.get("consanguinity"),
      antecedentes: formData.getAll("antecedentes"),
    };

    resultContainer.innerHTML = "<p>Generando análisis con IA...</p>";

    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Error en el servidor");
      }

      const data = await res.json();

      if (!data.analysis) {
        throw new Error("Respuesta IA inválida");
      }

      // ===== RENDER IA RESULT =====
      resultContainer.innerHTML = `
        <h3>Resultado del análisis</h3>
        <div class="ai-analysis">
          ${data.analysis.replace(/\n/g, "<br>")}
        </div>
      `;

      incrementFreeUses();
      updateFreeUI();
    } catch (err) {
      console.error(err);
      resultContainer.innerHTML =
        "<p>Error de conexión con el servidor</p>";
    }
  });

  // ===== STRIPE =====
  if (proButton) {
    proButton.addEventListener("click", async () => {
      try {
        const res = await fetch(`${API_URL}/create-checkout-session`, {
          method: "POST",
        });

        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        }
      } catch (err) {
        console.error("Error Stripe", err);
      }
    });
  }
});








